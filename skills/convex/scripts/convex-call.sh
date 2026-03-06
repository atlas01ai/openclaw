#!/bin/bash
# convex-call.sh - Call Atlas Convex HTTP API
# Usage: convex-call.sh METHOD PATH [json_body]
set -euo pipefail
METHOD="${1:-GET}"
PATH_QUERY="${2:-/agent/list}"
BODY="${3:-}"
if [ -z "${CONVEX_HTTP_URL:-}" ]; then
  CONVEX_HTTP_URL=$(atlas-cred show convex/http-url 2>/dev/null || echo "")
fi
if [ -z "${CONVEX_HTTP_URL:-}" ]; then
  echo "ERROR: CONVEX_HTTP_URL not set" >&2
  exit 1
fi
URL="${CONVEX_HTTP_URL}${PATH_QUERY}"
if [ -n "$BODY" ]; then
  curl -s -X "$METHOD" "$URL" -H "Content-Type: application/json" -d "$BODY" | jq .
else
  curl -s -X "$METHOD" "$URL" | jq .
fi
