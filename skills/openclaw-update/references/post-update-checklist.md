# Post-Update Checklist

Run after every OpenClaw version update. Do not declare success until all required items pass.

## Required Checks

```bash
# 1. Version
openclaw --version
# → Must match the target version string exactly

# 2. Gateway health
openclaw doctor --non-interactive
# → No errors. Security warnings pre-existed? Note them, don't block.

# 3. Gateway status
openclaw status
# → Gateway running, Discord connected, correct PID

# 4. Subagent spawn (CRITICAL)
# Use sessions_spawn tool with a minimal test task
# → Must return status: "accepted"
# If this fails → see #subagent-spawn-failure below
```

## Advisory Checks

```bash
# Context window status
openclaw status
# → Any session at >90% context? Flag for reset.

# Cron health (check for any jobs in error state)
openclaw cron list
# → Any job with lastStatus: "error"? Investigate.

# Recent logs for errors
journalctl --user -u openclaw-gateway.service --since "10 minutes ago" --no-pager | grep -i error
```

## Subagent Spawn Failure

If `sessions_spawn` returns `"pairing required"` after an update:

1. Check git log between old and new version for auth changes:

   ```bash
   git log OLD_TAG..NEW_TAG --oneline -- \
     src/gateway/server/ws-connection/message-handler.ts \
     src/agents/subagent-spawn.ts
   ```

2. Look for commits containing: "pairing", "device auth", "auth surface", "loopback"

3. If loopback bypass was removed/narrowed → apply custom patch:
   In `src/gateway/server/ws-connection/message-handler.ts`, find `skipPairing` logic and add:

   ```typescript
   || (isLocalClient && sharedAuthOk)
   ```

   This restores pre-hardening behavior: loopback + valid token bypasses device pairing.

4. Rebuild (`pnpm run build`) and restart via safe-restart.sh

5. Retest spawn.

**Precedent:** 2026.2.21 commit `0bda0202f` broke this. Patched same day.

## Document Results

Write to `memory/updates/applied/vVERSION-validation.md`:

- Version confirmed
- Doctor output: clean / warnings (list them)
- Spawn test: pass / fail / fix applied
- Any issues found and resolved
