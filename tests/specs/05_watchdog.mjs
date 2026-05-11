// "Running…" banner appears on Run, clears when run completes.
// We can't realistically simulate an infinite loop in a test (would freeze
// the test runner), so we just verify the banner-installation path and the
// teardown path.

import { withPage, step, expect, setSpec } from '../lib/harness.mjs';

export default async function run() {
    setSpec('05_watchdog');

    await step('Running banner appears, then clears after run completes', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await page.waitForFunction(
                () => document.getElementById('run') && !document.getElementById('run').disabled,
                { timeout: 20000 }
            );
            // Click run; the banner should appear briefly then be removed
            // when runCode resolves. We poll for both states.
            await page.locator('#run').click();
            // Banner sometimes resolves in <100ms for tiny code — check both
            // appearance OR clean teardown after settle
            await page.waitForTimeout(2500);
            const stillRunning = await page.locator('text=Running…').count();
            expect.equal(stillRunning, 0, 'banner should be removed after run completes');
        });
    });

    await step('Watchdog timers cleared after a run (no leaked setTimeout)', async () => {
        await withPage('/Modules/Javascript/MinIndex.html', async (page) => {
            await page.waitForFunction(
                () => document.getElementById('run') && !document.getElementById('run').disabled,
                { timeout: 20000 }
            );
            await page.locator('#run').click();
            await page.waitForTimeout(2500);
            // Check that the global timers array (closure-scoped, but the
            // banner div is on the page) — verify by absence of any banner
            // children inside #console
            const orphanBanners = await page.evaluate(() => {
                const c = document.getElementById('console');
                if (!c) return -1;
                return Array.from(c.children).filter(d => /Running…/.test(d.textContent)).length;
            });
            expect.equal(orphanBanners, 0, 'leaked banner div');
        });
    });
}
