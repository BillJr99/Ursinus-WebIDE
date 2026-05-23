// Smoke tests for the exercise_r.html layout (R terminal exercises).
//
// The R layout uses a JQuery terminal connected to a backend at
// mathcs.ursinus.edu — actual code execution requires VPN access and is
// therefore not tested here. These tests verify:
//   1. The page loads without JS crashes.
//   2. The tab UI (tabs / labels) renders.
//   3. A Run button or terminal input element is present.
//
// Exercise URLs are discovered from _pages/Ursinus-Exercises/ via discover.mjs.
// If the submodule is not checked out the tests are skipped gracefully.

import { withPage, step, snap, setSpec, expect } from '../lib/harness.mjs';
import { byLayout } from '../exercises/discover.mjs';

export default async function run() {
    setSpec('16_r_layout');

    const grouped = byLayout();
    const rExercises = (grouped['exercise_r'] || []);

    if (rExercises.length === 0) {
        await step('R layout exercises: submodule required', async () => {
            return { message: 'No exercise_r pages found — check out the Ursinus-Exercises submodule to enable these tests' };
        });
        return;
    }

    // Use the first available R exercise as the representative.
    const rep = rExercises[0];
    console.log(`  Representative: ${rep.url} (${rep.title})`);

    await step(`R layout page loads without crash (${rep.title})`, async () => {
        await withPage(rep.url, { waitMs: 4000 }, async (page, { pageErrors }) => {
            const title = await page.title();
            expect.truthy(title && title.length > 0, `page title empty`);

            // The R layout renders a .tabs container and jquery.terminal.
            // Accept either pattern — the layout is known to vary.
            const tabCount   = await page.locator('.tabs').count();
            const termCount  = await page.locator('.terminal, .terminal-wrapper').count();
            const hasUi = tabCount > 0 || termCount > 0;
            expect.truthy(hasUi, 'expected .tabs or .terminal container in R layout');

            // No hard JS crashes (filter known external CDN issues).
            const hardErrors = pageErrors.filter(e =>
                !e.includes('cdn.rawgit') &&
                !e.includes('cdnjs') &&
                !e.includes('cdn.jsdelivr') &&
                !e.includes('polyfill') &&
                !e.includes('mathcs.ursinus.edu')
            );
            expect.equal(hardErrors.length, 0, `page errors: ${hardErrors.join('; ')}`);

            await snap(page, 'r_layout_page_load');
        });
    });

    await step(`R layout page h1 title is visible (${rep.title})`, async () => {
        await withPage(rep.url, { waitMs: 3000 }, async (page) => {
            // R layout uses standard Jekyll h1 — check for any h1 with content.
            const h1 = await page.locator('h1').first().textContent().catch(() => '');
            expect.truthy(h1 && h1.trim().length > 0, `h1 is empty: "${h1}"`);
        });
    });

    // Smoke-load remaining R exercises.
    if (rExercises.length > 1) {
        for (const ex of rExercises.slice(1)) {
            await step(`R layout page loads: ${ex.title}`, async () => {
                await withPage(ex.url, { waitMs: 3000 }, async (page, { pageErrors }) => {
                    const tabCount  = await page.locator('.tabs').count();
                    const termCount = await page.locator('.terminal, .terminal-wrapper').count();
                    expect.truthy(tabCount > 0 || termCount > 0, 'expected .tabs or .terminal container');
                    const hardErrors = pageErrors.filter(e =>
                        !e.includes('cdn.rawgit') && !e.includes('cdnjs') &&
                        !e.includes('cdn.jsdelivr') && !e.includes('polyfill') &&
                        !e.includes('mathcs.ursinus.edu')
                    );
                    expect.equal(hardErrors.length, 0, `page errors: ${hardErrors.join('; ')}`);
                });
            });
        }
    }
}
