// Iterate every exercise in solutions.mjs, run it through the WebIDE
// harness, and produce a Markdown report under tests/reports/.
//
// Usage:
//   node tests/exercises/run-all-exercises.mjs           # all
//   node tests/exercises/run-all-exercises.mjs java      # filter by label substring

import { chromium } from 'playwright';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { runExercise } from './run-exercise.mjs';
import { EXERCISES } from './solutions.mjs';

let exe = process.env.WEBIDE_TEST_CHROMIUM || null;
if (!exe && existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')) {
    exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
}

const filter = process.argv[2] || '';
const list = filter
    ? EXERCISES.filter(e => e.label.toLowerCase().includes(filter.toLowerCase()))
    : EXERCISES;

console.log(`\n=== Ursinus-WebIDE exercise verification ===`);
console.log(`Exercises: ${list.length} (filter: ${filter || '<all>'})\n`);

const browser = await chromium.launch({
    headless: true, args: ['--no-sandbox'],
    ...(exe ? { executablePath: exe } : {}),
});

const results = [];
const t0 = Date.now();

for (const ex of list) {
    if (ex.skip) {
        console.log(`  ⊘ ${ex.label} — skipped: ${ex.skip}`);
        results.push({ ...ex, status: 'skipped', reason: ex.skip });
        continue;
    }
    const itemT0 = Date.now();
    process.stdout.write(`  … ${ex.label}`);
    try {
        const r = await runExercise(browser, {
            url: ex.url,
            solutions: ex.files,
            label: ex.label,
            ...(ex.opts || {}),
        });
        const ms = Date.now() - itemT0;
        const icon = r.correct ? '✓' : '✗';
        process.stdout.write(`\r  ${icon} ${ex.label} (${ms} ms)\n`);
        if (!r.correct) {
            console.log(`      attempts=${r.attempts} feedback=${JSON.stringify(r.feedback)}`);
            console.log(`      console (last 400): ${(r.consoleText || '').slice(-400).replace(/\n/g, '  ')}`);
        }
        results.push({ ...ex, status: r.correct ? 'pass' : 'fail', ...r, durationMs: ms });
    } catch (e) {
        const ms = Date.now() - itemT0;
        process.stdout.write(`\r  ✗ ${ex.label} (${ms} ms) — ERROR\n`);
        console.log(`      ${e.message}`);
        results.push({ ...ex, status: 'error', error: e.message, durationMs: ms });
    }
}

await browser.close();
const totalMs = Date.now() - t0;
const pass = results.filter(r => r.status === 'pass').length;
const fail = results.filter(r => r.status === 'fail').length;
const err  = results.filter(r => r.status === 'error').length;
const skip = results.filter(r => r.status === 'skipped').length;

console.log(`\n=== Summary: ${pass}/${list.length} passed (${fail} failed, ${err} error, ${skip} skipped) in ${(totalMs / 1000).toFixed(1)}s ===\n`);

// Markdown report
mkdirSync('tests/reports', { recursive: true });
let md = `# Exercise verification report\n\n- Total: ${list.length}\n- Passed: ${pass}\n- Failed: ${fail}\n- Errored: ${err}\n- Skipped: ${skip}\n- Duration: ${(totalMs / 1000).toFixed(1)}s\n\n## Results\n\n| | Exercise | Status | Time | Notes |\n|---|---|---|--:|---|\n`;
for (const r of results) {
    const icon = r.status === 'pass' ? '✓' : r.status === 'fail' ? '✗' : r.status === 'error' ? '!' : '⊘';
    const notes = r.status === 'pass' ? '' :
                  r.status === 'fail' ? `attempts=${r.attempts}; ${(r.feedback || '').replace(/\|/g, '\\|').slice(0, 80)}` :
                  r.status === 'error' ? r.error :
                  r.reason || '';
    md += `| ${icon} | ${r.label} | ${r.status} | ${(r.durationMs || 0) / 1000}s | ${notes.replace(/\n/g, ' ')} |\n`;
}
writeFileSync('tests/reports/exercise-report.md', md);
console.log('Report: tests/reports/exercise-report.md');

process.exit(fail + err > 0 ? 1 : 0);
