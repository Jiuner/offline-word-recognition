#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${2:-4173}"
PAGE="${1:-tests/idb-harness.html}"
LOG=$(mktemp)
python -m http.server "$PORT" --directory "$ROOT" >"$LOG" 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true; rm -f "$LOG"' EXIT
sleep .5
OUT=$(chromium --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --virtual-time-budget=3000 --dump-dom "http://127.0.0.1:$PORT/$PAGE" 2>/dev/null)
echo "$OUT" | grep -q 'data-test-status="pass"'
