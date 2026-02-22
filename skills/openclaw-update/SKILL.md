---
name: openclaw-update
description: Update OpenClaw to a new release on a custom fork. Use when applying a new OpenClaw version, performing a release check, or recovering from a failed update. Covers: release analysis, custom commit rebase, build, safe restart, and post-update validation. NOT for general OpenClaw config changes or individual agent updates — only for upgrading the gateway binary/npm package itself.
---

# OpenClaw Update (Custom Fork)

This installation runs a custom fork with local commits on top of upstream releases. Updates require rebasing custom commits, not just pulling main.

## Pre-Flight

```bash
openclaw --version                          # current version
openclaw doctor --non-interactive           # system health before touching anything
```

Fetch latest release from: https://github.com/openclaw/openclaw/releases/latest

If new version found → analyze changelog (see `references/changelog-analysis.md`).

## Backup

```bash
cd ~/.openclaw && git add -A && git commit -m "Pre-update snapshot: before OpenClaw vVERSION" || true
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d-%H%M%S)
```

## Update (Custom Fork Rebase)

```bash
cd ~/openclaw-dev

# 1. Create backup branch
git branch backup-$(date +%Y%m%d-%H%M%S)

# 2. Export patches of custom commits (find base tag from branch name or git log)
PREV_BASE=v2026.X.Y   # the tag the current branch diverges from
git format-patch ${PREV_BASE}..HEAD --stdout > ~/.openclaw/workspace-openclaw-updates/memory/custom-features-$(date +%Y%m%d).patch

# 3. Fetch upstream tags
git fetch origin

# 4. Rebase custom commits onto new tag
git rebase --onto vNEW_VERSION ${PREV_BASE} HEAD

# 5. Update branch pointer
git branch -f feature/openclaw-custom-${NEW_VERSION} HEAD
git checkout feature/openclaw-custom-${NEW_VERSION}
```

**If conflicts:** resolve manually, `git rebase --continue`. The 6 custom commits are:

- Browser leak fix (rarely conflicts)
- Auto-retrieval memory patches (touches agent bootstrap — watch for conflicts here)

## Build & Restart

```bash
pnpm install
pnpm run build

# CRITICAL: use safe-restart.sh, NOT openclaw gateway restart
~/.openclaw/scripts/safe-restart.sh "Updated to vVERSION"
```

## Post-Update Validation (Required — do not skip)

**Full checklist:** see `references/post-update-checklist.md`

**Minimum required:**

```bash
openclaw --version    # confirm new version string
openclaw status       # gateway running, channels connected
```

Then explicitly test subagent spawn — security hardening between versions can silently break this:

```
sessions_spawn test → expect status: "accepted"
```

If spawn fails → see `references/post-update-checklist.md#subagent-spawn-failure`.

## Config Changes During Updates

**Before touching openclaw.json, validate schema:**

- `src/config/types.agent-defaults.ts` — allowed in defaults
- `src/config/types.agents.ts` — allowed per-agent
- Per-agent only (NOT in defaults): `subagents.allowAgents`, `tools`, `sandbox`, `skills`, `heartbeat`

Test immediately: `openclaw doctor`. Gateway won't start on invalid schema.

## Known Issues

| Issue                                         | Version       | Fix                                                                                             |
| --------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------- |
| sessions_spawn "pairing required"             | 2026.2.21     | Regression from commit 0bda0202f. Custom patch in message-handler.ts restoring loopback bypass. |
| Healthcheck restart loop on update            | Pre-2026.2.22 | Fixed: removed `Requires=` from openclaw-healthcheck.service unit.                              |
| Config corruption on direct `gateway restart` | Ongoing       | Always use `safe-restart.sh`, never raw `openclaw gateway restart`.                             |
