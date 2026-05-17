// Tests panel — student-runnable unit tests.
//
// Verifies the panel's HTML wiring, the WEBIDE_TESTS variable plumbing,
// the runAllTests dispatcher's per-language coverage, the result icons,
// and the Ctrl+Shift+R shortcut. Real per-language assertions are kept
// minimal here because each runtime has its own test harness elsewhere
// (07_language_runs covers that the runtimes themselves work).

import { withPage, step, expect, setSpec } from '../lib/harness.mjs';

const JS_URL = '/Modules/Javascript/MinIndex.html';

async function waitForIdeReady(page) {
    await page.waitForFunction(() => {
        const t = document.querySelector('.tab.active');
        return typeof window.ace_editor !== 'undefined' && window.ace_editor &&
               t && t.id && t.id !== '__submit_form__';
    }, { timeout: 15000 });
}

export default async function run() {
    setSpec('11_tests_panel');

    // ===================================================================
    // UI wiring
    // ===================================================================
    await step('Tests bottom-tab and panel exist with aria-live', async () => {
        await withPage(JS_URL, async (page) => {
            const out = await page.evaluate(() => ({
                tab:    !!document.getElementById('btab-tests'),
                panel:  !!document.getElementById('tests-panel'),
                count:  !!document.getElementById('tests-count'),
                runBtn: !!document.getElementById('tests-run-all'),
                body:   document.getElementById('tests-body'),
                live:   document.getElementById('tests-body')?.getAttribute('aria-live'),
                role:   document.getElementById('tests-body')?.getAttribute('role'),
            }));
            expect.equal(out.tab, true);
            expect.equal(out.panel, true);
            expect.equal(out.count, true);
            expect.equal(out.runBtn, true);
            expect.equal(out.live, 'polite');
            expect.equal(out.role, 'status');
        });
    });

    await step('Switching to Tests tab reveals the panel', async () => {
        await withPage(JS_URL, async (page) => {
            const hidden = await page.evaluate(() => {
                window.switchBottomTab('tests');
                return document.getElementById('tests-panel').hidden;
            });
            expect.equal(hidden, false);
        });
    });

    await step('WEBIDE_TESTS is exposed (empty array on pages with no tests)', async () => {
        await withPage(JS_URL, async (page) => {
            const out = await page.evaluate(() => ({
                exists:  Array.isArray(window.WEBIDE_TESTS),
                length:  window.WEBIDE_TESTS.length,
                runFn:   typeof window.runAllTests,
            }));
            expect.equal(out.exists, true);
            expect.equal(out.length, 0);
            expect.equal(out.runFn, 'function');
        });
    });

    // ===================================================================
    // Run-tests dispatcher behaviour with synthesized WEBIDE_TESTS
    // ===================================================================
    await step('runAllTests: passing JS test marks the row pass + updates summary', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const out = await page.evaluate(async () => {
                window.WEBIDE_TESTS = [
                    { name: 'simple pass', code: 'console.log("hi")', expect: { stdout: 'hi' } },
                ];
                // Re-init the panel with the new tests array
                const body = document.getElementById('tests-body');
                body.innerHTML = '';
                const tests = window.WEBIDE_TESTS;
                document.getElementById('tests-count').textContent = '(' + tests.length + ')';
                tests.forEach((t, idx) => {
                    const row = document.createElement('div');
                    row.className = 'test-row pending';
                    row.id = '_test_row_' + idx;
                    row.innerHTML = '<span class="test-icon" aria-hidden="true">○</span>' +
                                    '<span class="test-name"></span>';
                    row.querySelector('.test-name').textContent = t.name;
                    body.appendChild(row);
                });
                await window.runAllTests();
                return {
                    summary: document.getElementById('tests-summary').textContent,
                    rowClass: document.getElementById('_test_row_0').className,
                };
            });
            expect.contains(out.summary, '1 / 1 passing');
            expect.contains(out.rowClass, 'pass');
        });
    });

    await step('runAllTests: failing stdout-regex marks fail + shows detail', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const out = await page.evaluate(async () => {
                window.WEBIDE_TESTS = [
                    { name: 'wrong output', code: 'console.log("nope")', expect: { stdout: 'expected' } },
                ];
                const body = document.getElementById('tests-body');
                body.innerHTML = '';
                window.WEBIDE_TESTS.forEach((t, idx) => {
                    const row = document.createElement('div');
                    row.className = 'test-row pending';
                    row.id = '_test_row_' + idx;
                    row.innerHTML = '<span class="test-icon"></span><span class="test-name"></span>';
                    row.querySelector('.test-name').textContent = t.name;
                    body.appendChild(row);
                });
                await window.runAllTests();
                const detail = document.getElementById('_test_detail_0');
                return {
                    rowClass: document.getElementById('_test_row_0').className,
                    detail: detail ? detail.textContent : null,
                };
            });
            expect.contains(out.rowClass, 'fail');
            expect.truthy(out.detail, 'no detail block');
            expect.contains(out.detail, 'expected');
        });
    });

    await step('runAllTests: expect.throws spec works (positive case)', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const out = await page.evaluate(async () => {
                window.WEBIDE_TESTS = [
                    { name: 'should throw', code: 'throw new Error("x")', expect: { throws: true } },
                ];
                const body = document.getElementById('tests-body');
                body.innerHTML = '';
                window.WEBIDE_TESTS.forEach((t, idx) => {
                    const row = document.createElement('div');
                    row.className = 'test-row pending';
                    row.id = '_test_row_' + idx;
                    row.innerHTML = '<span class="test-icon"></span><span class="test-name"></span>';
                    body.appendChild(row);
                });
                await window.runAllTests();
                return document.getElementById('_test_row_0').className;
            });
            expect.contains(out, 'pass');
        });
    });

    // ===================================================================
    // Color-blind mode
    // ===================================================================
    await step('Color-blind menu item toggles body data-attr + persists', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            // Toggle on
            const on = await page.evaluate(() => {
                window.menuToggleColorblind();
                return {
                    attr: document.body.dataset.colorblind,
                    label: document.getElementById('menu-colorblind-label').textContent,
                    stored: JSON.parse(localStorage.getItem('webide.prefs') || '{}').colorblind,
                };
            });
            expect.equal(on.attr, 'true');
            expect.equal(on.label, 'On');
            expect.equal(on.stored, true);
            // Toggle off
            const off = await page.evaluate(() => {
                window.menuToggleColorblind();
                return {
                    attr: document.body.dataset.colorblind,
                    label: document.getElementById('menu-colorblind-label').textContent,
                    stored: JSON.parse(localStorage.getItem('webide.prefs') || '{}').colorblind,
                };
            });
            expect.equal(off.attr, undefined);
            expect.equal(off.label, 'Off');
            expect.equal(off.stored, false);
        });
    });

    await step('Color-blind mode survives page reload', async () => {
        await withPage(JS_URL, async (page) => {
            await page.evaluate(() => {
                localStorage.setItem('webide.prefs', JSON.stringify({ colorblind: true }));
            });
            await page.reload();
            await waitForIdeReady(page);
            const attr = await page.evaluate(() => document.body.dataset.colorblind);
            expect.equal(attr, 'true');
        });
    });

    // ===================================================================
    // Menu + keyboard shortcut
    // ===================================================================
    await step('Run menu has Run Tests item + Alt+T shortcut row', async () => {
        await withPage(JS_URL, async (page) => {
            const out = await page.evaluate(() => ({
                runTestsItem: !!Array.from(document.querySelectorAll('#menu-run .menu-dropdown-item'))
                    .find(el => el.textContent.includes('Run Tests')),
                shortcutRow: Array.from(document.querySelectorAll('.shortcut-row'))
                    .find(r => r.textContent.includes('Run Tests'))?.textContent || '',
            }));
            expect.equal(out.runTestsItem, true);
            expect.contains(out.shortcutRow, 'T');
        });
    });

    await step('Alt+T synthetic event runs the tests (verified via panel state)', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            // Give initMenuSystem (which installs the document keydown handler)
            // a moment to fully wire up after editor init.
            await page.waitForTimeout(200);
            const out = await page.evaluate(async () => {
                // Seed a single test + re-init the panel so we have a row to watch
                window.WEBIDE_TESTS = [{ name: 'sentinel', code: 'console.log("ok")', expect: {} }];
                const body = document.getElementById('tests-body');
                body.innerHTML = '';
                const row = document.createElement('div');
                row.id = '_test_row_0';
                row.className = 'test-row pending';
                row.innerHTML = '<span class="test-icon">○</span><span class="test-name">sentinel</span>';
                body.appendChild(row);
                document.getElementById('tests-count').textContent = '(1)';
                // Dispatch Alt+T — runAllTests is invoked by name inside the
                // document keydown handler. We await it transitively via
                // observing the row class.
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 't', code: 'KeyT', altKey: true, bubbles: true, cancelable: true,
                }));
                // Wait for the row to leave pending (handler is async)
                for (let i = 0; i < 30; i++) {
                    await new Promise(r => setTimeout(r, 50));
                    const cls = document.getElementById('_test_row_0').className;
                    if (!cls.includes('pending')) return cls;
                }
                return document.getElementById('_test_row_0').className;
            });
            expect.equal(out.includes('pending'), false,
                'row still pending after Alt+T: ' + out);
        });
    });
}
