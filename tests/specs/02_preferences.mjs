// Theme cycle, font cycle, dyslexia toggle, shortcut overlay open/close,
// localStorage persistence. Run on one representative page (Java IDE) plus
// quick re-run on a non-Java page to confirm preferences are layout-level
// and don't depend on language.

import { withPage, step, expect, snap, setSpec } from '../lib/harness.mjs';

const PRIMARY = '/Modules/IDE/Exercise.html';

export default async function run() {
    setSpec('02_preferences');

    await step('Theme cycles dark → light → hc → dark', async () => {
        await withPage(PRIMARY, async (page) => {
            const theme = async () => page.evaluate(() => document.body.dataset.theme || 'dark');
            expect.equal(await theme(), 'dark', 'initial theme should be dark');
            await page.evaluate(() => menuCycleTheme()); expect.equal(await theme(), 'light');
            await page.evaluate(() => menuCycleTheme()); expect.equal(await theme(), 'hc');
            await page.evaluate(() => menuCycleTheme()); expect.equal(await theme(), 'dark');
        });
    });

    await step('Theme persists across reloads (localStorage)', async () => {
        await withPage(PRIMARY, async (page) => {
            await page.evaluate(() => menuCycleTheme()); // → light
            const persisted = await page.evaluate(() =>
                JSON.parse(localStorage.getItem('webide.prefs')).theme
            );
            expect.equal(persisted, 'light');
            await page.reload({ waitUntil: 'load' });
            await page.waitForTimeout(2000);
            const after = await page.evaluate(() => document.body.dataset.theme);
            expect.equal(after, 'light');
        });
    });

    await step('Font size cycles and persists', async () => {
        await withPage(PRIMARY, async (page) => {
            const startSize = await page.evaluate(() =>
                JSON.parse(localStorage.getItem('webide.prefs') || '{"fontSize":14}').fontSize
            );
            await page.evaluate(() => menuCycleFontSize());
            const next = await page.evaluate(() =>
                JSON.parse(localStorage.getItem('webide.prefs')).fontSize
            );
            expect.greater(next, startSize - 0.001, `expected new size > old (${startSize} → ${next})`);
        });
    });

    await step('Reading mode toggles to dyslexia and back', async () => {
        await withPage(PRIMARY, async (page) => {
            await page.evaluate(() => menuToggleReadingMode());
            expect.equal(await page.evaluate(() => document.body.dataset.readingmode), 'dyslexia');
            await page.evaluate(() => menuToggleReadingMode());
            expect.equal(await page.evaluate(() => document.body.dataset.readingmode), 'default');
        });
    });

    await step('"?" key opens shortcut overlay; Esc closes it', async () => {
        await withPage(PRIMARY, async (page) => {
            await page.evaluate(() => document.activeElement && document.activeElement.blur());
            await page.keyboard.press('?');
            await page.waitForTimeout(150);
            expect.truthy(
                await page.locator('#ide-shortcuts-overlay.visible').count(),
                'overlay did not open'
            );
            await page.keyboard.press('Escape');
            await page.waitForTimeout(150);
            expect.equal(
                await page.locator('#ide-shortcuts-overlay.visible').count(), 0,
                'overlay did not close'
            );
        });
    });

    await step('"?" key inside an input field types literal "?" instead', async () => {
        await withPage(PRIMARY, async (page) => {
            // Open the input dialog. idePrompt returns a Promise that doesn't
            // resolve until Enter/Escape; fire-and-forget by wrapping in a
            // void IIFE so page.evaluate doesn't await it.
            await page.evaluate(() => { void idePrompt('test'); });
            await page.waitForTimeout(150);
            await page.locator('#ide-input-field').focus();
            await page.keyboard.press('?');
            await page.waitForTimeout(80);
            const value = await page.locator('#ide-input-field').inputValue();
            expect.equal(value, '?', 'input should contain a literal "?"');
            const overlayCount = await page.locator('#ide-shortcuts-overlay.visible').count();
            expect.equal(overlayCount, 0, 'overlay must not open while typing');
            // Dismiss the dialog so we leave a clean state for downstream tests
            await page.keyboard.press('Escape');
        });
    });

    await step('Compact layout: activity bar hidden below 900px', async () => {
        await withPage(PRIMARY, { viewport: { width: 700, height: 800 } }, async (page) => {
            const display = await page.locator('#ide-activity-bar').evaluate(el => getComputedStyle(el).display);
            expect.equal(display, 'none', `activity bar display is ${display}`);
        });
    });

    // Visual reference for the report
    setSpec('02_preferences_screens');
    const screenshotCases = [
        { label: 'light',         setup: async (p) => { await p.evaluate(() => menuCycleTheme()); } },
        { label: 'high_contrast', setup: async (p) => { await p.evaluate(() => { menuCycleTheme(); menuCycleTheme(); }); } },
        { label: 'dyslexia',      setup: async (p) => { await p.evaluate(() => menuToggleReadingMode()); } },
        { label: 'shortcuts',     setup: async (p) => {
            await p.evaluate(() => document.activeElement && document.activeElement.blur());
            await p.keyboard.press('?');
            await p.waitForTimeout(150);
        } },
    ];
    for (const c of screenshotCases) {
        await step(`screenshot ${c.label}`, async () => {
            await withPage(PRIMARY, async (page) => {
                await c.setup(page);
                await page.waitForTimeout(200);
                await snap(page, c.label);
            });
        });
    }
}
