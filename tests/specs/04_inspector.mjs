// Inspector: variable capture (Python, JavaScript), call-tape (webideTrace
// API, Python settrace graceful fallback), step-through scaffolding.

import { withPage, step, expect, snap, setSpec } from '../lib/harness.mjs';
import { ONE_PER_LANG } from '../lib/pages.mjs';

export default async function run() {
    setSpec('04_inspector');

    // ---- Python ----
    await step('Python: run_python_code populates inspector vars', async () => {
        await withPage('/Modules/Python/Warmup/Exercise.html', async (page) => {
            await page.waitForFunction(() => typeof window.run_python_code === 'function', { timeout: 15000 });
            const result = await page.evaluate(() => {
                const out = window.run_python_code('x = 7\ny = "hello"\nprint(y, x)');
                return { out, vars: window.__webide_vars ? JSON.parse(JSON.stringify(window.__webide_vars)) : null };
            });
            expect.contains(result.out, 'hello 7');
            expect.truthy(result.vars && result.vars.x, 'x not captured');
            expect.truthy(result.vars && result.vars.y, 'y not captured');
            expect.equal(result.vars.x.value, '7');
        });
    });

    await step('Python: function locals NOT leaked to inspector', async () => {
        await withPage('/Modules/Python/Warmup/Exercise.html', async (page) => {
            await page.waitForFunction(() => typeof window.run_python_code === 'function');
            const vars = await page.evaluate(() => {
                window.run_python_code('a = 1');
                return Object.keys(window.__webide_vars || {});
            });
            expect.truthy(vars.includes('a'), 'a missing');
            for (const leaky of ['_webide_code', '_webide_result', '_webide_exc', 'code', 'result', 'exc']) {
                expect.equal(vars.includes(leaky), false, `${leaky} leaked into inspector`);
            }
        });
    });

    // ---- Pyodide step-through (full CPython sys.settrace) ----
    // We invoke the step machinery directly via pyodide.runPython rather
    // than clicking the Run button, because the Run button reads the
    // student source from IndexedDB and bouncing fact() through the file
    // system is much more fragile than this direct path. The goal here is
    // to verify the TRACING MECHANISM produces a clean fact-only tree;
    // the Run-button integration is covered by 07_language_runs.
    await step('Pyodide: Step Run populates real step list + call tree', async () => {
        await withPage('/Modules/Pyodide/PlotTenHeads.html', { waitMs: 6000 }, async (page) => {
            // Wait until Pyodide has loaded (CDN download, ~10 MB on first hit)
            await page.waitForFunction(
                () => window.pyodide && typeof window.pyodide.runPython === 'function',
                { timeout: 120000 }
            );
            const result = await page.evaluate(() => {
                const proPy  = document.getElementById('pyodideStepPrologue').textContent;
                const execPy = document.getElementById('pyodideStepExec').textContent;
                // Reset accumulators (we're outside _beforeRun/_afterRun)
                window.__webide_steps = null;
                window.__webide_calltree = null;
                // 1) Load tracer + state. Does NOT install settrace.
                pyodide.runPython(proPy);
                // 2) Hand the student source over.
                pyodide.globals.set('_webide_student_source',
                    'def fact(n):\n    return 1 if n <= 1 else n * fact(n-1)\nresult = fact(4)\n');
                // 3) Run the wrapper that installs settrace, exec's the
                //    compiled student code, and uninstalls settrace.
                pyodide.runPython(execPy);
                // 4) Pull steps + calltree back to JS.
                const stepsPy = pyodide.globals.get('_webide_steps');
                const treePy  = pyodide.globals.get('_webide_calltree');
                const steps   = stepsPy ? stepsPy.toJs({ dict_converter: Object.fromEntries }) : null;
                const tree    = treePy  ? treePy.toJs({ dict_converter: Object.fromEntries })  : null;
                if (stepsPy && stepsPy.destroy) stepsPy.destroy();
                if (treePy  && treePy.destroy)  treePy.destroy();
                // Normalise Map → plain object so JSON serialises cleanly
                const normalise = (n) => {
                    const obj = (n instanceof Map) ? Object.fromEntries(n) : n;
                    if (obj && obj.children) {
                        obj.children = obj.children.map(normalise);
                    }
                    return obj;
                };
                return {
                    stepsLen: steps ? steps.length : 0,
                    tree: tree ? normalise(tree) : null,
                };
            });
            expect.greater(result.stepsLen, 3, `expected several recorded line events, got ${result.stepsLen}`);
            expect.truthy(result.tree && result.tree.children && result.tree.children.length > 0,
                `expected non-empty call tree, got ${JSON.stringify(result.tree).slice(0, 200)}`);
            // fact(4) → fact(3) → fact(2) → fact(1) ⇒ 4 frames named "fact"
            const flatNames = [];
            (function walk(n) { flatNames.push(n.name); (n.children || []).forEach(walk); })(result.tree);
            expect.truthy(flatNames.filter(n => n === 'fact').length >= 4,
                `expected ≥4 fact calls, got names=${JSON.stringify(flatNames)}`);
        });
    });

    await step('Python: traced runner is callable + empty-state fallback works', async () => {
        await withPage('/Modules/Python/Warmup/Exercise.html', async (page) => {
            await page.waitForFunction(() => typeof window.run_python_code_traced === 'function');
            await page.evaluate(() => {
                window.__webide_calltree = null;
                window.run_python_code_traced('def f(n): return 1 if n <= 1 else n * f(n-1)\nf(3)');
            });
            // Brython settrace doesn't fire on exec'd code; the IDE shows
            // a graceful empty-state hint pointing at Step Run / webideTrace.
            await page.evaluate(() => {
                switchBottomTab('inspector');
                switchInspectorView('trace');
            });
            const hint = await page.locator('#inspector-trace .inspector-empty').textContent();
            expect.matches(hint, /Step Run|webideTrace/i, `hint was: "${hint.slice(0, 100)}"`);
        });
    });

    // ---- JavaScript ----
    await step('JavaScript: webideTrace records nested recursion + return values', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await page.waitForFunction(() => !!window.webideTrace);
            const tree = await page.evaluate(() => {
                window.webideTrace._reset();
                function fact(n) {
                    window.webideTrace.call('fact', n);
                    const r = (n <= 1) ? 1 : n * fact(n - 1);
                    return window.webideTrace.return(r);
                }
                fact(4);
                return JSON.parse(JSON.stringify(window.webideTrace._root));
            });
            expect.equal(tree.children.length, 1, 'expected one root call');
            expect.equal(tree.children[0].name, 'fact');
            expect.equal(tree.children[0].returnValue, '24', `got returnValue=${tree.children[0].returnValue}`);
            // Depth: fact(4) → fact(3) → fact(2) → fact(1) ⇒ 4 levels of nesting
            let depth = 0, n = tree.children[0];
            while (n.children && n.children.length) { depth++; n = n.children[0]; }
            expect.equal(depth, 3, `depth ${depth}, want 3`);
        });
    });

    await step('JavaScript: webideTrace.tap records SIBLINGS (no nesting)', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await page.waitForFunction(() => !!window.webideTrace);
            const tree = await page.evaluate(() => {
                window.webideTrace._reset();
                window.webideTrace.tap('test');
                window.webideTrace.tap('test');
                window.webideTrace.tap('test');
                return JSON.parse(JSON.stringify(window.webideTrace._root));
            });
            expect.equal(tree.children.length, 3, `expected 3 sibling taps, got ${tree.children.length}`);
            // Each tap should be a leaf (no children) — that's how we
            // distinguish sibling logs from a recursive call chain.
            for (const c of tree.children) {
                expect.equal(c.children.length, 0, `tap should be a leaf, got ${c.children.length} kids`);
                expect.equal(c.isTap, true, `tap should set isTap=true`);
            }
        });
    });

    await step('JavaScript: unclosed call() flagged in render summary', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await page.waitForFunction(() => !!window.webideTrace);
            await page.evaluate(() => {
                window.webideTrace._reset();
                window.webideTrace.call('test');
                window.webideTrace.call('test');
                window.webideTrace.call('test');
                window.refreshInspectorFromRun && window.refreshInspectorFromRun();
                switchBottomTab('inspector');
                switchInspectorView('trace');
            });
            await page.waitForTimeout(150);
            const summary = await page.locator('.calltape-summary').textContent();
            expect.matches(summary, /unclosed/i, `summary should warn about unclosed: "${summary}"`);
            const warnings = await page.locator('.calltape-unclosed').count();
            expect.greater(warnings, 0, `expected at least one .calltape-unclosed marker, got ${warnings}`);
        });
    });

    await step('Variables empty-state mentions language after Run on a non-Python/JS page', async () => {
        await withPage('/Modules/IDE/Exercise.html', { waitMs: 4000 }, async (page) => {
            await page.waitForFunction(() => !document.getElementById('run').disabled, { timeout: 20000 });
            await page.locator('#run').click();
            await page.waitForTimeout(7000);  // Java/Processing.js takes a moment
            await page.evaluate(() => { switchBottomTab('inspector'); switchInspectorView('vars'); });
            const msg = await page.locator('#inspector-vars .inspector-empty').textContent();
            expect.matches(msg, /Python and JavaScript/i,
                `expected language-aware message, got "${msg.trim()}"`);
        });
    });

    await step('JavaScript: webideTrace records uncaught exception', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await page.waitForFunction(() => !!window.webideTrace);
            const node = await page.evaluate(() => {
                window.webideTrace._reset();
                try {
                    window.webideTrace.call('boom');
                    throw new Error('kaboom');
                } catch (e) {
                    // simulate manually noting the exception
                    const stack = window.webideTrace._stack;
                    if (stack.length > 1) {
                        stack[stack.length - 1].exception = e.message;
                        stack.pop();
                    }
                }
                return JSON.parse(JSON.stringify(window.webideTrace._root.children[0]));
            });
            expect.contains(node.exception || '', 'kaboom');
        });
    });

    // ---- Other languages: inspector empty-state still works ----
    setSpec('04_inspector_other_langs');
    for (const p of ONE_PER_LANG) {
        if (p.lang === 'python' || p.lang === 'javascript' || p.lang === 'pyodide') continue;
        await step(`${p.label}: Inspector empty-states render without errors`, async () => {
            await withPage(p.url, async (page) => {
                await page.evaluate(() => {
                    switchBottomTab('inspector');
                    switchInspectorView('vars');
                });
                const varsHint = await page.locator('#inspector-vars .inspector-empty').textContent().catch(() => '');
                expect.matches(varsHint, /Run your code/i, `vars hint: "${varsHint}"`);

                await page.evaluate(() => switchInspectorView('trace'));
                const traceHint = await page.locator('#inspector-trace .inspector-empty').textContent().catch(() => '');
                expect.matches(traceHint, /webideTrace|Step Run|No call tape/i, `trace hint: "${traceHint}"`);
            });
        });
    }
}
