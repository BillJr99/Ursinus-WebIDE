// Exercise verification harness.
//
// Can be used two ways:
//
//  1. Imported by runner.mjs:
//       import { runAllExercises } from './exercises/run-all-exercises.mjs';
//       const records = await runAllExercises({ browser, filter });
//     Returns result records in the same shape as the harness results[] array
//     so they flow into report.mjs unchanged.
//
//  2. Standalone (manual re-run without the full suite):
//       node tests/exercises/run-all-exercises.mjs           # all
//       node tests/exercises/run-all-exercises.mjs java      # filter by label substring
//     Writes tests/reports/exercise-report.md and exits.

import { chromium } from 'playwright';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runExercise } from './run-exercise.mjs';
import { EXERCISES } from './solutions.mjs';
import { findMissing } from './discover.mjs';

const SPEC_NAME = 'exercises';

function resolveChromium() {
    let exe = process.env.WEBIDE_TEST_CHROMIUM || null;
    if (!exe && existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')) {
        exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
    }
    return exe;
}

/**
 * Run every exercise (filtered optionally) through the WebIDE autograder.
 * Accepts a shared `browser` from the main runner to avoid re-launching Chromium.
 * Returns an array of result records compatible with harness results[].
 */
export async function runAllExercises({ browser = null, filter = '' } = {}) {
    const list = filter
        ? EXERCISES.filter(e => e.label.toLowerCase().includes(filter.toLowerCase()))
        : EXERCISES;

    const ownBrowser = browser === null;
    if (ownBrowser) {
        const exe = resolveChromium();
        browser = await chromium.launch({
            headless: true, args: ['--no-sandbox'],
            ...(exe ? { executablePath: exe } : {}),
        });
    }

    const records = [];
    const t0 = Date.now();

    for (const ex of list) {
        const label = ex.label;
        if (ex.skip) {
            console.log(`  ⊘ ${label} — skipped: ${ex.skip}`);
            records.push({
                spec: SPEC_NAME, name: label,
                status: 'skip', message: ex.skip, durationMs: 0, error: null,
            });
            continue;
        }

        const itemT0 = Date.now();
        process.stdout.write(`  … ${label}`);
        try {
            const r = await runExercise(browser, {
                url: ex.url,
                solutions: ex.files,
                label,
                ...(ex.opts || {}),
            });
            const ms = Date.now() - itemT0;
            const ok = r.correct;
            const icon = ok ? '✓' : '✗';
            process.stdout.write(`\r  ${icon} ${label} (${ms} ms)\n`);
            if (!ok) {
                console.log(`      attempts=${r.attempts} feedback=${JSON.stringify(r.feedback)}`);
                console.log(`      console (last 400): ${(r.consoleText || '').slice(-400).replace(/\n/g, '  ')}`);
            }
            records.push({
                spec: SPEC_NAME, name: label,
                status: ok ? 'pass' : 'fail',
                message: ok ? '' : `attempts=${r.attempts}; ${(r.feedback || '').slice(0, 120)}`,
                durationMs: ms,
                error: ok ? null : (r.error || null),
            });
        } catch (e) {
            const ms = Date.now() - itemT0;
            process.stdout.write(`\r  ✗ ${label} (${ms} ms) — ERROR\n`);
            console.log(`      ${e.message}`);
            records.push({
                spec: SPEC_NAME, name: label,
                status: 'fail',
                message: `ERROR: ${e.message}`,
                durationMs: ms,
                error: e.stack || e.message,
            });
        }
    }

    // Append any exercises discovered on disk but missing from solutions.mjs.
    const missing = findMissing();
    for (const ex of missing) {
        console.log(`  ⚠ MISSING SOLUTION: ${ex.title} (${ex.url})`);
        records.push({
            spec: SPEC_NAME,
            name: `[missing-solution] ${ex.title}`,
            status: 'missing-solution',
            message: `Exercise at ${ex.url} has no entry in solutions.mjs (layout: ${ex.layout || 'unknown'})`,
            durationMs: 0,
            error: null,
        });
    }

    if (ownBrowser) await browser.close();

    const ms = Date.now() - t0;
    const pass  = records.filter(r => r.status === 'pass').length;
    const fail  = records.filter(r => r.status === 'fail').length;
    const skip  = records.filter(r => r.status === 'skip').length;
    const drift = records.filter(r => r.status === 'missing-solution').length;
    console.log(`\n  Exercises: ${pass} pass, ${fail} fail, ${skip} skip, ${drift} missing-solution — ${(ms / 1000).toFixed(1)}s`);

    return records;
}

// ── Standalone entry point ────────────────────────────────────────────────────
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
    const filter = process.argv[2] || '';
    console.log(`\n=== Ursinus-WebIDE exercise verification ===`);
    const records = await runAllExercises({ filter });

    const pass  = records.filter(r => r.status === 'pass').length;
    const fail  = records.filter(r => r.status === 'fail').length;
    const skip  = records.filter(r => r.status === 'skip').length;
    const drift = records.filter(r => r.status === 'missing-solution').length;
    console.log(`\n=== Summary: ${pass} pass, ${fail} fail, ${skip} skip, ${drift} missing-solution ===\n`);

    // Write standalone markdown report
    mkdirSync('tests/reports', { recursive: true });
    let md = `# Exercise verification report\n\n- Total: ${records.length}\n- Passed: ${pass}\n- Failed: ${fail}\n- Skipped: ${skip}\n- Missing solution: ${drift}\n\n## Results\n\n| | Exercise | Status | Notes |\n|---|---|---|---|\n`;
    for (const r of records) {
        const icon = { pass: '✓', fail: '✗', skip: '⊘', 'missing-solution': '⚠' }[r.status] || '?';
        const notes = (r.message || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 100);
        md += `| ${icon} | ${r.name} | ${r.status} | ${notes} |\n`;
    }
    writeFileSync('tests/reports/exercise-report.md', md);
    console.log('Report: tests/reports/exercise-report.md');

    process.exit(fail + drift > 0 ? 1 : 0);
}
