// Spec runner — invoked by tests/run.sh.
// Discovers every *.mjs in tests/specs/, runs them sequentially against a
// shared browser instance, and emits the report.

import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchBrowser, closeBrowser, results, setShotsDir, BASE_URL } from './lib/harness.mjs';
import { generate } from './report.mjs';

const SPEC_DIR = new URL('./specs/', import.meta.url).pathname;
const SHOTS = new URL('./reports/screens/', import.meta.url).pathname;
setShotsDir(SHOTS);

const onlyFilter = process.argv[2];

const specs = readdirSync(SPEC_DIR)
    .filter(f => f.endsWith('.mjs'))
    .filter(f => !onlyFilter || f.includes(onlyFilter))
    .sort();

console.log(`\n=== Ursinus-WebIDE test suite ===`);
console.log(`Base: ${BASE_URL}`);
console.log(`Specs: ${specs.join(', ')}\n`);

const t0 = Date.now();
await launchBrowser();
let runtimeError = null;
try {
    for (const spec of specs) {
        console.log(`\n--- ${spec} ---`);
        const url = pathToFileURL(path.join(SPEC_DIR, spec)).href;
        const mod = await import(url);
        if (typeof mod.default !== 'function') {
            console.error(`  spec ${spec} has no default export — skipping`);
            continue;
        }
        try {
            await mod.default();
        } catch (e) {
            console.error(`  spec ${spec} crashed: ${e.message}`);
            results.push({
                spec, name: '__spec_crashed__', status: 'fail',
                message: e.message, durationMs: 0, error: e.stack || String(e),
            });
        }
    }
} catch (e) {
    runtimeError = e;
} finally {
    await closeBrowser();
}
const totalMs = Date.now() - t0;

const summary = generate(results, {
    baseUrl: BASE_URL,
    browser: 'Chromium ' + '(headless)',
    totalDurationMs: totalMs,
});

console.log(`\n=== Summary: ${summary.passed}/${summary.total} passed (${summary.pct}%) in ${(totalMs / 1000).toFixed(1)}s ===`);
console.log(`Report: ${summary.reportPath}`);

if (runtimeError) {
    console.error('Runner error:', runtimeError.stack || runtimeError.message);
    process.exit(2);
}
process.exit(summary.failed > 0 ? 1 : 0);
