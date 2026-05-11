// Meta-tests for the test harness itself. Catches regressions in step() /
// snap() bookkeeping that would otherwise silently misattribute screenshots
// to the wrong test in the HTML report.

import { withPage, step, snap, expect, setSpec, results } from '../lib/harness.mjs';

export default async function run() {
    setSpec('00_harness_self_test');

    await step('snap() inside step() attaches to the CURRENT step result', async () => {
        await withPage('/Modules/IDE/Exercise.html', async (page) => {
            // Remember how many results existed before this step started; the
            // record for the *currently running* step has already been pushed.
            const beforeIdx = results.length - 1;
            const myRecord  = results[beforeIdx];
            expect.equal(myRecord.name, 'snap() inside step() attaches to the CURRENT step result');

            await snap(page, 'harness_self_test_marker');

            // After snap(), the screenshot should be on MY result, not a
            // previous one and not orphaned.
            expect.truthy(myRecord.screenshots && myRecord.screenshots.length > 0,
                'screenshot not attached to current step');
            expect.matches(myRecord.screenshots[0], /harness_self_test_marker/,
                `attached file was ${myRecord.screenshots[0]}`);

            // And it should NOT have leaked onto an earlier record
            for (let i = 0; i < beforeIdx; i++) {
                const r = results[i];
                if (r.screenshots) {
                    for (const f of r.screenshots) {
                        expect.equal(/harness_self_test_marker/.test(f), false,
                            `screenshot leaked onto earlier result ${r.spec}/${r.name}`);
                    }
                }
            }
        });
    });
}
