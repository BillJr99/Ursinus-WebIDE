#!/usr/bin/env bash
# Full test entry point for a fresh checkout.
# Initialises git submodules (Ursinus-Exercises + ggslac) then delegates
# to tests/run.sh which builds Jekyll, starts the server, runs the spec
# suite + exercise harness, and generates the report.
#
# Usage:
#   ./tests/run-full.sh              # complete suite
#   ./tests/run-full.sh inspector    # filter specs/exercises by substring
#   WEBIDE_TEST_SKIP_EXERCISES=1 ./tests/run-full.sh   # feature specs only
#
# The submodule step is skipped automatically if the submodules are already
# present (git submodule update --init --recursive is idempotent).

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "[0/5] Initialising git submodules …"
git submodule update --init --recursive

exec ./tests/run.sh "$@"
