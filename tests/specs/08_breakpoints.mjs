// Breakpoints — runtime, storage, and API behavior.
//
// This spec covers everything wired up in PR 1 step 1: the in-memory state,
// the localStorage shape, the toggle / clear / has API, F9 + gutter-click
// triggers, per-file isolation, restoration on reload, edge cases (no active
// file, empty-path cleanup), and ace_editor exposure for tests.
//
// UI-layer coverage (menu items, shortcut overlay, CSS, multi-language
// smoke) lives in 09_breakpoints_ui.mjs so a regression in one layer
// doesn't muddy the other.

import { withPage, step, expect, setSpec } from '../lib/harness.mjs';

const JS_URL      = '/Modules/Javascript/MinIndex.html';
const PYODIDE_URL = '/Modules/Pyodide/PlotTenHeads.html';

// Convenience — wait until the IDE has booted enough that we can drive it.
async function waitForIdeReady(page) {
    await page.waitForFunction(() => {
        const t = document.querySelector('.tab.active');
        return typeof window.ace_editor !== 'undefined' && window.ace_editor &&
               t && t.id && t.id !== '__submit_form__';
    }, { timeout: 15000 });
}

export default async function run() {
    setSpec('08_breakpoints');

    // ===================================================================
    // A. API surface
    // ===================================================================
    await step('window.ace_editor is exposed for tests + extensions', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const t = await page.evaluate(() => typeof window.ace_editor);
            expect.equal(t, 'object');
        });
    });

    await step('webideBreakpoints + toggle/clear API are exposed on window', async () => {
        await withPage(JS_URL, async (page) => {
            const api = await page.evaluate(() => ({
                hasGet:        typeof window.webideBreakpoints?.get === 'function',
                hasGetActive:  typeof window.webideBreakpoints?.getForActive === 'function',
                hasHas:        typeof window.webideBreakpoints?.has === 'function',
                hasToggle:     typeof window.toggleBreakpointAtCursor === 'function',
                hasClearAll:   typeof window.clearAllBreakpoints === 'function',
            }));
            expect.equal(api.hasGet, true);
            expect.equal(api.hasGetActive, true);
            expect.equal(api.hasHas, true);
            expect.equal(api.hasToggle, true);
            expect.equal(api.hasClearAll, true);
        });
    });

    await step('has() returns true/false for present/absent breakpoints', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const out = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                localStorage.setItem('webide.breakpoints', JSON.stringify({ [p]: [4, 9] }));
                location.reload();
            });
            await waitForIdeReady(page);
            const checks = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                return {
                    has4: window.webideBreakpoints.has(p, 4),
                    has5: window.webideBreakpoints.has(p, 5),
                    has9: window.webideBreakpoints.has(p, 9),
                    hasNonexistent: window.webideBreakpoints.has('/nope/file.js', 1),
                };
            });
            expect.equal(checks.has4, true);
            expect.equal(checks.has5, false);
            expect.equal(checks.has9, true);
            expect.equal(checks.hasNonexistent, false);
        });
    });

    await step('get() returns a defensive copy (mutation does not leak)', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const same = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                localStorage.setItem('webide.breakpoints', JSON.stringify({ [p]: [1, 2, 3] }));
                location.reload();
            });
            await waitForIdeReady(page);
            const after = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                const arr = window.webideBreakpoints.get(p);
                arr.push(999);                  // try to poison the internal state
                arr.length = 0;                 // clear the returned copy
                return window.webideBreakpoints.get(p);
            });
            expect.equal(after.length, 3, 'internal state was mutated through returned array');
            expect.equal(after.includes(999), false);
        });
    });

    await step('getForActive() reflects the currently focused tab', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const res = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                localStorage.setItem('webide.breakpoints', JSON.stringify({ [p]: [7], '/other/file.js': [42] }));
                location.reload();
            });
            await waitForIdeReady(page);
            const got = await page.evaluate(() => window.webideBreakpoints.getForActive());
            expect.equal(got.length, 1);
            expect.equal(got[0], 7);
        });
    });

    // ===================================================================
    // B. Toggle behavior — F9 and gutter click
    // ===================================================================
    await step('F9 toggles a breakpoint and the second F9 removes it', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            // Set
            const set = await page.evaluate(() => {
                window.ace_editor.gotoLine(3, 0, false);
                window.toggleBreakpointAtCursor();
                const p = document.querySelector('.tab.active').id;
                return {
                    has: window.webideBreakpoints.has(p, 3),
                    stored: JSON.parse(localStorage.getItem('webide.breakpoints') || '{}'),
                };
            });
            expect.equal(set.has, true);
            const path = Object.keys(set.stored)[0];
            expect.truthy(path);
            expect.equal(set.stored[path].includes(3), true);
            // Clear
            const cleared = await page.evaluate(() => {
                window.ace_editor.gotoLine(3, 0, false);
                window.toggleBreakpointAtCursor();
                const p = document.querySelector('.tab.active').id;
                return {
                    has: window.webideBreakpoints.has(p, 3),
                    stored: JSON.parse(localStorage.getItem('webide.breakpoints') || '{}'),
                };
            });
            expect.equal(cleared.has, false);
            // When a file has zero breakpoints, the empty key must be deleted.
            expect.equal(cleared.stored[path] || 'gone', 'gone');
        });
    });

    await step('Gutter mouse-down click toggles a breakpoint', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            // Synthesize an Ace guttermousedown event for row 4 (line 5)
            const result = await page.evaluate(() => {
                const editor = window.ace_editor;
                // Build a minimal compatible event for Ace's handler
                const cell = document.querySelector('.ace_gutter-cell');
                const rect = cell.getBoundingClientRect();
                const synth = {
                    domEvent: { target: cell },
                    clientX: rect.left + 8,
                    getDocumentPosition: () => ({ row: 4, column: 0 }),
                    stop: () => {},
                };
                editor._emit('guttermousedown', synth);
                const p = document.querySelector('.tab.active').id;
                return {
                    has: window.webideBreakpoints.has(p, 5),
                    stored: JSON.parse(localStorage.getItem('webide.breakpoints') || '{}'),
                };
            });
            expect.equal(result.has, true, 'gutter click did not register');
            const path = Object.keys(result.stored)[0];
            expect.equal(result.stored[path].includes(5), true);
        });
    });

    await step('Gutter click far right of dot area is ignored (folding zone)', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const result = await page.evaluate(() => {
                const editor = window.ace_editor;
                const cell = document.querySelector('.ace_gutter-cell');
                const rect = cell.getBoundingClientRect();
                // 30px in is well past the 18px breakpoint zone
                const synth = {
                    domEvent: { target: cell },
                    clientX: rect.left + 30,
                    getDocumentPosition: () => ({ row: 2, column: 0 }),
                    stop: () => {},
                };
                editor._emit('guttermousedown', synth);
                return JSON.parse(localStorage.getItem('webide.breakpoints') || '{}');
            });
            expect.equal(Object.keys(result).length, 0, 'click outside breakpoint zone added a bp');
        });
    });

    // ===================================================================
    // C. Multiple breakpoints, sorting, and isolation
    // ===================================================================
    await step('Multiple breakpoints in one file are stored sorted', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            // Use the path-based toggle so we don't depend on whether the
            // cursor can actually reach lines 10/5/2 in the current file.
            const stored = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                window.webideBreakpoints.toggle(p, 10);
                window.webideBreakpoints.toggle(p, 2);
                window.webideBreakpoints.toggle(p, 5);
                return JSON.parse(localStorage.getItem('webide.breakpoints') || '{}');
            });
            const path = Object.keys(stored)[0];
            expect.equal(JSON.stringify(stored[path]), JSON.stringify([2, 5, 10]),
                'breakpoints not sorted ascending');
        });
    });

    await step('Path-based toggle (.toggle) adds and removes correctly', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const out = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                window.webideBreakpoints.toggle(p, 1);
                window.webideBreakpoints.toggle(p, 2);
                const after1 = window.webideBreakpoints.get(p).slice();
                window.webideBreakpoints.toggle(p, 1);  // remove
                const after2 = window.webideBreakpoints.get(p).slice();
                return { after1, after2 };
            });
            expect.equal(JSON.stringify(out.after1), JSON.stringify([1, 2]));
            expect.equal(JSON.stringify(out.after2), JSON.stringify([2]));
        });
    });

    await step('Per-file isolation: bps on file A do not show on file B', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            // Seed two files in localStorage; only one is open as the active tab.
            const setup = await page.evaluate(() => {
                const active = document.querySelector('.tab.active').id;
                const otherPath = '/some/other/file.js';
                const seed = {
                    [active]:   [1, 2, 3],
                    [otherPath]: [50, 51],
                };
                localStorage.setItem('webide.breakpoints', JSON.stringify(seed));
                return { active, otherPath };
            });
            await page.reload();
            await waitForIdeReady(page);
            // Wait for the gutter to render the 3 active-file breakpoints (and ONLY those).
            await page.waitForFunction(
                () => document.querySelectorAll('.ace_gutter-cell.webide-breakpoint').length === 3,
                null, { timeout: 5000 }
            );
            // The 'other' file's bps are still in storage but not on screen
            const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('webide.breakpoints')));
            expect.equal((stored[setup.otherPath] || []).length, 2,
                'other-file breakpoints were lost');
        });
    });

    // ===================================================================
    // D. Persistence and reload
    // ===================================================================
    await step('Breakpoints survive a page reload and re-render gutter dots', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const path = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                localStorage.setItem('webide.breakpoints', JSON.stringify({ [p]: [2, 5] }));
                return p;
            });
            await page.reload();
            await waitForIdeReady(page);
            await page.waitForFunction(p => document.querySelector('.tab.active')?.id === p, path, { timeout: 15000 });

            const after = await page.evaluate((p) => ({
                bps: window.webideBreakpoints.get(p),
                dots: document.querySelectorAll('.ace_gutter-cell.webide-breakpoint').length,
            }), path);
            expect.equal(after.bps.length, 2);
            expect.equal(after.bps.includes(2), true);
            expect.equal(after.bps.includes(5), true);
            expect.equal(after.dots, 2);
        });
    });

    await step('Corrupted localStorage is tolerated (fresh empty state, no crash)', async () => {
        await withPage(JS_URL, async (page) => {
            await page.evaluate(() => {
                localStorage.setItem('webide.breakpoints', '{not-json{{');
            });
            await page.reload();
            await waitForIdeReady(page);
            const state = await page.evaluate(() => ({
                api: typeof window.webideBreakpoints?.get === 'function',
                active: window.webideBreakpoints.getForActive(),
            }));
            expect.equal(state.api, true, 'API not exposed after corrupted storage');
            expect.equal(Array.isArray(state.active), true);
            expect.equal(state.active.length, 0);
        });
    });

    // ===================================================================
    // E. Clear-all behaviour
    // ===================================================================
    await step('clearAllBreakpoints() with no arg wipes everything', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                localStorage.setItem('webide.breakpoints', JSON.stringify({
                    [p]: [1, 4, 7],
                    '/another/file.js': [99],
                }));
                location.reload();
            });
            await waitForIdeReady(page);
            await page.waitForFunction(
                () => document.querySelectorAll('.ace_gutter-cell.webide-breakpoint').length === 3,
                null, { timeout: 5000 }
            );

            const stored = await page.evaluate(() => {
                window.clearAllBreakpoints();
                return JSON.parse(localStorage.getItem('webide.breakpoints') || '{}');
            });
            expect.equal(Object.keys(stored).length, 0, 'storage not fully cleared');
            await page.waitForFunction(
                () => document.querySelectorAll('.ace_gutter-cell.webide-breakpoint').length === 0,
                null, { timeout: 2000 }
            );
        });
    });

    await step('clearAllBreakpoints(path) only clears that path', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const setup = await page.evaluate(() => {
                const active = document.querySelector('.tab.active').id;
                const other  = '/some/other/file.js';
                localStorage.setItem('webide.breakpoints', JSON.stringify({
                    [active]: [3], [other]: [10, 20],
                }));
                location.reload();
                return { active, other };
            });
            await waitForIdeReady(page);
            const after = await page.evaluate((s) => {
                window.clearAllBreakpoints(s.other);
                return {
                    stored: JSON.parse(localStorage.getItem('webide.breakpoints') || '{}'),
                    activeBps: window.webideBreakpoints.get(s.active),
                };
            }, setup);
            expect.equal(after.stored[setup.other] === undefined, true, 'other-path bps not cleared');
            expect.equal(after.activeBps.length, 1, 'active-path bps were wrongly cleared');
            expect.equal(after.activeBps[0], 3);
        });
    });

    // ===================================================================
    // F. Safety / edge cases
    // ===================================================================
    await step('toggleBreakpointAtCursor with no open file does not throw', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            const errors = [];
            page.on('pageerror', (e) => errors.push(e.message));
            await page.evaluate(() => {
                // Synthesize no-active-tab state
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                window.toggleBreakpointAtCursor();
            });
            expect.equal(errors.length, 0, 'toggle threw an error: ' + errors.join(' | '));
        });
    });

    await step('Toggling a breakpoint updates the gutter DOM synchronously enough', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIdeReady(page);
            await page.evaluate(() => {
                window.ace_editor.gotoLine(2, 0, false);
                window.toggleBreakpointAtCursor();
            });
            await page.waitForFunction(
                () => document.querySelectorAll('.ace_gutter-cell.webide-breakpoint').length === 1,
                null, { timeout: 2000 }
            );
        });
    });

    // ===================================================================
    // G. Pyodide smoke (different runtime init path)
    // ===================================================================
    await step('Breakpoint API + storage works on a Pyodide exercise page', async () => {
        await withPage(PYODIDE_URL, { waitMs: 4000 }, async (page) => {
            await waitForIdeReady(page);
            const out = await page.evaluate(() => {
                const p = document.querySelector('.tab.active').id;
                window.webideBreakpoints.toggle(p, 2);
                return {
                    has: window.webideBreakpoints.has(p, 2),
                    stored: JSON.parse(localStorage.getItem('webide.breakpoints') || '{}'),
                };
            });
            expect.equal(out.has, true);
            const path = Object.keys(out.stored)[0];
            expect.equal(out.stored[path].includes(2), true);
            // Gutter render is RAF-batched; wait for the dot to appear
            await page.waitForFunction(
                () => document.querySelectorAll('.ace_gutter-cell.webide-breakpoint').length === 1,
                null, { timeout: 3000 }
            );
        });
    });
}
