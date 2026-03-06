#!/bin/bash
# agent-heartbeat.sh - Update this agent status in Convex
# Usage: agent-heartbeat.sh <agent-name> <model> [status] [current-task] [channel]
set -euo pipefail
AGENT="${1:-research}"
MODEL="${2:-anthropic/claude-sonnet-4-6}"
STATUS="${3:-active}"
TASK="${4:-}"
CHANNEL="${5:-}"
SCRIPT_DIR="$(dirname "$0")"
BODY="{\"name\":\"$AGENT\",\"model\":\"$MODEL\",\"status\":\"$STATUS\",\"currentTask\":\"$TASK\",\"currentChannel\":\"$CHANNEL\"}"
"$SCRIPT_DIR/convex-call.sh" POST /agent/heartbeat "$BODY"
