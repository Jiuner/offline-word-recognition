#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)";PORT=4187
python -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/tmp/word_steps_http.log 2>&1 & PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
ready=0
for i in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:$PORT/index.html" -o /tmp/ws_ready 2>/dev/null; then ready=1; break; fi
  sleep .2
done
if [ "$ready" != "1" ]; then cat /tmp/word_steps_http.log >&2 || true; echo "server failed to become ready" >&2; exit 1; fi
for p in index.html data/words.json audio/words/garden.mp3 images/words/garden_01.webp service-worker.js; do
  code=$(curl -sS -o /tmp/ws_asset -w '%{http_code}' "http://127.0.0.1:$PORT/$p")
  test "$code" = "200"
  test -s /tmp/ws_asset
done
echo HTTP_SMOKE_PASS
