# Ursinus-WebIDE test suite

Headless-browser smoke, feature, and exercise-verification tests for the
WebIDE. The suite drives a real Chromium via Playwright against a
locally-served Jekyll build and produces a unified Markdown + HTML report
under `tests/reports/`.

## Quick start

### Fresh checkout (first time or after pulling new exercises)

```bash
./tests/run-full.sh
```

This script:
1. Runs `git submodule update --init --recursive` (checks out `Ursinus-Exercises` + `ggslac`)
2. Delegates to `tests/run.sh` for the rest

### Inner loop (submodules already present)

```bash
./tests/run.sh                         # full suite
./tests/run.sh inspector               # filter specs + exercises by substring
WEBIDE_TEST_SKIP_EXERCISES=1 ./tests/run.sh   # feature specs only (faster)
```

`tests/run.sh`:
1. Builds the Jekyll site (`bundle exec jekyll build --baseurl ''`)
2. Starts a static server on port 8765
3. Runs every spec under `tests/specs/` (sorted by filename)
4. Runs the exercise verification harness against every entry in `tests/exercises/solutions.mjs`
5. Detects **coverage drift** — exercises discovered on disk but missing from `solutions.mjs`
6. Stops the server
7. Generates `tests/reports/report.md`, `tests/reports/report.html`, and `tests/reports/results.json`
8. Exits non-zero if any test failed **or** if any exercises are missing from `solutions.mjs`

### Re-run exercise harness only (without rebuilding Jekyll)

```bash
# (Requires the server to already be running on :8765)
cd tests && node exercises/run-all-exercises.mjs
cd tests && node exercises/run-all-exercises.mjs java   # filter by label substring
```

## Coverage drift detection

`tests/exercises/discover.mjs` walks `_pages/Ursinus-Exercises/**/*.md`,
parses each file's YAML front-matter, and cross-references against
`tests/exercises/solutions.mjs`. Any exercise present on disk but **absent**
from `solutions.mjs` produces a `missing-solution` record that:

- Appears in the HTML/Markdown report with a ⚠ indicator
- Causes the runner to exit non-zero (blocking CI)

**When a new exercise is added to the submodule**, add a matching entry to
`tests/exercises/solutions.mjs`. If the exercise is not yet testable (e.g.,
uses an external backend), add a `skip:` entry:

```js
{
    label: 'My New Exercise',
    url: '/Modules/MyLang/NewExercise.html',
    files: {},
    skip: 'needs solution — not yet testable',
},
```

## Layout

```
tests/
  run-full.sh         # entry point for fresh checkouts (runs submodule init first)
  run.sh              # entry point for the inner loop (assumes submodules present)
  lib/
    harness.mjs       # test framework (assert, step, withPage, getBrowser)
    server.mjs        # spawn / kill the static server
    pages.mjs         # canonical map of languages → URLs
  specs/
    00_harness_self_test.mjs
    01_smoke.mjs      # every page loads, all new menu items present
    02_preferences.mjs
    03_explain_error.mjs
    04_inspector.mjs
    05_watchdog.mjs
    06_original_features.mjs
    07_language_runs.mjs
    08_breakpoints.mjs        # gutter dots, F9, persistence, per-file isolation
    09_breakpoints_ui.mjs     # menu items, shortcut overlay, CSS, per-lang smoke
    10_trace_on_hit.mjs       # source-instrumenter + __webide_bp helper
    11_tests_panel.mjs        # student-runnable tests bottom-tab + Alt+T
    12_learning_aids.mjs      # profiler, visualizer, hints, show-me-where
    13_recovery_offline.mjs   # run history, submission preflight, service worker
    14_linter_suggestions.mjs
    15_horstmann.mjs          # exercise_horstmann.html layout (Parsons puzzles)
    16_r_layout.mjs           # exercise_r.html layout (R terminal exercises)
  exercises/
    solutions.mjs       # canonical map of exercise URL → worked solution code
    run-exercise.mjs    # drives one exercise end-to-end via Playwright
    run-all-exercises.mjs  # exported runAllExercises() + standalone entry point
    discover.mjs        # walks _pages/Ursinus-Exercises/ and detects coverage gaps
    REPORT.md           # last standalone exercise report (checked in for reference)
  report.mjs          # produces report.md + report.html + results.json
  reports/            # generated output (gitignored)
```

