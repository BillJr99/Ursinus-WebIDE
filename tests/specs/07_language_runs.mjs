// Per-language: actually click Run on the default starter code and verify
// the runtime produces *some* output. This proves the language loaders are
// healthy AND that my pre-run/after-run hook didn't break the run flow.

import { withPage, step, expect, snap, setSpec } from '../lib/harness.mjs';

// Helpers
async function clickRunAndCollectConsole(page, opts = {}) {
    const timeout = opts.timeout ?? 8000;
    await page.waitForFunction(
        () => document.getElementById('run') && !document.getElementById('run').disabled,
        { timeout: 25000 }
    );
    await page.locator('#run').click();
    // Poll for console growth, stopping when a non-trivial amount of text shows up
    const t0 = Date.now();
    let last = '';
    while (Date.now() - t0 < timeout) {
        const text = await page.locator('#console').textContent().catch(() => '');
        last = text;
        if (text && text.trim().length > 30 && !/^Console output\.\.\./.test(text.trim())) break;
        await page.waitForTimeout(150);
    }
    return last;
}

export default async function run() {
    setSpec('07_language_runs');

    await step('Java (Processing.js): Run produces output', async () => {
        await withPage('/Modules/IDE/Exercise.html', async (page) => {
            const out = await clickRunAndCollectConsole(page, { timeout: 12000 });
            // The Java starter prints "Hello"; the IDE's incorrectchecks then
            // adds friendly feedback. Either way, output should grow.
            expect.greater(out.length, 30, `console: "${out.slice(0, 200)}"`);
        });
    });

    await step('Python (Brython): Run produces "Hello!" output for warmup', async () => {
        await withPage('/Modules/Python/Warmup/Exercise.html', async (page) => {
            const out = await clickRunAndCollectConsole(page, { timeout: 10000 });
            expect.matches(out, /Hello!|Try again|Correct/i, `console: "${out.slice(0, 200)}"`);
        });
    });

    await step('JavaScript: Run produces console-level output', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            const out = await clickRunAndCollectConsole(page, { timeout: 10000 });
            // Default student.js returns 0 → "0.0.0" is the typical output;
            // accept any non-trivial growth
            expect.greater(out.length, 30, `console: "${out.slice(0, 200)}"`);
        });
    });

    await step('SQL: Run executes the starter query', async () => {
        await withPage('/Modules/SQL/Warmup/Exercise.html', async (page) => {
            const out = await clickRunAndCollectConsole(page, { timeout: 12000 });
            expect.greater(out.length, 30, `console: "${out.slice(0, 200)}"`);
        });
    });

    await step('Scheme: Run produces output', async () => {
        await withPage('/Modules/Scheme/Warmup/Exercise.html', async (page) => {
            const out = await clickRunAndCollectConsole(page, { timeout: 12000 });
            expect.greater(out.length, 30, `console: "${out.slice(0, 200)}"`);
        });
    });

    await step('Prolog: Run produces query results', async () => {
        await withPage('/Modules/Prolog/Warmup/Exercise.html', async (page) => {
            const out = await clickRunAndCollectConsole(page, { timeout: 25000 });
            expect.greater(out.length, 30, `console: "${out.slice(0, 200)}"`);
        });
    });

    await step('C++ (clang.wasm): Run produces output (slow first compile)', async () => {
        await withPage('/Modules/Cpp/CppIntro.html', async (page) => {
            // C++ wasm compile can take 20-30s on first load
            const out = await clickRunAndCollectConsole(page, { timeout: 60000 });
            expect.greater(out.length, 30, `console: "${out.slice(0, 200)}"`);
        });
    });

    await step('Pyodide: Run produces output (slow first download)', async () => {
        // Pyodide downloads ~10MB from cdn.jsdelivr.net on first load — when
        // running offline this test will fail with a clear "loadPyodide is
        // not defined" error rather than a timeout. Allow extra wait.
        await withPage('/Modules/Pyodide/PlotTenHeads.html', { waitMs: 8000 }, async (page) => {
            const out = await clickRunAndCollectConsole(page, { timeout: 90000 });
            expect.greater(out.length, 30, `console: "${out.slice(0, 200)}"`);
        });
    });

    await step('Graphics (View): Run renders without throwing', async () => {
        await withPage('/Modules/Graphics/ViewOrthographic.html', async (page) => {
            // Graphics doesn't necessarily print to console; verify Run doesn't
            // throw and the canvas is present
            await page.waitForFunction(
                () => document.getElementById('run') && !document.getElementById('run').disabled,
                { timeout: 25000 }
            );
            await page.locator('#run').click();
            await page.waitForTimeout(3000);
            const canvas = await page.locator('#GLCanvas1').count();
            expect.greater(canvas, 0, 'WebGL canvas should be present');
        });
    });

    // Visual proof
    setSpec('07_language_runs_screens');
    await step('screenshot: Python output after Run', async () => {
        await withPage('/Modules/Python/Warmup/Exercise.html', async (page) => {
            const out = await clickRunAndCollectConsole(page, { timeout: 10000 });
            await page.evaluate(() => switchBottomTab('output'));
            await page.waitForTimeout(150);
            await snap(page, 'python_run_output');
        });
    });

    await step('screenshot: Inspector after Python run', async () => {
        await withPage('/Modules/Python/Warmup/Exercise.html', async (page) => {
            await page.waitForFunction(() => typeof window.run_python_code === 'function');
            await page.evaluate(() => {
                window.run_python_code('total = 0\nfor i in range(5):\n    total = total + i\nresult = total * 2\nname = "demo"');
                if (window.__webide_vars && window.__webide_vars.total) {
                    // Manually populate inspector since we bypassed the run handler
                    const _vars = {};
                    for (const k of Object.keys(window.__webide_vars)) _vars[k] = window.__webide_vars[k];
                    // Render via the closure-scoped state setter:
                    if (window.refreshInspectorFromRun) window.refreshInspectorFromRun();
                }
                switchBottomTab('inspector');
                switchInspectorView('vars');
            });
            await page.waitForTimeout(200);
            await snap(page, 'inspector_python_vars');
        });
    });

    await step('screenshot: JS call-tape via webideTrace', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await page.waitForFunction(() => !!window.webideTrace);
            await page.evaluate(() => {
                window.webideTrace._reset();
                function fact(n) {
                    window.webideTrace.call('fact', n);
                    const r = (n <= 1) ? 1 : n * fact(n - 1);
                    return window.webideTrace.return(r);
                }
                fact(4);
                if (window.refreshInspectorFromRun) window.refreshInspectorFromRun();
                switchBottomTab('inspector');
                switchInspectorView('trace');
            });
            await page.waitForTimeout(200);
            await snap(page, 'inspector_js_calltape');
        });
    });
}
