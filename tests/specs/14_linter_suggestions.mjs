// Test suite for the Suggestions panel and _analysisRules lint engine.
// Verifies:
//  - The Suggestions tab exists and badge updates when issues are found
//  - CS173 Style Guide rules fire for Java
//  - Per-language rules fire for Python, C++, JavaScript, SQL, Scheme, Prolog
//  - Clicking a suggestion row jumps the editor to the right line

import { withPage, step, expect, setSpec } from '../lib/harness.mjs';

export default async function run() {
    setSpec('14_linter_suggestions');

    // ------------------------------------------------------------------ helpers
    const JAVA_URL   = '/Modules/IDE/Exercise.html';
    const PY_URL     = '/Modules/Python/Warmup/Exercise.html';
    const CPP_URL    = '/Modules/Cpp/CppIntro.html';
    const JS_URL     = '/Modules/Javascript/MinIndex.html';
    const SQL_URL    = '/Modules/SQL/Warmup/Exercise.html';
    const SCH_URL    = '/Modules/Scheme/Warmup/Exercise.html';
    const PRO_URL    = '/Modules/Prolog/Warmup/Exercise.html';

    async function waitForIDE(page) {
        await page.waitForFunction(
            () => typeof window.ace_editor !== 'undefined' && window.ace_editor,
            { timeout: 20000 }
        );
    }

    async function setCode(page, code) {
        await page.evaluate(c => {
            window.ace_editor.setValue(c, 1);
        }, code);
        // Wait for the debounced analysis (800ms + buffer)
        await page.waitForTimeout(1100);
    }

    async function getSuggestions(page) {
        return page.evaluate(() => {
            const items = [...document.querySelectorAll('#suggestions-list .suggestion-item')];
            return items.map(el => ({
                message: (el.querySelector('.suggestion-message') || el.querySelector('.suggestion-content') || el).textContent?.trim(),
                line: parseInt((el.getAttribute('onclick') || '').replace(/[^0-9]/g, '') || '0', 10),
            }));
        });
    }

    async function getBadgeCount(page) {
        return page.evaluate(() => {
            const badge = document.querySelector('#suggestions-count');
            if (!badge) return -1;
            // Badge shows "(4)" when count > 0, empty string when 0
            const text = badge.textContent?.trim() || '';
            if (!text) return 0;
            const n = parseInt(text.replace(/[^0-9]/g, ''), 10);
            return isNaN(n) ? 0 : n;
        });
    }

    async function openSuggestionsTab(page) {
        const tab = page.locator('#btab-suggestions');
        if (await tab.count() > 0) {
            await tab.click();
            await page.waitForTimeout(200);
        }
    }

    // ============================= Structural Tests ===========================

    await step('Suggestions tab and badge exist on page load', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            const tabExists  = await page.locator('#btab-suggestions').count();
            const listExists = await page.locator('#suggestions-list').count();
            expect.greater(tabExists, 0, '#btab-suggestions tab present');
            expect.greater(listExists, 0, '#suggestions-list panel present');
        });
    });

    await step('Badge updates when lint issues are found', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            // Inject code with a known issue then wait for debounce
            await setCode(page, 'if (isValid == true) { System.out.println("yes"); }');
            const after = await getBadgeCount(page);
            expect.greater(after, 0, `badge count should be > 0, got ${after}`);
        });
    });

    await step('Clicking a suggestion row jumps the editor to the right line', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, '// line 1\n// line 2\nif (x == true) { }');
            await openSuggestionsTab(page);
            // Wait for items to be in the DOM
            await page.waitForSelector('#suggestions-list .suggestion-item', { timeout: 5000 });
            const items = page.locator('#suggestions-list .suggestion-item');
            const count = await items.count();
            if (count === 0) return;
            // Use evaluate+click instead of Playwright click (panel visibility issues)
            await page.evaluate(() => {
                const btn = document.querySelector('#suggestions-list .suggestion-item');
                if (btn) btn.click();
            });
            await page.waitForTimeout(300);
            const cursorRow = await page.evaluate(() => window.ace_editor.getCursorPosition().row + 1);
            expect.equal(cursorRow, 3, `editor cursor on line ${cursorRow} after clicking suggestion`);
        });
    });

    // =========================== Java / CS173 Rules ==========================

    await step('Java CS173: == true comparison flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (isValid == true) { }');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /true|false|boolean/i.test(i.message));
            expect.truthy(hit, `CS173 boolean comparison rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: == false comparison flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (x == false) return;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /true|false|boolean/i.test(i.message));
            expect.truthy(hit, 'CS173 == false rule fired');
        });
    });

    await step('Java CS173: negative boolean name flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'boolean notValid = false;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /positive|boolean|is.*has.*can/i.test(i.message));
            expect.truthy(hit, `CS173 boolean naming rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: final variable not ALL_CAPS flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'static final int maxSize = 100;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /ALL_CAPS|SCREAMING|final/i.test(i.message));
            expect.truthy(hit, `CS173 final caps rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: final ALL_CAPS is NOT flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'static final int MAX_SIZE = 100;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /ALL_CAPS|SCREAMING/i.test(i.message));
            expect.falsy(hit, 'CS173 final ALL_CAPS should NOT be flagged');
        });
    });

    await step('Java CS173: compound method calls flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'int x = Integer.parseInt(in.getLine().charAt(2));');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /compound|nested/i.test(i.message));
            expect.truthy(hit, `CS173 compound calls rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: missing braces on if body flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (x > 0)\n    doSomething();');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /brac|CS173/i.test(i.message));
            expect.truthy(hit, `CS173 missing braces rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: if body WITH braces is NOT flagged for missing braces', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (x > 0) {\n    doSomething();\n}');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /brac/i.test(i.message) && /CS173/.test(i.message));
            expect.falsy(hit, 'braces present — CS173 missing-brace rule should NOT fire');
        });
    });

    await step('Java CS173: break in loop flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'for (int i = 0; i < 10; i++) {\n    if (i > 5) {\n        break;\n    }\n}');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /break.*loop|loop.*break/i.test(i.message));
            expect.truthy(hit, `CS173 break-in-loop rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: break in switch is NOT flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'switch (x) {\n    case 1:\n        break;\n}');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /break.*loop|CS173.*break/i.test(i.message));
            expect.falsy(hit, 'break in switch should NOT be flagged');
        });
    });

    await step('Java CS173: println before scanner flagged as prompt style', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'System.out.println("Enter something");\nint x = in.nextInt();');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /print\(\)|prompt|same line/i.test(i.message));
            expect.truthy(hit, `CS173 println-prompt rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: long boolean condition flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            const longCond = 'if ((value < 10) || (value > 45) || (response == "t") && ((season == FALL) || (season == SPRING))) {';
            await setCode(page, longCond + '\n}');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /long.*boolean|extract.*named/i.test(i.message));
            expect.truthy(hit, `CS173 long-condition rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: magic number flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'int sampleRate = 44100;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /magic/i.test(i.message));
            expect.truthy(hit, `CS173 magic number rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java CS173: goto flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'goto someLabel;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /goto/i.test(i.message));
            expect.truthy(hit, 'CS173 goto rule fired');
        });
    });

    // =========================== Existing Java Rules ==========================

    await step('Java: String == comparison flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (name == "hello") { }');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /equals|reference/i.test(i.message));
            expect.truthy(hit, `String == rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Java: while(true) flagged', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'while (true) { doSomething(); }');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /while.*true|infinite/i.test(i.message));
            expect.truthy(hit, 'while(true) rule fired');
        });
    });

    // =========================== Python Rules ================================

    await step('Python: == True comparison flagged', async () => {
        await withPage(PY_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if is_valid == True:\n    pass');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /True|False|boolean/i.test(i.message));
            expect.truthy(hit, `Python == True rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Python: function with PascalCase name flagged', async () => {
        await withPage(PY_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'def MyFunction(x):\n    return x');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /lowercase|snake_case|function/i.test(i.message));
            expect.truthy(hit, `Python function naming rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Python: function without docstring flagged', async () => {
        await withPage(PY_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'def compute(x):\n    return x * 2');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /docstring|document/i.test(i.message));
            expect.truthy(hit, `Python docstring rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Python: function WITH docstring is not flagged for missing docstring', async () => {
        await withPage(PY_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'def compute(x):\n    """Compute x times 2."""\n    return x * 2');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /docstring|document/i.test(i.message));
            expect.falsy(hit, 'docstring present — missing-docstring rule should NOT fire');
        });
    });

    await step('Python: bare except flagged', async () => {
        await withPage(PY_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'try:\n    pass\nexcept:\n    pass');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /bare except|KeyboardInterrupt/i.test(i.message));
            expect.truthy(hit, `Python bare except rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    // =========================== C++ Rules ===================================

    await step('C++: gets() function flagged', async () => {
        await withPage(CPP_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, '#include <stdio.h>\nchar buf[100];\ngets(buf);');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /gets|buffer overflow/i.test(i.message));
            expect.truthy(hit, `C++ gets() rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('C++: goto flagged', async () => {
        await withPage(CPP_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'int x = 0;\nstart:\n    x++;\n    goto start;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /goto/i.test(i.message));
            expect.truthy(hit, `C++ goto rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('C++: == true comparison flagged', async () => {
        await withPage(CPP_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (isValid == true) { }');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /true|false|boolean/i.test(i.message));
            expect.truthy(hit, `C++ boolean comparison rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('C++: missing braces flagged', async () => {
        await withPage(CPP_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (x > 0)\n    doSomething();');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /brac|CS173/i.test(i.message));
            expect.truthy(hit, `C++ missing braces rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    // =========================== JavaScript Rules ============================

    await step('JavaScript: var usage flagged', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'var x = 5;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /var|hoisting|let|const/i.test(i.message));
            expect.truthy(hit, `JS var rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('JavaScript: === true comparison flagged', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (isValid === true) { }');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /true|false|boolean/i.test(i.message));
            expect.truthy(hit, `JS === true rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('JavaScript: console.log flagged', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'console.log("debug value");');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /console\.log/i.test(i.message));
            expect.truthy(hit, `JS console.log rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('JavaScript: missing braces flagged', async () => {
        await withPage(JS_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'if (x > 0)\n    doSomething();');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /brac|CS173/i.test(i.message));
            expect.truthy(hit, `JS missing braces rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    // =========================== SQL Rules ===================================

    await step('SQL: SELECT * flagged', async () => {
        await withPage(SQL_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'SELECT * FROM users;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /SELECT \*/i.test(i.message));
            expect.truthy(hit, `SQL SELECT * rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('SQL: DELETE without WHERE flagged', async () => {
        await withPage(SQL_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'DELETE FROM users;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /DELETE|WHERE/i.test(i.message));
            expect.truthy(hit, `SQL DELETE without WHERE rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('SQL: HAVING without GROUP BY flagged', async () => {
        await withPage(SQL_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'SELECT name, COUNT(*) FROM users HAVING COUNT(*) > 1;');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /HAVING|GROUP BY/i.test(i.message));
            expect.truthy(hit, `SQL HAVING without GROUP BY rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    // =========================== Scheme Rules ================================

    await step('Scheme: unbalanced parentheses flagged', async () => {
        await withPage(SCH_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, '(define (square x) (* x x)');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /paren|Unclosed/i.test(i.message));
            expect.truthy(hit, `Scheme unbalanced parens rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    await step('Scheme: balanced parentheses not flagged', async () => {
        await withPage(SCH_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, '(define (square x) (* x x))');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /paren|Unclosed/i.test(i.message));
            expect.falsy(hit, 'balanced Scheme code — no paren error expected');
        });
    });

    await step('Scheme: eq? on string flagged', async () => {
        await withPage(SCH_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, '(if (eq? s "hello") (display "yes"))');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /eq\?|string/i.test(i.message));
            expect.truthy(hit, `Scheme eq? string rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    // =========================== Prolog Rules ================================

    await step('Prolog: cut (!) usage noted', async () => {
        await withPage(PRO_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, 'first(X, [X|_]) :- !.');
            const issues = await getSuggestions(page);
            const hit = issues.find(i => /cut|!/i.test(i.message));
            expect.truthy(hit, `Prolog cut rule fired: ${JSON.stringify(issues.map(i => i.message))}`);
        });
    });

    // =========================== Badge Accuracy ==============================

    await step('Badge count matches actual issues list length', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            // Code with multiple known issues
            const code = [
                'if (isValid == true) { }',
                'boolean notReady = false;',
                'if (x > 0)',
                '    doSomething();',
            ].join('\n');
            await setCode(page, code);
            const badge = await getBadgeCount(page);
            const items = await getSuggestions(page);
            // Badge should be > 0 and match the number of rendered items
            expect.greater(badge, 0, `badge count ${badge} should be > 0`);
            expect.equal(badge, items.length, `badge(${badge}) matches items(${items.length})`);
        });
    });

    await step('Empty/clean code produces zero suggestions', async () => {
        await withPage(JAVA_URL, async (page) => {
            await waitForIDE(page);
            await setCode(page, '// No issues here\n');
            const badge = await getBadgeCount(page);
            expect.equal(badge, 0, 'clean code: badge should be 0');
        });
    });
}
