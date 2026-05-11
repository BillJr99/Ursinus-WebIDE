// Verify the error-explanation dictionary fires for each language family.
// We trigger via window.logToConsole (exposed for testing/debugging) so the
// test doesn't depend on the page's actual run pipeline.

import { withPage, step, expect, snap, setSpec } from '../lib/harness.mjs';

const CASES = [
    { url: '/Modules/Python/Warmup/Exercise.html',     msg: "NameError: name 'foo' is not defined",                    expectMatch: /spelled|defined|import/i, label: 'Python NameError' },
    { url: '/Modules/Python/Warmup/Exercise.html',     msg: 'IndentationError: expected an indented block',           expectMatch: /indent/i,                  label: 'Python IndentationError' },
    { url: '/Modules/Python/Warmup/Exercise.html',     msg: 'IndexError: list index out of range',                    expectMatch: /index|0-indexed/i,         label: 'Python IndexError' },
    { url: '/Modules/Pyodide/PlotTenHeads.html',       msg: "TypeError: unsupported operand type(s) for +: 'int' and 'str'", expectMatch: /int|convert/i,       label: 'Pyodide TypeError' },
    { url: '/Modules/Javascript/MinIndex.html',        msg: "Error: ReferenceError: foo is not defined",              expectMatch: /declar|misspell/i,         label: 'JS ReferenceError' },
    { url: '/Modules/Javascript/MinIndex.html',        msg: "Error: TypeError: Cannot read properties of undefined (reading 'x')", expectMatch: /undefined|object/i, label: 'JS TypeError' },
    { url: '/Modules/IDE/Exercise.html',               msg: 'Error: java.lang.NullPointerException',                  expectMatch: /null|new/i,                label: 'Java NPE' },
    { url: '/Modules/IDE/Exercise.html',               msg: 'Error: ArrayIndexOutOfBoundsException: -1',              expectMatch: /index|range/i,             label: 'Java OOB' },
    { url: '/Modules/Cpp/CppIntro.html',               msg: 'segmentation fault',                                     expectMatch: /memory|pointer|null/i,     label: 'C++ segfault' },
    { url: '/Modules/Cpp/CppIntro.html',               msg: "undefined reference to 'main'",                          expectMatch: /linker|spell|library/i,    label: 'C++ undefined ref' },
    { url: '/Modules/SQL/Warmup/Exercise.html',        msg: 'no such table: users',                                   expectMatch: /spelling|schema|table/i,   label: 'SQL no such table' },
];

export default async function run() {
    setSpec('03_explain_error');

    for (const c of CASES) {
        await step(`${c.label}: explain card renders + text matches`, async () => {
            await withPage(c.url, async (page) => {
                await page.waitForFunction(
                    () => typeof window.logToConsole === 'function',
                    { timeout: 15000 }
                );
                const before = await page.locator('.webide-explain-btn').count();
                await page.evaluate(m => window.logToConsole(m), c.msg);
                await page.waitForTimeout(150);
                const after = await page.locator('.webide-explain-btn').count();
                expect.greater(after, before, `explain button count ${before} → ${after}`);

                const expText = await page.locator('.webide-explain-body').last().textContent();
                expect.matches(expText.trim(), c.expectMatch, `explanation text: "${expText.slice(0, 100)}"`);
            });
        });
    }

    // Negative: a normal print should NOT trigger explanation
    await step('Plain output line does NOT trigger explain affordance', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await page.waitForFunction(() => typeof window.logToConsole === 'function');
            const before = await page.locator('.webide-explain-btn').count();
            await page.evaluate(() => window.logToConsole('Hello, world!'));
            await page.waitForTimeout(80);
            const after = await page.locator('.webide-explain-btn').count();
            expect.equal(after, before, `count changed from ${before} to ${after}`);
        });
    });

    // Visual proof
    setSpec('03_explain_error_screens');
    await step('screenshot: explain expanded', async () => {
        await withPage('/Modules/IDE/Exercise.html', async (page) => {
            await page.waitForFunction(() => typeof window.logToConsole === 'function');
            await page.evaluate(() => {
                window.logToConsole('Error: java.lang.NullPointerException');
                window.logToConsole('Error: ArrayIndexOutOfBoundsException: -1');
                window.logToConsole('Error: cannot find symbol\n  symbol: variable foo');
            });
            await page.locator('.webide-explain-btn').first().click();
            await page.waitForTimeout(120);
            await snap(page, 'explain_expanded');
        });
    });
}
