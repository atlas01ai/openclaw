#!/bin/bash
# context-sync.sh - Read all shared context entries from Convex
# Usage: context-sync.sh [tag]
# Outputs JSON array of context entries
set -euo pipefail
TAG="${1:-}"
SCRIPT_DIR="$(dirname "$0")"
if [ -n "$TAG" ]; then
  "$SCRIPT_DIR/convex-call.sh" GET "/context/list?tag=$TAG"
else
  "$SCRIPT_DIR/convex-call.sh" GET /context/list
fi
