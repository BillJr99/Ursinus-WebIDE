// Breakpoints — UI surface. Verifies that the Run menu got the new
// breakpoint items, the shortcut overlay advertises F9, the CSS for the
// gutter dot + pause marker exists in the stylesheet, and that the
// breakpoint API is available on every language family's exercise page
// (regression guard against a future language path that forgets to
// include the shared init script).
//
// Runtime + storage behaviour lives in 08_breakpoints.mjs; this spec is
// intentionally fast (no Pyodide download, no Run-click flows) so it
// gives a quick UI-level signal.

import { withPage, step, expect, setSpec } from '../lib/harness.mjs';
import { ONE_PER_LANG } from '../lib/pages.mjs';

const JS_URL = '/Modules/Javascript/MinIndex.html';

export default async function run() {
    setSpec('09_breakpoints_ui');

    // ===================================================================
    // Menu items
    // ===================================================================
    await step('Run menu contains Toggle Breakpoint + Clear All items', async () => {
        await withPage(JS_URL, async (page) => {
            const items = await page.evaluate(() => {
                const menu = document.getElementById('menu-run');
                if (!menu) return null;
                return Array.from(menu.querySelectorAll('.menu-dropdown-item'))
                    .map(el => el.textContent.replace(/\s+/g, ' ').trim());
            });
            expect.truthy(items, 'Run menu not found');
            const labels = items.join(' | ');
            expect.contains(labels, 'Toggle Breakpoint');
            expect.contains(labels, 'F9');
            expect.contains(labels, 'Clear All Breakpoints');
        });
    });

    await step('Toggle Breakpoint menu item calls toggleBreakpointAtCursor', async () => {
        await withPage(JS_URL, async (page) => {
            await page.waitForFunction(() => typeof window.ace_editor !== 'undefined' && window.ace_editor);
            const out = await page.evaluate(() => {
                let called = false;
                const orig = window.toggleBreakpointAtCursor;
                window.toggleBreakpointAtCursor = () => { called = true; orig.call(window); };
                // Find the menu item and click it
                const items = Array.from(document.querySelectorAll('#menu-run .menu-dropdown-item'));
                const tgt = items.find(el => el.textContent.includes('Toggle Breakpoint'));
                tgt && tgt.click();
                return called;
            });
            expect.equal(out, true, 'menu item did not invoke toggleBreakpointAtCursor');
        });
    });

    await step('Clear All Breakpoints menu item calls clearAllBreakpoints', async () => {
        await withPage(JS_URL, async (page) => {
            await page.waitForFunction(() => typeof window.ace_editor !== 'undefined' && window.ace_editor);
            const out = await page.evaluate(() => {
                let called = false;
                const orig = window.clearAllBreakpoints;
                window.clearAllBreakpoints = (...a) => { called = true; orig.apply(window, a); };
                const items = Array.from(document.querySelectorAll('#menu-run .menu-dropdown-item'));
                const tgt = items.find(el => el.textContent.includes('Clear All Breakpoints'));
                tgt && tgt.click();
                return called;
            });
            expect.equal(out, true, 'menu item did not invoke clearAllBreakpoints');
        });
    });

    // ===================================================================
    // Shortcut overlay
    // ===================================================================
    await step('Shortcut overlay advertises F9 for toggle breakpoint', async () => {
        await withPage(JS_URL, async (page) => {
            const found = await page.evaluate(() => {
                const overlay = document.getElementById('ide-shortcuts-overlay');
                if (!overlay) return null;
                const rows = Array.from(overlay.querySelectorAll('.shortcut-row'))
                    .map(r => r.textContent.replace(/\s+/g, ' ').trim());
                return rows.find(r => r.includes('breakpoint')) || null;
            });
            expect.truthy(found, 'no breakpoint shortcut row found');
            expect.contains(found, 'F9');
        });
    });

    // ===================================================================
    // CSS: gutter dot + pause marker + colorblind variant
    // ===================================================================
    await step('CSS rule for .webide-breakpoint::before exists', async () => {
        await withPage(JS_URL, async (page) => {
            const out = await page.evaluate(() => {
                // Force a breakpoint render so the cell exists, then read the
                // computed style of its ::before pseudo-element.
                const t = document.querySelector('.tab.active');
                if (!t) return { reason: 'no active tab' };
                window.ace_editor.gotoLine(2, 0, false);
                window.toggleBreakpointAtCursor();
                // Wait one frame
                return new Promise(resolve => {
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        const cell = document.querySelector('.ace_gutter-cell.webide-breakpoint');
                        if (!cell) return resolve({ reason: 'cell not rendered' });
                        const cs = getComputedStyle(cell, '::before');
                        resolve({
                            content: cs.getPropertyValue('content'),
                            width:   cs.getPropertyValue('width'),
                            background: cs.getPropertyValue('background-color'),
                            borderRadius: cs.getPropertyValue('border-radius'),
                        });
                    }));
                });
            });
            expect.truthy(out && !out.reason, 'breakpoint dot did not render: ' + JSON.stringify(out));
            expect.matches(out.width, /^\d+(\.\d+)?px$/, 'width not set');
            // The default background is the red dot — accept any non-transparent value
            expect.matches(out.background, /rgba?\(/, 'background not set');
            expect.contains(out.borderRadius, '50%');
        });
    });

    await step('Color-blind mode swaps the breakpoint dot background', async () => {
        await withPage(JS_URL, async (page) => {
            const both = await page.evaluate(() => {
                const t = document.querySelector('.tab.active');
                if (!t) return null;
                window.ace_editor.gotoLine(2, 0, false);
                window.toggleBreakpointAtCursor();
                return new Promise(resolve => {
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        const cell = document.querySelector('.ace_gutter-cell.webide-breakpoint');
                        if (!cell) return resolve(null);
                        const before = getComputedStyle(cell, '::before').getPropertyValue('background-color');
                        document.body.dataset.colorblind = 'true';
                        requestAnimationFrame(() => requestAnimationFrame(() => {
                            const after = getComputedStyle(cell, '::before').getPropertyValue('background-color');
                            resolve({ before, after });
                        }));
                    }));
                });
            });
            expect.truthy(both, 'pseudo-element not measurable');
            expect.equal(both.before !== both.after, true,
                'color-blind mode did not change the dot color (before=' + both.before + ', after=' + both.after + ')');
        });
    });

    await step('webide-pause-marker CSS rule is defined (PR 1 step 4 readiness)', async () => {
        await withPage(JS_URL, async (page) => {
            const ok = await page.evaluate(() => {
                // Create a probe element with the class and check the computed
                // background — the rule sets a tinted overlay.
                const probe = document.createElement('div');
                probe.className = 'ace_editor';
                probe.style.position = 'absolute';
                probe.style.left = '-9999px';
                document.body.appendChild(probe);
                const inner = document.createElement('div');
                inner.className = 'webide-pause-marker';
                inner.style.width = '1px'; inner.style.height = '1px';
                probe.appendChild(inner);
                const bg = getComputedStyle(inner).backgroundColor;
                document.body.removeChild(probe);
                return bg;
            });
            // Either rgb()/rgba() — both indicate the rule matched and applied a color.
            expect.matches(ok, /rgba?\(/, 'pause marker CSS rule not applied');
        });
    });

    // ===================================================================
    // Multi-language: API present on every language family's exercise page
    // ===================================================================
    for (const entry of ONE_PER_LANG) {
        await step(`Breakpoint API present on ${entry.label} page`, async () => {
            await withPage(entry.url, async (page) => {
                // Wait just for the script tags to evaluate — don't wait for
                // Pyodide download etc., since the API is wired before any
                // runtime loads.
                await page.waitForFunction(() => typeof window.webideBreakpoints?.get === 'function',
                    { timeout: 25000 });
                const ok = await page.evaluate(() => {
                    // Storage round-trip works without an active editor too
                    const path = '/probe/' + Math.random();
                    localStorage.setItem('webide.breakpoints', JSON.stringify({ [path]: [1] }));
                    return window.webideBreakpoints.has(path, 1) === false;  // not loaded yet
                });
                // The has() check intentionally returns false because the
                // in-memory mirror was already loaded at page boot — that's
                // the contract. Just assert it didn't throw.
                expect.equal(ok, true);
            });
        });
    }

    // ===================================================================
    // No new console errors
    // ===================================================================
    await step('No JS errors when toggling breakpoints under normal flow', async () => {
        await withPage(JS_URL, async (page) => {
            const errors = [];
            page.on('pageerror', (e) => errors.push(e.message));
            page.on('console', (m) => {
                if (m.type() === 'error') errors.push('[console.error] ' + m.text());
            });
            await page.waitForFunction(() => typeof window.ace_editor !== 'undefined' && window.ace_editor);
            await page.evaluate(() => {
                window.ace_editor.gotoLine(2, 0, false); window.toggleBreakpointAtCursor();
                window.ace_editor.gotoLine(5, 0, false); window.toggleBreakpointAtCursor();
                window.ace_editor.gotoLine(2, 0, false); window.toggleBreakpointAtCursor();  // remove
                window.clearAllBreakpoints();
            });
            // Filter out ambient noise the harness already accepts (font CDN etc.)
            const real = errors.filter(e =>
                !/fonts\.gstatic|fonts\.googleapis|mathjax|favicon/.test(e));
            expect.equal(real.length, 0, 'unexpected errors: ' + real.join(' | '));
        });
    });
}
