// Per-language smoke tests: page loads, no uncaught JS errors, the new
// menu items + Inspector tab + shortcut overlay markup all rendered.
//
// This is the broadest sanity check — if it fails for a language, the
// new features haven't reached that page at all.

import { withPage, step, expect, snap, setSpec } from '../lib/harness.mjs';
import { LANGUAGES } from '../lib/pages.mjs';

export default async function run() {
    setSpec('01_smoke');
    for (const p of LANGUAGES) {
        const tag = p.label;
        await step(`${tag}: page loads, no uncaught JS errors`, async () => {
            await withPage(p.url, async (page, { pageErrors }) => {
                // Filter ambient noise that has nothing to do with the page itself
                const real = pageErrors.filter(e =>
                    !/Failed to fetch/.test(e) &&
                    !/googleapis|fonts\.gstatic/.test(e) &&
                    !/MathJax|net::ERR_/.test(e)
                );
                expect.equal(real.length, 0, real.length ? real.join('\n').slice(0, 300) : '');
            });
        });

        await step(`${tag}: View > Theme/Font/Reading-Mode menu items present`, async () => {
            await withPage(p.url, async (page) => {
                expect.truthy(await page.locator('#menu-theme-label').count(), 'no theme label');
                expect.truthy(await page.locator('#menu-fontsize-label').count(), 'no font label');
                expect.truthy(await page.locator('#menu-readingmode-label').count(), 'no reading-mode label');
            });
        });

        await step(`${tag}: Help menu + shortcut overlay markup present`, async () => {
            await withPage(p.url, async (page) => {
                expect.truthy(await page.locator('#menu-help').count(), 'no Help menu');
                expect.truthy(await page.locator('#ide-shortcuts-overlay').count(), 'no overlay');
            });
        });

        await step(`${tag}: Inspector tab + sub-views all present`, async () => {
            await withPage(p.url, async (page) => {
                expect.truthy(await page.locator('#btab-inspector').count(), 'no inspector tab');
                expect.truthy(await page.locator('#inspector-vars').count(), 'no vars view');
                expect.truthy(await page.locator('#inspector-steps').count(), 'no steps view');
                expect.truthy(await page.locator('#inspector-trace').count(), 'no trace view');
            });
        });

        await step(`${tag}: Run button enables once user is logged in`, async () => {
            await withPage(p.url, async (page) => {
                const disabled = await page.locator('#run').isDisabled();
                expect.equal(disabled, false, 'Run button still disabled (no user?)');
            });
        });
    }

    // One screenshot per language for the report
    setSpec('01_smoke_screens');
    for (const p of LANGUAGES) {
        await step(`screenshot: ${p.label}`, async () => {
            await withPage(p.url, async (page) => {
                await snap(page, p.label);
            });
        });
    }
}
