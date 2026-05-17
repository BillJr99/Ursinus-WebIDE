// Trace-on-hit instrumentation across languages.
//
// Verifies that, with a breakpoint set, running the code populates
// window.__webide_steps with hit records. We seed the file content
// directly via ace.session.setValue() so we don't depend on any
// particular file the exercise ships with.

import { withPage, step, expect, setSpec } from '../lib/harness.mjs';

async function waitForIdeReady(page) {
    await page.waitForFunction(() => {
        const t = document.querySelector('.tab.active');
        return typeof window.ace_editor !== 'undefined' && window.ace_editor &&
               t && t.id && t.id !== '__submit_form__';
    }, { timeout: 15000 });
}

export default async function run() {
    setSpec('10_trace_on_hit');

    // ===================================================================
    // The helper itself
    // ===================================================================
    await step('webideInstrumentForBreakpoints + __webide_bp helpers are exposed', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            const api = await page.evaluate(() => ({
                instrument: typeof window.webideInstrumentForBreakpoints === 'function',
                bp: typeof window.__webide_bp === 'function',
                active: typeof window.__webide_activeBreakpointLines === 'function',
            }));
            expect.equal(api.instrument, true);
            expect.equal(api.bp, true);
            expect.equal(api.active, true);
        });
    });

    await step('Instrumenter is a no-op when there are no breakpoints', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            const same = await page.evaluate(() => {
                const src = "let x = 1;\nlet y = 2;\nconsole.log(x+y);";
                const out = window.webideInstrumentForBreakpoints(src, 'javascript', []);
                return src === out;
            });
            expect.equal(same, true);
        });
    });

    await step('Instrumenter injects __webide_bp on the right lines (JS)', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            const out = await page.evaluate(() => {
                const src = "let x = 1;\nlet y = 2;\nlet z = x+y;";
                return window.webideInstrumentForBreakpoints(src, 'javascript', [2, 3]);
            });
            const lines = out.split('\n');
            expect.equal(lines[0].includes('__webide_bp'), false, 'line 1 should be untouched');
            expect.equal(lines[1].includes('__webide_bp(2'), true);
            expect.equal(lines[2].includes('__webide_bp(3'), true);
            // Includes the locals expression for x, y, z (TDZ-safe try/catch)
            expect.matches(lines[1], /"x":\s*\(function/);
            expect.matches(lines[1], /"y":\s*\(function/);
            expect.matches(lines[1], /"z":\s*\(function/);
        });
    });

    await step('__webide_bp records a step with locals', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            const steps = await page.evaluate(() => {
                window.__webide_steps = null;
                window.__webide_bp(42, { foo: 'bar', n: 7, arr: [1, 2, 3] });
                return window.__webide_steps;
            });
            expect.equal(steps.length, 1);
            expect.equal(steps[0].lineno, 42);
            expect.equal(steps[0].hit, true);
            expect.equal(steps[0].locals.foo.value, 'bar');
            expect.equal(steps[0].locals.n.value, '7');
            expect.equal(steps[0].locals.arr.type, 'array');
        });
    });

    await step('__webide_bp caps recording at 2000 events', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            const count = await page.evaluate(() => {
                window.__webide_steps = null;
                for (let i = 0; i < 2500; i++) window.__webide_bp(i, {});
                return window.__webide_steps.length;
            });
            expect.equal(count, 2000);
        });
    });

    // ===================================================================
    // Per-language instrumentation
    // ===================================================================

    await step('Scheme: instrumenter injects (webide-bp N) at breakpoint lines', async () => {
        await withPage('/Modules/Scheme/Warmup/Exercise.html', async (page) => {
            const out = await page.evaluate(() => {
                const src = "(define a 1)\n(define b 2)\n(+ a b)";
                return window.webideInstrumentForBreakpoints(src, 'scheme', [3]);
            });
            const lines = out.split('\n');
            expect.equal(lines[2].includes('(webide-bp 3)'), true,
                'line 3 missing webide-bp call: ' + JSON.stringify(lines[2]));
        });
    });

    await step('SQL: instrumenter emits -- __BP N comments', async () => {
        await withPage('/Modules/SQL/Warmup/Exercise.html', async (page) => {
            const out = await page.evaluate(() => {
                const src = "SELECT 1;\nSELECT 2;";
                return window.webideInstrumentForBreakpoints(src, 'sql', [2]);
            });
            expect.contains(out, '-- __BP 2');
        });
    });

    await step('C/C++: instrumenter emits printf markers', async () => {
        await withPage('/Modules/Cpp/CppIntro.html', { waitMs: 5000 }, async (page) => {
            const out = await page.evaluate(() => {
                const src = "int main() {\nint x = 1;\nreturn 0;\n}";
                return window.webideInstrumentForBreakpoints(src, 'cpp', [2, 3]);
            });
            expect.contains(out, 'printf("__BP %d\\n", 2)');
            expect.contains(out, 'printf("__BP %d\\n", 3)');
        });
    });

    await step('Prolog: instrumenter emits % __BP N comments', async () => {
        await withPage('/Modules/Prolog/Warmup/Exercise.html', async (page) => {
            const out = await page.evaluate(() => {
                const src = "father(tom, bob).\nfather(bob, sue).";
                return window.webideInstrumentForBreakpoints(src, 'prolog', [1, 2]);
            });
            expect.contains(out, '% __BP 1');
            expect.contains(out, '% __BP 2');
        });
    });

    await step('Python: instrumenter prepends __webide_bp_py(...) on its own line', async () => {
        await withPage('/Modules/Python/Warmup/Exercise.html', async (page) => {
            const out = await page.evaluate(() => {
                const src = "def f():\n    x = 1\n    return x";
                return window.webideInstrumentForBreakpoints(src, 'python', [3]);
            });
            const lines = out.split('\n');
            // The trap is on its OWN line inserted ABOVE line 3 — line 3
            // of the original source ends up at line 4 of the output.
            expect.matches(lines[2], /__webide_bp_py\(3, vars\(\)\)/);
            // Indentation should match the student's indent
            expect.matches(lines[2], /^    __webide_bp_py/);
        });
    });

    await step('Unknown language returns source unchanged', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            const same = await page.evaluate(() => {
                const src = "anything goes here";
                return window.webideInstrumentForBreakpoints(src, 'xyz', [1]) === src;
            });
            expect.equal(same, true);
        });
    });

    // ===================================================================
    // End-to-end: JavaScript Run path with a breakpoint actually populates
    // window.__webide_steps via the instrumentation injected in runCode().
    // ===================================================================
    // The Run-button integration is timing-dependent (IndexedDB save races
    // getCodeText). We verify the instrumented code WORKS end-to-end by
    // directly evaluating it the way the JS Run path does — confirming that
    // the helpers + injected calls compose correctly without depending on
    // the file-system round-trip.
    await step('Instrumented JS code, eval\'d directly, populates steps', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await waitForIdeReady(page);
            const out = await page.evaluate(() => {
                const activePath = document.querySelector('.tab.active').id;
                window.webideBreakpoints.toggle(activePath, 2);
                window.__webide_steps = null;
                const src  = "let aa = 1;\nlet bb = 2;\nlet cc = aa + bb;";
                const bpLines = window.__webide_activeBreakpointLines();
                const instr = window.webideInstrumentForBreakpoints(src, 'javascript', bpLines);
                // eval at module scope so let-bindings produce the locals
                (new Function(instr))();
                return { steps: window.__webide_steps, instr };
            });
            expect.truthy(out.steps, 'no steps recorded: instr=' + (out.instr || '').slice(0, 200));
            expect.greater(out.steps.length, 0);
            expect.equal(out.steps[0].lineno, 2);
            // aa is captured on line 2 (declared on line 1, in scope); bb not yet defined
            expect.equal(out.steps[0].locals.aa.value, '1');
        });
    });
}
