// Drives one exercise through the WebIDE end-to-end:
//   1. open the exercise URL,
//   2. wait for the IDE to boot + Run button to be enabled,
//   3. for each file in `solutions`, switch to its tab and rewrite the
//      content (using window.openFiles + ace_editor + saveActiveTabs),
//   4. click Run,
//   5. wait for the autograder to settle and report pass/fail.
//
// Used by tests/exercises/run-all-exercises.mjs to verify every
// _pages/Ursinus-Exercises/* exercise has at least one working solution
// after our changes.

import { existsSync } from 'node:fs';

let CHROMIUM_EXE = process.env.WEBIDE_TEST_CHROMIUM || null;
if (!CHROMIUM_EXE) {
    const sandbox = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
    if (existsSync(sandbox)) CHROMIUM_EXE = sandbox;
}

export const BASE_URL = process.env.WEBIDE_TEST_BASE || 'http://localhost:8765';

async function waitForReady(page) {
    await page.waitForFunction(() => {
        const t = document.querySelector('.tab.active');
        return typeof window.ace_editor !== 'undefined' && window.ace_editor &&
               t && t.id && t.id !== '__submit_form__' &&
               document.getElementById('run') && !document.getElementById('run').disabled;
    }, { timeout: 30000 });
}

export async function runExercise(browser, opts) {
    const {
        url, solutions = {}, label = url,
        runTimeoutMs = 60000, postRunWaitMs = 2500,
        warmupMs = 0,             // extra wait for Pyodide/CDN downloads
        injectMainText = null,    // workaround for exercise defs missing an ismain: true file
    } = opts;
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const isCI = process.env.CI || process.env.GITHUB_ACTIONS;
    await ctx.addInitScript((ciMode) => {
        try {
            localStorage.setItem('userId', 'testuser');
            // Set CI mode flag to prevent form submissions to external services during tests
            if (ciMode) {
                localStorage.setItem('webide_ci_mode', 'true');
            }
        } catch (e) {}
    }, isCI);
    const page = await ctx.newPage();
    const consoleMsgs = [];
    const pageErrors = [];
    page.on('console', m => consoleMsgs.push('[' + m.type() + '] ' + m.text().slice(0, 200)));
    page.on('pageerror', e => pageErrors.push(e.message));

    let result;
    try {
        const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
        await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await waitForReady(page);
        if (warmupMs) await page.waitForTimeout(warmupMs);

        // For each solution file, find the open tab whose path ends with that
        // filename, switch to it, replace editor content, save.
        const writeOut = await page.evaluate(async (sols) => {
            const out = { wrote: [], notFound: [] };
            for (const [fname, code] of Object.entries(sols)) {
                let foundPath = null;
                if (window.openFiles) {
                    for (const p of Object.keys(window.openFiles)) {
                        if (p.endsWith('/' + fname) || p.endsWith(fname)) {
                            foundPath = p; break;
                        }
                    }
                }
                if (!foundPath) { out.notFound.push(fname); continue; }
                if (typeof setActiveTab === 'function') {
                    await setActiveTab(foundPath);
                }
                window._settingEditorValue = true;
                window.ace_editor.setValue(code, 1);
                window._settingEditorValue = false;
                window.openFiles[foundPath].content = code;
                window.openFiles[foundPath].modified = true;
                if (typeof saveActiveTabs === 'function') saveActiveTabs();
                out.wrote.push(foundPath);
            }
            // Allow IndexedDB writes to flush
            await new Promise(r => setTimeout(r, 200));
            return out;
        }, solutions);

        // Workaround for exercise defs that are missing an `ismain: true`
        // file (e.g., Java/exercise-drill-arraymean.md): write a synthetic
        // ismain entry directly into IndexedDB so getMainCodeText() can find
        // something to invoke (e.g., `Tester.main(null);`).
        if (injectMainText) {
            await page.evaluate(async (mainCode) => {
                // Derive the directory prefix from any already-open file.
                const sample = Object.keys(window.openFiles || {})[0];
                if (!sample) return;
                const dir = sample.substring(0, sample.lastIndexOf('/'));
                const path = dir + '/__injected_main__.java';
                await new Promise((resolve, reject) => {
                    const req = indexedDB.open('CodeIDB');
                    req.onsuccess = (e) => {
                        const db = e.target.result;
                        const tx = db.transaction('Files', 'readwrite');
                        tx.objectStore('Files').put({
                            path, content: mainCode,
                            readOnly: true, excludeFromExport: true, ismain: true,
                        });
                        tx.oncomplete = resolve;
                        tx.onerror = (ev) => reject(ev.target.error);
                    };
                    req.onerror = (ev) => reject(ev.target.error);
                });
                await new Promise(r => setTimeout(r, 100));
            }, injectMainText);
        }

        // For Pyodide pages, wait for pyodide to load before clicking Run.
        const pageLang = await page.evaluate(() => window._PAGE_LANG || '');
        if (pageLang === 'pyodide') {
            try {
                await page.waitForFunction(
                    () => window.pyodide && typeof window.pyodide.runPython === 'function',
                    { timeout: 180000 },
                );
            } catch (e) { /* fall through; Run may still work if CDN warms */ }
        }

        // Reset autograder state in case the page had a stale value
        await page.evaluate(() => {
            window.correctlyAnswered = false;
            window.numAttempts = 0;
            window.feedbackString = '';
        });

        // Click Run
        await page.click('#run', { timeout: 5000 });

        // Wait for run to finish: either correctlyAnswered=true OR numAttempts>0
        try {
            await page.waitForFunction(
                () => window.correctlyAnswered === true || (window.numAttempts | 0) > 0,
                { timeout: runTimeoutMs },
            );
        } catch (e) {
            // timeout: capture state anyway
        }
        await page.waitForTimeout(postRunWaitMs);

        // For async runtimes (Prolog, Pyodide) checkAnswer fires before
        // feedbackString is populated. Re-run it now that feedback has had
        // time to land.
        try {
            await page.evaluate(async () => {
                if (typeof window.feedbackString === 'string' && window.feedbackString.length > 0
                    && !window.correctlyAnswered && typeof window.checkAnswer === 'function') {
                    window.numAttempts = Math.max(0, (window.numAttempts | 0) - 1); // don't double-bump
                    await window.checkAnswer();
                }
            });
        } catch (e) {}

        result = await page.evaluate(() => ({
            correct: window.correctlyAnswered === true,
            attempts: window.numAttempts | 0,
            feedback: (typeof window.feedbackString !== 'undefined') ? String(window.feedbackString || '').slice(0, 400) : '',
            consoleText: (document.getElementById('console')?.innerText || '').slice(-2000),
        }));
        result.wroteFiles = writeOut.wrote;
        result.missingFiles = writeOut.notFound;
    } catch (err) {
        result = { correct: false, error: err.message, attempts: 0, feedback: '', consoleText: '' };
    } finally {
        await ctx.close();
    }

    return {
        label,
        url,
        ...result,
        consoleMsgs: consoleMsgs.slice(-20),
        pageErrors: pageErrors.slice(-5),
    };
}
