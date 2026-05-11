// Shared test harness used by every spec under tests/specs/.
// Provides:
//   - launchBrowser() / closeBrowser()
//   - withPage(url, opts, fn) — opens a fresh context, pre-seeds userId so
//     the Run button is enabled, captures pageerrors and console, runs the
//     callback, and tears down even on failure.
//   - step(name, fn) — runs an assertion in the context of the current spec,
//     records pass/fail/error/duration into the shared results array.
//   - results — flat array of { spec, name, status, message, durationMs,
//     screenshotPath?, errors[] }
//
// Specs export: `default async function run({ withPage, step, expect, ... })`

import { chromium } from 'playwright';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

export const BASE_URL = process.env.WEBIDE_TEST_BASE || 'http://localhost:8765';

// Browser executable resolution order:
//   1. WEBIDE_TEST_CHROMIUM env var (sandbox, custom installs)
//   2. /opt/pw-browsers/chromium-1194/chrome-linux/chrome (this sandbox)
//   3. undefined  ⇒ Playwright finds its own installed browser, the way it
//      does after `npx playwright install chromium` (GitHub Actions, local
//      `npm install playwright && npx playwright install`)
import { existsSync } from 'node:fs';
let CHROMIUM_EXE = process.env.WEBIDE_TEST_CHROMIUM || null;
if (!CHROMIUM_EXE) {
    const sandbox = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
    if (existsSync(sandbox)) CHROMIUM_EXE = sandbox;
}

export const results = [];
let _browser = null;
let _currentSpec = null;
let _shotsDir = null;
let _shotCounter = 0;

export function setSpec(specName) {
    _currentSpec = specName;
}

export function setShotsDir(dir) {
    _shotsDir = dir;
    mkdirSync(dir, { recursive: true });
}

export async function launchBrowser() {
    const opts = { headless: true, args: ['--no-sandbox'] };
    if (CHROMIUM_EXE) opts.executablePath = CHROMIUM_EXE;
    _browser = await chromium.launch(opts);
    return _browser;
}

export async function closeBrowser() {
    if (_browser) { await _browser.close(); _browser = null; }
}

/**
 * Run a callback in a fresh browser context.
 * @param {string} url — relative or absolute. Relative → BASE_URL prepended.
 * @param {object} opts — { waitMs, viewport, login, initScript }
 * @param {(page, ctx) => Promise<void>} fn
 */
export async function withPage(url, opts, fn) {
    if (typeof opts === 'function') { fn = opts; opts = {}; }
    opts = opts || {};
    const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
    const viewport = opts.viewport || { width: 1280, height: 800 };
    const ctx = await _browser.newContext({ viewport });
    if (opts.login !== false) {
        await ctx.addInitScript(() => {
            try { localStorage.setItem('userId', 'testuser'); } catch (e) {}
        });
    }
    if (opts.initScript) await ctx.addInitScript(opts.initScript);

    const page = await ctx.newPage();
    const consoleMessages = [];
    const pageErrors = [];
    page.on('console', m => consoleMessages.push(`[${m.type()}] ${m.text()}`));
    page.on('pageerror', e => pageErrors.push(e.message));
    try {
        await page.goto(fullUrl, { waitUntil: 'load', timeout: 45000 });
    } catch (e) {
        await ctx.close();
        throw new Error(`Navigation to ${fullUrl} failed: ${e.message}`);
    }
    // Most pages need ~3s for ace + xterm + brython init
    await page.waitForTimeout(opts.waitMs ?? 3500);
    try {
        return await fn(page, { consoleMessages, pageErrors, ctx });
    } finally {
        await ctx.close();
    }
}

/**
 * Run one assertion. Records into results[] and continues regardless of
 * outcome so the suite keeps going after individual failures.
 */
export async function step(name, fn, opts = {}) {
    const t0 = Date.now();
    let status = 'pass', message = '', errMsg = null;
    try {
        const r = await fn();
        if (r && r.message) message = r.message;
    } catch (e) {
        status = 'fail';
        errMsg = e.stack || String(e);
        message = e.message || String(e);
    }
    const durationMs = Date.now() - t0;
    results.push({
        spec: _currentSpec || 'unknown',
        name,
        status,
        message,
        durationMs,
        error: errMsg,
        meta: opts.meta || null,
    });
    const icon = status === 'pass' ? '✓' : '✗';
    const tag = `[${_currentSpec}]`.padEnd(28);
    console.log(`  ${icon} ${tag} ${name}${message ? ' — ' + message : ''}`);
    return status === 'pass';
}

/**
 * Take a screenshot, store under tests/reports/screens/<spec>-<n>.png,
 * and attach the path to the most recent result for inclusion in the
 * HTML report.
 */
export async function snap(page, label) {
    if (!_shotsDir) return null;
    _shotCounter++;
    const safe = label.replace(/[^a-z0-9_]/gi, '_').slice(0, 40);
    const file = `${String(_shotCounter).padStart(2, '0')}-${_currentSpec}-${safe}.png`;
    const full = path.join(_shotsDir, file);
    try {
        await page.screenshot({ path: full });
        const last = results[results.length - 1];
        if (last) {
            last.screenshots = last.screenshots || [];
            last.screenshots.push(file);
        }
        return full;
    } catch (e) {
        return null;
    }
}

/** Tiny assertion helpers — keep them dependency-free. */
export const expect = {
    truthy(v, msg) { if (!v) throw new Error(msg || `expected truthy, got ${v}`); },
    equal(a, b, msg) { if (a !== b) throw new Error(msg || `expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); },
    contains(haystack, needle, msg) {
        if (!String(haystack).includes(needle)) throw new Error(msg || `expected to contain "${needle}", got "${String(haystack).slice(0, 200)}"`);
    },
    matches(haystack, re, msg) {
        if (!re.test(String(haystack))) throw new Error(msg || `expected to match ${re}, got "${String(haystack).slice(0, 200)}"`);
    },
    greater(a, b, msg) { if (!(a > b)) throw new Error(msg || `expected ${a} > ${b}`); },
};
