#!/usr/bin/env bash
# Usage: validate.sh [OPENCLAW_DIR]
#
# Verifies each custom patch's key behavior is present in the source tree.
# Uses grep -r (not specific file paths) to survive upstream file renames.
#
# Returns non-zero if any check fails — upgrade.sh will not proceed.
set -euo pipefail

OPENCLAW_DIR="${1:-$HOME/openclaw-dev}"
PASS=0
FAIL=0

check() {
  local name="$1"
  local pattern="$2"
  if grep -rq "$pattern" "$OPENCLAW_DIR/src/" 2>/dev/null; then
    echo "  ✅ $name"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $name"
    echo "     Pattern not found: $pattern"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Patch validation ($(date '+%Y-%m-%d %H:%M:%S')) ==="
echo "OpenClaw src: $OPENCLAW_DIR/src/"
echo ""

# 0001 — loopback bypass (gateway auth regression fix)
check "loopback bypass" \
  "isLocalClient && sharedAuthOk"

# 0002–0006 — auto-retrieval layer (4 commits + 1 config)
check "auto-retrieval module exists" \
  "AutoRetrievalConfig"

check "auto-retrieval: explicit enablement required" \
  "Must be explicitly enabled"

check "auto-retrieval: zod schema registered" \
  "autoRetrieval"

check "auto-retrieval: agents list integration" \
  "getAgentsList"

# 0007 — browser renderer leak fix
check "browser context cleanup" \
  "closeEmptyContexts"

echo ""
echo "Results: $PASS passed, $FAIL failed"

if [[ $FAIL -gt 0 ]]; then
  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║  ❌ VALIDATION FAILED — do not restart the gateway           ║"
  echo "║                                                              ║"
  echo "║  One or more patches did not apply correctly.                ║"
  echo "║  Diagnose, then either:                                      ║"
  echo "║    git am --continue  (after resolving conflict)             ║"
  echo "║    git am --abort     (to abandon and start over)            ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  exit 1
fi

echo ""
echo "✅ VALIDATION PASSED — all patches present"
