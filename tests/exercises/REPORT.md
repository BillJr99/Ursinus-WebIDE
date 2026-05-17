# Exercise verification report

Driver: a Playwright harness (`run-all-exercises.mjs`) that loads each
exercise in `_pages/Ursinus-Exercises/`, writes a worked solution into
the editable file(s) via `window.openFiles` + `ace_editor`, clicks Run,
waits for the autograder to settle, and reports pass/fail.

**Result: 45 / 48 verifiable exercises pass (94%).**

| Category | Count | Status |
|---|---:|---|
| Passing | 45 | ✓ |
| Broken exercise definitions (not solution bugs) | 3 | ✗ |
| Skipped (separate layouts / no autograder) | 6 | ⊘ |
| **Total** | **54** | |

## Passing (45)

JavaScript (1): MinIndex

Java drills (8): Array3Sort, ArrayInsert, ArrayMinIndex, ArrayReverse,
ArraySep, ArrayZeroes, StringVowels, *ArrayMean — see below*

Java modules (15): IDE Hello, Expressions, Expressions2, Boolean,
Conditionals, Iteration, Iteration2, Strings, Strings2 PigLatin,
Functions, Arrays ClosestValue, ArrayLists Primes, Recursion
ReverseString, EpochTime, InsertionSort swap, MergeSort merge,
DynamicProgramming Fib, FourInARow, TicTacToe

C++ (9): Intro DivisibleBy6, PointerSwap, Inheritance, Polymorphism,
BinarySearch, TreeInorder, LinkedList addFirst, Merge, STL list reverse

Python (3): Quadratic, ThreeXPlusOne, Slice

SQL (3): Warmup, Join, Aggregation

Scheme (1): square

Prolog (2): Warmup, Warmup2

## Failing — broken exercise definitions, not solution bugs (3)

These three exercises have bugs in their `_pages/Ursinus-Exercises/*.md`
front-matter that prevent ANY solution from passing the auto-grader,
including the canonical worked solution. They need fixes in the
**`Ursinus-Exercises` submodule**, not in `Ursinus-WebIDE`.

### 1. `Java/exercise-drill-arraymean.md`

**Bug:** Missing the `ismain: true` "Excerpt from Main.java" file that
all the other drill exercises have. Without it, `mainText` is empty
when `runCode` runs, so `Tester.main(null);` is never invoked and the
Java program produces no output — the autograder always sees an empty
`feedbackString` and falls through to "Try again".

**Fix:** Add this at the bottom of the `files:` block, mirroring
`exercise-drill-arrayminindex.md` and friends:

```yaml
  - filename: "Excerpt from Main.java: body of main() function"
    ismain: true
    name: main
    isreadonly: true
    isvisible: false
    code: |
        Tester.main(null);
```

### 2. `Pyodide/exercise-pyodide-audio-squarewave.md`

**Bug:** `correctcheck: audioStr == audioRef` references an `audioRef`
variable that is never defined in `feedbackprocess` or anywhere else
on the page. The comparison is `undefined == undefined`, which is
truthy at first glance, but only when `audioStr` is also undefined —
in any successful run `audioStr` is set, so the check is always false.

**Fix:** Define `audioRef` in `feedbackprocess:` with the expected
reference audio data (probably the base64 of the correct waveform),
or change the check to a structural one (e.g. `audioStr.length > 0 &&
trials.length === 1000`).

### 3. `Pyodide/exercise-pyodide-plot-tenheads.md`

**Bug:** Same shape — `correctcheck: pyodide.globals.get("img_str") ==
imageRef` references an `imageRef` that is never defined.

**Fix:** Same as above — define `imageRef` in `feedbackprocess:` or
change the check to verify the structure of the histogram (e.g. that
`trials` has the right length and `img_str` is a non-empty data URL).

## Skipped — out of scope for this harness (6)

| Exercise | Reason |
|---|---|
| Java Problets | Uses `layout: assignment` — external Problets/Epplets links, no in-browser autograder |
| Horstmann Swap | Uses `layout: exercise_horstmann` — Parsons puzzle UI, not driven by `ace_editor` |
| R Tutorial | Uses `layout: exercise_r` — separate layout the new debugger work doesn't touch |
| R Quadratic | Same |
| Graphics ViewOrthographic | Visual output only — no `correctcheck` defined |
| Graphics Lambertian Shader | Visual output only — no `correctcheck` defined |

## How to re-run

```sh
cd Ursinus-WebIDE
# 1) Build + serve
PATH=/opt/rbenv/versions/3.3.6/bin:$PATH PAGES_REPO_NWO=BillJr99/Ursinus-WebIDE \
  bundle exec jekyll build --baseurl ''
(cd _site && python3 -m http.server 8765) &
# 2) Run the harness
cd tests && node exercises/run-all-exercises.mjs
# Filter to one language: node exercises/run-all-exercises.mjs java
```

Solutions live in `tests/exercises/solutions.mjs`; each entry maps an
exercise URL to the `{ filename: solutionCode }` object the harness
should write before clicking Run.

## Infrastructure improvements made along the way

While building the harness I had to expose several `let`/`var`-scoped
variables on `window` so Playwright could inspect/drive them
(`openFiles`, `setActiveTab`, `saveActiveTabs`, `numAttempts`,
`correctlyAnswered`, `feedbackString`, `checkAnswer`). These are
backwards-compatible mirrors via `Object.defineProperty`.

The C++ stdio patch (`_layouts/exercise.html` ~line 5076) had three
bugs that broke `#include <string>` and `#include <cstring>` for the
5 C++ exercises that use them:

1. `NULL` was defined as `(void*)0` — illegal in C++ when assigning
   to typed pointers (`LinkedNode* head = NULL`). Fixed with a
   `__cplusplus`-guarded `#define NULL 0`.
2. `size_t` was typedef'd as `unsigned long` — but on wasm32 it's
   `unsigned int`, which conflicted with musl's definition. Fixed
   with `typedef __SIZE_TYPE__ size_t;` (compiler builtin, always
   correct).
3. The patch was missing declarations for `tmpnam`, `freopen`,
   `vprintf`, `putc`, `fpos_t`, etc. that libcxx's `<cstdio>`
   imports into the global namespace. Added all of them.

Before the fix: 4/9 C++ exercises passing. After: 9/9.
