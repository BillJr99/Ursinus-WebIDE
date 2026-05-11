# Ursinus-WebIDE test suite

Headless-browser smoke and feature tests for the WebIDE layout in
`_layouts/exercise.html`. The suite drives a real Chromium via Playwright
against a locally-served Jekyll build and produces a Markdown + HTML report
under `tests/reports/`.

## Running

```bash
./tests/run.sh
```

The script:

1. Builds the Jekyll site (`bundle exec jekyll build --baseurl ''`)
2. Starts a static server on port 8765
3. Runs every spec under `tests/specs/` (sorted by filename)
4. Stops the server
5. Generates `tests/reports/report.md` and `tests/reports/report.html`
   with screenshots
6. Exits non-zero if any test failed

## Layout

```
tests/
  run.sh              # entry point
  lib/
    harness.mjs       # test framework (assert, step, withPage)
    server.mjs        # spawn / kill the static server
    pages.mjs         # canonical map of languages → URLs
  specs/
    01_smoke.mjs      # every page loads, all new menu items present
    02_preferences.mjs
    03_explain_error.mjs
    04_inspector.mjs
    05_watchdog.mjs
    06_original_features.mjs
    07_language_runs.mjs
  report.mjs          # produces report.md + report.html
  reports/            # generated output (gitignored)
```

## Coverage notes

- **Languages on `_layouts/exercise.html`** (covered): Java, C++, Python (Brython),
  Pyodide, JavaScript, SQL, Scheme, Prolog, Graphics-View, Graphics-Shader.
- **Languages on separate layouts** (NOT covered by these tests, since the new
  features live only in `exercise.html`): R (uses `exercise_r.html`),
  Horstmann (uses `exercise_horstmann.html`).

## Per-language feature support matrix

| Feature                     | Java | C++ | Brython | Pyodide | JS  | SQL | Scheme | Prolog | Graphics |
|-----------------------------|:----:|:---:|:-------:|:-------:|:---:|:---:|:------:|:------:|:--------:|
| Theme / font / dyslexia     |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Shortcut overlay (`?`)      |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Responsive / compact        |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Explain-this-error          |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Infinite-loop banner        |  ✓   |  ✓  |   ✓     |   ✓     |  ✓  |  ✓  |   ✓    |   ✓    |    ✓     |
| Variable inspector          |  ·   |  ·  |   ✓     |   ✓     |  ✓  |  ·  |   ·    |   ·    |    ·     |
| Step-through visualizer     |  ·   |  ·  |   ~     |   ✓     |  ·  |  ·  |   ·    |   ·    |    ·     |
| Call-stack tape             |  ·   |  ·  |   ~     |   ✓     |  ✓* |  ·  |   ·    |   ·    |    ·     |

- ✓ = supported   · = not available, graceful empty-state shown
- ~ = best-effort: Brython's `sys.settrace` doesn't fire on `exec()`'d code,
  so the Steps view will be empty and the empty-state hint shows. Use a
  Pyodide variant of the exercise for a real step-through experience.
- ✓\* (JS call-tape) requires the student to wrap recursive calls in the
  `webideTrace.call(name, ...args)` / `webideTrace.return(value)` helper.
  Automatic instrumentation would need an AST parser (e.g. acorn) and isn't
  implemented today.

### Why some languages aren't deeper

- **C++** runs as `clang.wasm` in a Worker; stepping would need wasm-level
  DWARF / source-map plumbing — out of scope.
- **SQL** is declarative; "steps" don't apply.
- **Scheme** (BiwaScheme) and **Prolog** (SWIPL) could be tackled if they
  expose hooks — not investigated; PRs welcome.
- **Java** (Processing.js) transpiles to JS at load time; the transpiled
  code would have to be instrumented after Processing.js produces it.