## Coverage notes

### Feature specs — `_layouts/exercise.html`

| Feature                     | Java | C++ | Brython | Pyodide | JS  | SQL | Scheme | Prolog | Graphics |
|-----------------------------|:----:|:---:|:-------:|:-------:|:---:|:---:|:------:|:------:|:--------:|
| Theme / font / dyslexia     |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Color-blind mode (new)      |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Shortcut overlay (`?`)      |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Responsive / compact        |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Explain-this-error          |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Infinite-loop banner        |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Show-me-where button (new)  |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Variable inspector          |  ·   |  ·  |   ✓     |   ✓     |  ✓  |  ·  |   ·    |   ·    |    ·     |
| Step-through visualizer     |  ·   |  ·  |   ~     |   ✓     |  ·  |  ·  |   ·    |   ·    |    ·     |
| Call-stack tape             |  ·   |  ·  |   ~     |   ✓     |  ✓* |  ·  |   ·    |   ·    |    ·     |
| Profile sub-tab (new)       |  ·   |  ·  |   ·     |   ✓     |  ✓* |  ·  |   ·    |   ·    |    ·     |
| Visualize sub-tab (new)     |  ·   |  ·  |   ✓     |   ✓     |  ✓  |  ·  |   ·    |   ·    |    ·     |
| **Gutter breakpoints** (new)|  s   |  c  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   s    |    ✓     |
| **Tests panel** (new)       |  ·   |  ·  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ·    |    ✓     |
| Hint ladder (new)           |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Run history (new)           |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Submission preflight (new)  |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Offline service worker (new)|  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |

- ✓ = supported   · = not available, graceful empty-state shown
- ~ = best-effort (Brython `sys.settrace` doesn't fire on `exec()`'d code)
- ✓\* = requires `webideTrace.call` / `webideTrace.return` wrapper
- **s** = synthetic breakpoint hits at run-start (Java/Prolog)
- **c** = compile-time injection of `printf("__BP %d\n", line)` (C++)

### Exercise harness — `_pages/Ursinus-Exercises/`

Driven by `tests/exercises/run-all-exercises.mjs` which writes a worked
solution into the editor via `window.openFiles` + `ace_editor`, clicks Run,
and verifies the autograder reports correct.

| Category | Status |
|---|---|
| JavaScript | ✓ |
| Java drills | ✓ |
| Java modules | ✓ |
| C++ | ✓ |
| Python (Brython) | ✓ |
| SQL | ✓ |
| Scheme | ✓ |
| Prolog | ✓ |
| Horstmann (Parsons puzzles) | page-load smoke only (external CDN UI) |
| R terminal exercises | page-load smoke only (VPN backend required) |
| Problets / assignment layout | not testable in-browser (external links) |

### Layout specs — `tests/specs/15_horstmann.mjs` / `tests/specs/16_r_layout.mjs`

These specs verify that pages using `exercise_horstmann.html` and
`exercise_r.html` layouts **load without crashing** and render their
expected UI containers. Full interaction tests are out of scope:

- Horstmann: drag-and-drop driven by `horstmann.com/codecheck` CDN scripts —
  no programmatic API to inject a Parsons solution.
- R: code execution requires the VPN-only backend at `mathcs.ursinus.edu`.

Both specs gracefully skip when the `Ursinus-Exercises` submodule is not
checked out.

## Per-language feature support notes

- **C++** runs as `clang.wasm` in a Worker; stepping would need wasm-level DWARF.
- **SQL** is declarative; "steps" don't apply.
- **Scheme** (BiwaScheme) and **Prolog** (SWIPL) could be tackled if they expose hooks.
- **Java** (Processing.js) transpiles to JS at load time; post-transpile instrumentation is out of scope.
