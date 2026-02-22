---
description: "Channel and category management — create, edit, delete, move, list. Read when managing server structure."
links: [discovery, threads]
---

# Channels — Discord Server Structure

← [[index]]

⚠️ Channel management is **gated** — requires `channels.discord.actions.channels = true` in config.

## List Channels

```json
{
  "action": "channel-list",
  "channel": "discord",
  "guildId": "<id>"
}
```

Returns all channels with ids, types, positions, parent categories.

## Channel Info

```json
{
  "action": "channel-info",
  "channel": "discord",
  "channelId": "<id>"
}
```

## Create Channel

```json
{
  "action": "channel-create",
  "channel": "discord",
  "guildId": "<id>",
  "name": "channel-name",
  "type": 0,
  "topic": "Channel purpose",
  "parentId": "<category-id>",
  "nsfw": false,
  "rateLimitPerUser": 0
}
```

**Channel types:**

- `0` — text channel (default)
- `2` — voice channel
- `5` — announcement channel
- `15` — forum channel
- `16` — media channel

**Key params:**

- `parentId` — place in a category
- `topic` — channel description (appears in header)
- `rateLimitPerUser` — slowmode in seconds (0 = off)
- `position` — sort order within category

## Edit Channel

```json
{
  "action": "channel-edit",
  "channel": "discord",
  "channelId": "<id>",
  "name": "new-name",
  "topic": "Updated description",
  "nsfw": false
}
```

Pass only fields to change. To remove parent: `clearParent: true`.

## Move Channel

```json
{
  "action": "channel-move",
  "channel": "discord",
  "channelId": "<id>",
  "parentId": "<new-category-id>",
  "position": 2
}
```

## Delete Channel

```json
{
  "action": "channel-delete",
  "channel": "discord",
  "channelId": "<id>",
  "reason": "Archived — project complete"
}
```

`reason` appears in audit log. Deletion is **permanent** — no recovery.

---

## Categories

Categories are containers for channels. Same actions with category-specific endpoints.

### Create Category

```json
{
  "action": "category-create",
  "channel": "discord",
  "guildId": "<id>",
  "name": "CATEGORY NAME",
  "position": 0
}
```

### Edit Category

```json
{
  "action": "category-edit",
  "channel": "discord",
  "categoryId": "<id>",
  "name": "NEW NAME"
}
```

### Delete Category

```json
{
  "action": "category-delete",
  "channel": "discord",
  "categoryId": "<id>"
}
```

Deleting a category does **not** delete its channels — they become uncategorized.

---

## Permissions

Check channel permissions for a user or role:

```json
{
  "action": "permissions",
  "channel": "discord",
  "channelId": "<id>",
  "userId": "<id>"
}
```

---

## Voice Status

Set a status message for a voice channel:

```json
{
  "action": "voice-status",
  "channel": "discord",
  "channelId": "<voice-channel-id>",
  "status": "In standup"
}
```

---

For reading messages in channels → [[discovery]].
For thread channels within a channel → [[threads]].
