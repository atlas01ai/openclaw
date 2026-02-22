---
description: "Reading messages, searching, reactions, pins, member info, roles. Read when you need to observe or query Discord state."
links: [threads, channels]
---

# Discovery — Reading and Querying Discord

← [[index]]

## Read Messages

```json
{
  "action": "read",
  "channel": "discord",
  "to": "channel:<id>",
  "limit": 20
}
```

- `limit` — number of messages (default: 20, max: 100)
- `before` / `after` / `around` — message ids for pagination
- Works on any channel id including [[threads]] (use the thread's own id)

## Search

Full-text search across a guild:

```json
{
  "action": "search",
  "channel": "discord",
  "guildId": "<id>",
  "query": "release notes",
  "channelIds": ["<id1>", "<id2>"],
  "authorId": "<id>",
  "limit": 10
}
```

- `channelIds` — restrict to specific channels (optional)
- `authorId` / `authorIds` — filter by sender
- `before` / `after` — date-based filtering
- `fromMe: true` — only my own messages

## Reactions

**Get all reactions on a message:**

```json
{
  "action": "reactions",
  "channel": "discord",
  "channelId": "<id>",
  "messageId": "<id>",
  "emoji": "✅"
}
```

Returns list of users who reacted with that emoji.

**Add/remove reactions** → [[sending]].

## Pins

**List pinned messages:**

```json
{
  "action": "list-pins",
  "channel": "discord",
  "channelId": "<id>"
}
```

Returns up to 50 pinned messages (Discord limit).

**Pin/unpin** → [[sending]].

## Member Info

Get a guild member's details (roles, nickname, join date):

```json
{
  "action": "member-info",
  "channel": "discord",
  "guildId": "<id>",
  "userId": "<id>"
}
```

Useful for: checking what roles a user has before deciding what to show them, personalizing responses.

## Role Info

Get a role's details (name, color, permissions, member count):

```json
{
  "action": "role-info",
  "channel": "discord",
  "guildId": "<id>",
  "roleId": "<id>"
}
```

⚠️ Role operations may be gated (`channels.discord.actions.roles`).

## Emoji List

List all custom emojis in the guild:

```json
{
  "action": "emoji-list",
  "channel": "discord",
  "guildId": "<id>"
}
```

Returns emoji names and ids — use for reactions with custom server emoji.

## Events

**List scheduled events:**

```json
{
  "action": "event-list",
  "channel": "discord",
  "guildId": "<id>"
}
```

**Create event:**

```json
{
  "action": "event-create",
  "channel": "discord",
  "guildId": "<id>",
  "eventName": "Weekly sync",
  "eventType": "voice",
  "startTime": "2026-03-01T18:00:00Z",
  "endTime": "2026-03-01T19:00:00Z",
  "channelId": "<voice-channel-id>",
  "desc": "Optional description"
}
```

---

For navigating channel structure → [[channels]].
For reading thread contents → use this `read` action with the thread's channel id.
