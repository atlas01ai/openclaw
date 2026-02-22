---
name: discord
description: "Discord operations knowledge graph. Entry point for all Discord tasks."
version: 2.0
type: skill-graph
entry: true
nodes:
  sending: "Core message actions — send, edit, delete, react, reply, pin, poll"
  components: "Rich UI via Discord Components v2 — buttons, selects, modals, galleries"
  channels: "Channel and category management — create, edit, move, delete"
  threads: "Thread lifecycle — create, reply, list, archive"
  discovery: "Read, search, reactions, pins, member-info, roles"
  formatting: "Discord markdown, mentions, link suppression, platform rules"
---

# Discord Skill Graph

Use the `message` tool. Always pass `channel: "discord"`.

## How to Navigate

Each node below covers one domain. Read **only what the current task needs** — don't load the whole graph.

| Node           | When to read                                               |
| -------------- | ---------------------------------------------------------- |
| [[sending]]    | Sending messages, reactions, polls, edits, deletes         |
| [[components]] | Rich UI: buttons, selects, modals, image galleries         |
| [[channels]]   | Creating/editing/deleting channels or categories           |
| [[threads]]    | Thread creation, replies, listing                          |
| [[discovery]]  | Reading messages, search, member info, roles, pins         |
| [[formatting]] | How to format text for Discord — markdown, mentions, links |

## Universal Rules

- **Always** `channel: "discord"` on every call
- **Prefer explicit ids** — `channelId`, `messageId`, `userId`, `guildId` over names
- **No markdown tables** in outbound messages (Discord renders them poorly) → see [[formatting]]
- **Components v2 over embeds** for rich UI → see [[components]]
- **Check gating** before using: `roles`, `moderation`, `presence`, `channels` default off

## Sending a Basic Message (Quick Reference)

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:<id>",
  "message": "text",
  "silent": true
}
```

For anything beyond basic text → navigate to the relevant node above.
