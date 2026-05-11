#!/usr/bin/env bash
# Entry point for the Ursinus-WebIDE test suite.
# Builds the Jekyll site, starts a static server, runs every spec under
# tests/specs/ and writes a Markdown + HTML report to tests/reports/.
#
# Optional arg: substring filter for spec filenames, e.g.
#   ./tests/run.sh inspector

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TESTS_DIR="$REPO_ROOT/tests"
SITE_DIR="$REPO_ROOT/_site"
SPEC_FILTER="${1:-}"
: "${WEBIDE_TEST_PORT:=8765}"

cd "$REPO_ROOT"

echo "[1/5] Building Jekyll site (baseurl='') …"
PAGES_REPO_NWO="${PAGES_REPO_NWO:-BillJr99/Ursinus-WebIDE}" \
bundle exec jekyll build --baseurl '' >/tmp/jekyll-build.log 2>&1 || {
    echo "  jekyll build FAILED — see /tmp/jekyll-build.log"
    tail -20 /tmp/jekyll-build.log
    exit 2
}

echo "[2/5] Starting static server on :${WEBIDE_TEST_PORT} …"
# Kill any leftover server on that port from a prior run
pkill -f "http\.server ${WEBIDE_TEST_PORT}" 2>/dev/null || true
sleep 0.4
( cd "$SITE_DIR" && nohup python3 -m http.server "$WEBIDE_TEST_PORT" >/tmp/http-server.log 2>&1 & echo $! > /tmp/http-server.pid )
disown $(cat /tmp/http-server.pid 2>/dev/null) 2>/dev/null || true

# Wait for it to be ready
for i in 1 2 3 4 5 6 7 8 9 10; do
    if curl -sI "http://localhost:${WEBIDE_TEST_PORT}/" > /dev/null 2>&1; then
        break
    fi
    sleep 0.2
done

cleanup() {
    if [ -f /tmp/http-server.pid ]; then
        PID=$(cat /tmp/http-server.pid)
        kill "$PID" 2>/dev/null || true
        rm -f /tmp/http-server.pid
    fi
    pkill -f "http\.server ${WEBIDE_TEST_PORT}" 2>/dev/null || true
}
trap cleanup EXIT

# Ensure tests/ is treated as ESM
if [ ! -f "$TESTS_DIR/package.json" ]; then
    echo '{"name":"ursinus-webide-tests","type":"module","private":true,"dependencies":{"playwright":"^1.56.0"}}' > "$TESTS_DIR/package.json"
fi

echo "[3/5] Resolving Playwright …"
# Three supported layouts:
#   a) tests/node_modules/playwright already present (CI: `npm ci` in tests/)
#   b) WEBIDE_TEST_PW_NODE_MODULES points at a global node_modules dir
#      containing playwright + playwright-core (sandbox: /opt/node22/lib/node_modules)
#   c) Neither — run `npm install` locally in tests/
if [ -d "$TESTS_DIR/node_modules/playwright" ]; then
    echo "  using existing tests/node_modules/playwright"
elif [ -n "$WEBIDE_TEST_PW_NODE_MODULES" ] && [ -d "$WEBIDE_TEST_PW_NODE_MODULES/playwright" ]; then
    echo "  linking from $WEBIDE_TEST_PW_NODE_MODULES"
    mkdir -p "$TESTS_DIR/node_modules"
    ln -sfn "$WEBIDE_TEST_PW_NODE_MODULES/playwright"      "$TESTS_DIR/node_modules/playwright"
    [ -d "$WEBIDE_TEST_PW_NODE_MODULES/playwright-core" ] \
        && ln -sfn "$WEBIDE_TEST_PW_NODE_MODULES/playwright-core" "$TESTS_DIR/node_modules/playwright-core"
elif [ -d "/opt/node22/lib/node_modules/playwright" ]; then
    echo "  linking from /opt/node22/lib/node_modules (sandbox)"
    mkdir -p "$TESTS_DIR/node_modules"
    ln -sfn /opt/node22/lib/node_modules/playwright       "$TESTS_DIR/node_modules/playwright"
    PW_CORE_PATH="/opt/node22/lib/node_modules/playwright-core"
    [ -d "$PW_CORE_PATH" ] || PW_CORE_PATH="/opt/node22/lib/node_modules/playwright/node_modules/playwright-core"
    ln -sfn "$PW_CORE_PATH" "$TESTS_DIR/node_modules/playwright-core"
else
    echo "  no Playwright found — running 'npm install' in tests/"
    ( cd "$TESTS_DIR" && npm install --no-audit --no-fund --silent )
fi

echo "[4/5] Running spec files (filter: ${SPEC_FILTER:-<all>}) …"
# WEBIDE_TEST_CHROMIUM and PLAYWRIGHT_BROWSERS_PATH are both optional —
# the harness will fall back to Playwright's standard browser lookup
# (`npx playwright install chromium` writes to ~/.cache/ms-playwright).
# set -e is on globally; if the runner exits non-zero the rest of this script
# (the report-path summary) would be skipped without || RC=$?. We want the
# summary printed regardless, then exit with the runner's actual exit code.
RC=0
WEBIDE_TEST_BASE="http://localhost:${WEBIDE_TEST_PORT}" \
node "$TESTS_DIR/runner.mjs" "$SPEC_FILTER" || RC=$?

echo
echo "[5/5] Report:"
echo "  Markdown:  $TESTS_DIR/reports/report.md"
echo "  HTML:      $TESTS_DIR/reports/report.html"
echo "  Raw JSON:  $TESTS_DIR/reports/results.json"

exit $RC
