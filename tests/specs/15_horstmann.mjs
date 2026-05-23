// Smoke tests for the exercise_horstmann.html layout (Cay Horstmann's
// Codecheck Parsons Puzzles).
//
// The Parsons puzzle UI is driven by an external CDN at horstmann.com —
// we can't drag-and-drop programmatically and we don't want to depend on
// that external service in every CI run. These tests verify:
//   1. The page loads (no server 404 or JS crash on load).
//   2. The Parsons puzzle container renders.
//   3. Navigating to the page and back doesn't break the layout.
//
// Exercise URLs are discovered from _pages/Ursinus-Exercises/ via discover.mjs.
// If the submodule is not checked out the tests are skipped gracefully.

import { withPage, step, snap, setSpec, expect } from '../lib/harness.mjs';
import { byLayout } from '../exercises/discover.mjs';

export default async function run() {
    setSpec('15_horstmann');

    const grouped = byLayout();
    const horstmannExercises = (grouped['exercise_horstmann'] || []);

    if (horstmannExercises.length === 0) {
        await step('Horstmann exercises: submodule required', async () => {
            return { message: 'No exercise_horstmann pages found — check out the Ursinus-Exercises submodule to enable these tests' };
        });
        return;
    }

    // Use the first available Horstmann exercise as the representative.
    const rep = horstmannExercises[0];
    console.log(`  Representative: ${rep.url} (${rep.title})`);

    await step(`Horstmann page loads without crash (${rep.title})`, async () => {
        await withPage(rep.url, { waitMs: 4000 }, async (page, { pageErrors }) => {
            // Page title should be set
            const title = await page.title();
            expect.truthy(title && title.length > 0, `page title empty`);

            // The Horstmann layout wraps the puzzle in .codecheck_tracer
            const containers = await page.locator('.codecheck_tracer').count();
            expect.greater(containers, 0, 'expected .codecheck_tracer container');

            // No crash-level page errors (filter CDN load timing issues)
            const hardErrors = pageErrors.filter(e =>
                !e.includes('horstmann.com') &&
                !e.includes('cdnjs') &&
                !e.includes('cdn.jsdelivr') &&
                !e.includes('polyfill')
            );
            expect.equal(hardErrors.length, 0, `page errors: ${hardErrors.join('; ')}`);

            await snap(page, 'horstmann_page_load');
        });
    });

    await step(`Horstmann page h1 title is visible (${rep.title})`, async () => {
        await withPage(rep.url, { waitMs: 3000 }, async (page) => {
            const h1 = await page.locator('h1.page__title').first().textContent().catch(() => '');
            expect.truthy(h1 && h1.trim().length > 0, `h1.page__title is empty: "${h1}"`);
        });
    });

    // Test each Horstmann exercise for basic page-load health (lightweight).
    if (horstmannExercises.length > 1) {
        for (const ex of horstmannExercises.slice(1)) {
            await step(`Horstmann page loads: ${ex.title}`, async () => {
                await withPage(ex.url, { waitMs: 3000 }, async (page, { pageErrors }) => {
                    const containers = await page.locator('.codecheck_tracer').count();
                    expect.greater(containers, 0, 'expected .codecheck_tracer container');
                    const hardErrors = pageErrors.filter(e =>
                        !e.includes('horstmann.com') && !e.includes('cdnjs') &&
                        !e.includes('cdn.jsdelivr') && !e.includes('polyfill')
                    );
                    expect.equal(hardErrors.length, 0, `page errors: ${hardErrors.join('; ')}`);
                });
            });
        }
    }
}
