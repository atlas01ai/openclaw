#!/bin/bash
# vault-query.sh - Query vault tasks, lessons, or decisions from Convex
# Usage: vault-query.sh tasks [status] [project]
#        vault-query.sh lessons [severity]
#        vault-query.sh decisions
set -euo pipefail
TYPE="${1:-tasks}"
SCRIPT_DIR="$(dirname "$0")"
case "$TYPE" in
  tasks)
    STATUS="${2:-}"
    PROJECT="${3:-}"
    QUERY="/vault/tasks?"
    [ -n "$STATUS" ] && QUERY="${QUERY}status=$STATUS&"
    [ -n "$PROJECT" ] && QUERY="${QUERY}project=$PROJECT&"
    "$SCRIPT_DIR/convex-call.sh" GET "$QUERY"
    ;;
  lessons)
    SEVERITY="${2:-}"
    if [ -n "$SEVERITY" ]; then
      "$SCRIPT_DIR/convex-call.sh" GET "/vault/lessons?severity=$SEVERITY"
    else
      "$SCRIPT_DIR/convex-call.sh" GET /vault/lessons
    fi
    ;;
  decisions)
    "$SCRIPT_DIR/convex-call.sh" GET /vault/decisions
    ;;
  *)
    echo "Usage: vault-query.sh [tasks|lessons|decisions] [filters...]" >&2
    exit 1
    ;;
esac
