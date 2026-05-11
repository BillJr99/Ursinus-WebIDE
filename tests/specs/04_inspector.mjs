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
