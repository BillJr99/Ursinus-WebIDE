// Tests for ORIGINAL functionality of the IDE that pre-dates the new feature
// work. These should pass on the unmodified code; if my changes broke any of
// them they'll show up here.

import { withPage, step, expect, setSpec } from '../lib/harness.mjs';

const PAGE = '/Modules/IDE/Exercise.html';

export default async function run() {
    setSpec('06_original_features');

    await step('Login flow: status bar shows logged-in user', async () => {
        await withPage(PAGE, async (page) => {
            const statusUser = await page.locator('#status-user').textContent();
            expect.contains(statusUser, 'testuser');
        });
    });

    await step('Logout clears user, disables Run, removes localStorage userId', async () => {
        await withPage(PAGE, async (page) => {
            await page.locator('#logout').click();
            await page.waitForTimeout(500);
            const stored = await page.evaluate(() => localStorage.getItem('userId'));
            expect.equal(stored, null, `userId still in storage: ${stored}`);
            const disabled = await page.locator('#run').isDisabled();
            expect.equal(disabled, true, 'Run should be disabled after logout');
        });
    });

    await step('Word Wrap toggle flips status indicator', async () => {
        await withPage(PAGE, async (page) => {
            const before = await page.locator('#status-wordwrap').textContent();
            await page.evaluate(() => menuToggleWordWrap());
            await page.waitForTimeout(120);
            const after = await page.locator('#status-wordwrap').textContent();
            expect.equal(after !== before, true, `status didn't change (was "${before}", still "${after}")`);
        });
    });

    await step('Toggle Sidebar hides/shows the sidebar', async () => {
        await withPage(PAGE, async (page) => {
            await page.evaluate(() => menuToggleSidebar());
            await page.waitForTimeout(120);
            const hidden = await page.locator('#ide-sidebar').evaluate(el => el.style.display);
            expect.equal(hidden, 'none');
            await page.evaluate(() => menuToggleSidebar());
            await page.waitForTimeout(120);
            const shown = await page.locator('#ide-sidebar').evaluate(el => el.style.display);
            expect.equal(shown !== 'none', true, `sidebar should be visible, got display="${shown}"`);
        });
    });

    await step('Toggle Terminal hides/shows the bottom panel', async () => {
        await withPage(PAGE, async (page) => {
            await page.evaluate(() => menuToggleTerminal());
            await page.waitForTimeout(120);
            const hidden = await page.locator('#ide-bottom-panel').evaluate(el => el.style.display);
            expect.equal(hidden, 'none');
            await page.evaluate(() => menuToggleTerminal());
            await page.waitForTimeout(120);
            const shown = await page.locator('#ide-bottom-panel').evaluate(el => el.style.display);
            expect.equal(shown !== 'none', true);
        });
    });

    await step('Clear Output empties the console', async () => {
        await withPage(PAGE, async (page) => {
            await page.evaluate(() => window.logToConsole('test line 1'));
            await page.evaluate(() => window.logToConsole('test line 2'));
            const before = await page.locator('#console').evaluate(el => el.children.length);
            expect.greater(before, 0, 'expected lines in console');
            await page.evaluate(() => menuClearOutput());
            const after = await page.locator('#console').evaluate(el => el.children.length);
            expect.equal(after, 0, `expected 0 lines after clear, got ${after}`);
        });
    });

    await step('Activity bar: switching to GitHub panel works', async () => {
        await withPage(PAGE, async (page) => {
            await page.evaluate(() => switchActivity('github'));
            await page.waitForTimeout(120);
            const active = await page.locator('#panel-github').evaluate(el => el.classList.contains('active'));
            expect.equal(active, true);
        });
    });

    await step('Activity bar: switching to Info panel works', async () => {
        await withPage(PAGE, async (page) => {
            await page.evaluate(() => switchActivity('info'));
            await page.waitForTimeout(120);
            const active = await page.locator('#panel-info').evaluate(el => el.classList.contains('active'));
            expect.equal(active, true);
        });
    });

    await step('Bottom-tab switching: Terminal → Output → Suggestions → Inspector', async () => {
        await withPage(PAGE, async (page) => {
            for (const tab of ['terminal', 'output', 'suggestions', 'inspector']) {
                await page.evaluate(t => switchBottomTab(t), tab);
                await page.waitForTimeout(80);
                const active = await page.locator('#' + tab + '-panel').evaluate(el => el.classList.contains('active'));
                expect.equal(active, true, `${tab} panel did not become active`);
            }
        });
    });

    await step('Initial files load into editor (Java IDE has MyFirstProgram.java)', async () => {
        await withPage(PAGE, async (page) => {
            // Wait a bit longer for IndexedDB + tab population
            await page.waitForTimeout(2500);
            const tabs = await page.locator('.tab').allTextContents();
            const tabNames = tabs.map(t => t.replace(/[\s×x]+$/, '').trim());
            expect.truthy(
                tabNames.some(n => /MyFirstProgram\.java/i.test(n)),
                `expected MyFirstProgram.java tab; got ${JSON.stringify(tabNames)}`
            );
        });
    });

    await step('Status bar shows page language', async () => {
        await withPage(PAGE, async (page) => {
            const lang = await page.locator('#status-lang').textContent();
            expect.equal(lang.trim(), 'java');
        });
    });

    await step('Document title is set from page front-matter', async () => {
        await withPage(PAGE, async (page) => {
            const title = await page.title();
            expect.matches(title, /NetBeans IDE|Ursinus WebIDE/, `title was: "${title}"`);
        });
    });

    await step('Existing keyboard shortcuts still work (Ctrl+B toggles sidebar)', async () => {
        await withPage(PAGE, async (page) => {
            await page.evaluate(() => document.activeElement && document.activeElement.blur());
            await page.keyboard.press('Control+B');
            await page.waitForTimeout(120);
            const hidden = await page.locator('#ide-sidebar').evaluate(el => el.style.display);
            expect.equal(hidden, 'none', 'Ctrl+B should have hidden the sidebar');
        });
    });
}
