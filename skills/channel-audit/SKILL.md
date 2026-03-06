---
name: channel-audit
description: Audit all Discord channels to determine which can be closed, which are active, and which are stalled or abandoned. Use when Richard asks to review open channels, clean up the Discord server, or get a status summary of what's happening across channels. Produces a high-level summary per channel with a concrete proposed action (Close / Archive / Keep / Needs decision). Do NOT audit persistent infrastructure channels — see references/persistent-channels.md for the exclusion list.
---

# Channel Audit

Audits all auditable Discord channels and produces a per-channel status report with a concrete proposed action.

## Persistent Channels (Exclusion List)

Read `references/persistent-channels.md` for the full list of channel IDs to skip. Never audit these.

## Workflow

### Step 1 — Get channel list

```
message(action="channel-list", channel="discord", guildId="1467779293747744811")
```

Filter out all channel IDs in the persistent-channels list and voice/category channels (type != 0).

### Step 2 — Per-channel data gathering

For each auditable channel, collect in parallel:

**a. Last activity date**
Use `last_message_id` from the channel list. Convert the snowflake to a timestamp:

```
timestamp_ms = (snowflake >> 22) + 1420070400000
```

Or read the last 1-2 messages: `message(action="read", channel="discord", target="CHANNEL_ID", limit=2)`

**b. Purpose**
Use the channel `topic` field. If empty, read first few messages to infer purpose.

**c. Open vault tasks referencing this channel**

```bash
grep -r "CHANNEL_ID" ~/.openclaw/workspace/vault/tasks/ 2>/dev/null
grep -r "CHANNEL_ID" ~/.openclaw/shared-identity/vault/ 2>/dev/null
```

**d. Active cron jobs targeting this channel**

```
cron(action="list")
```

Scan results for channel ID in delivery target or payload text.

**e. Active sessions**

```
sessions_list()
```

Check if any session key contains or targets this channel.

### Step 3 — Classify each channel

| Classification | Criteria                                               |
| -------------- | ------------------------------------------------------ |
| **Active**     | Last activity < 7 days OR open vault tasks exist       |
| **Stalled**    | Last activity 7–30 days, open tasks or unclear purpose |
| **Complete**   | Purpose clearly achieved, no open tasks, no crons      |
| **Abandoned**  | Last activity > 30 days, no open tasks, no crons       |

### Step 4 — Propose action per channel

| Classification | Default proposed action                        |
| -------------- | ---------------------------------------------- |
| Active         | **Keep** — still in use                        |
| Stalled        | **Needs decision** — summarize what's blocking |
| Complete       | **Close** — purpose achieved, nothing pending  |
| Abandoned      | **Close** — no activity or pending work        |

Override the default when context warrants (e.g., a stalled channel with clear next steps → propose those steps).

### Step 5 — Output format

Produce a Discord-friendly summary (no markdown tables — use bullet lists):

```
## 📋 Channel Audit — [DATE]

**[#channel-name]**
- Purpose: [one line from topic]
- Last activity: [X days ago / date]
- Open tasks: [N tasks / none]
- Active crons: [yes/no]
- Status: [Active / Stalled / Complete / Abandoned]
- → **Proposed action: [Close / Keep / Needs decision — why]**

---
[repeat for each channel]

## Summary
- Close: [N channels]
- Keep: [N channels]
- Needs decision: [N channels]
```

## Notes

- If a channel has a pinned message or pinned design doc, note it — may indicate active work even with low recent message activity.
- If a cron delivers to a channel, treat as Active regardless of message age.
- When proposing "Close", confirm the channel has no pinned content worth archiving first.
- Run this skill periodically (monthly) to keep the channel list clean.
