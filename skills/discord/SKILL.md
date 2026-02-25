---
name: discord
description: "Discord ops via the message tool (channel=discord)."
metadata: { "openclaw": { "emoji": "🎮", "requires": { "config": ["channels.discord.token"] } } }
allowed-tools: ["message"]
---

# Discord (Via `message`)

Use the `message` tool. No provider-specific `discord` tool exposed to the agent.

## Musts

- Always: `channel: "discord"`.
- Respect gating: `channels.discord.actions.*` (some default off: `roles`, `moderation`, `presence`, `channels`).
- Prefer explicit ids: `guildId`, `channelId`, `messageId`, `userId`.
- Multi-account: optional `accountId`.

## Guidelines

- Avoid Markdown tables in outbound Discord messages.
- Mention users as `<@USER_ID>`.
- Prefer Discord components v2 (`components`) for rich UI; use legacy `embeds` only when you must.

## Targets

- Send-like actions: `to: "channel:<id>"` or `to: "user:<id>"`.
- Message-specific actions: `channelId: "<id>"` (or `to`) + `messageId: "<id>"`.

## Common Actions (Examples)

Send message:

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "message": "hello",
  "silent": true
}
```

Send with media:

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "message": "see attachment",
  "media": "file:///tmp/example.png"
}
```

- Optional `silent: true` to suppress Discord notifications.

Send with components v2 (recommended for rich UI):

**⚠️ Block type names are strict.** The `type` field must be an exact supported value. Common mistake: `"type": "buttons"` does NOT exist — use `"type": "actions"` for button rows.

### Supported block types

| Type        | Purpose                   | Required fields                         |
| ----------- | ------------------------- | --------------------------------------- |
| `text`      | Plain text block          | `text`                                  |
| `section`   | Text + optional accessory | `text` or `texts`, optional `accessory` |
| `actions`   | Row of buttons or selects | `buttons` or `select`                   |
| `media`     | Image/video gallery       | `items` (array of `{url}`)              |
| `separator` | Visual divider            | (none)                                  |
| `file`      | File attachment           | `file`                                  |

### Buttons (action row)

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "message": "Choose an option:",
  "components": {
    "blocks": [
      {
        "type": "actions",
        "buttons": [
          { "label": "✅ Approve", "style": "success" },
          { "label": "❌ Reject", "style": "danger" },
          { "label": "⏭️ Skip", "style": "secondary" }
        ]
      }
    ],
    "reusable": true
  }
}
```

- Button `style`: `"primary"` (blurple), `"secondary"` (grey), `"success"` (green), `"danger"` (red), `"link"` (external URL, requires `url`)
- Set `"reusable": true` at the components level to keep buttons active until expiry
- Optional `"allowedUsers": ["user_id"]` on a button to restrict who can click

### Rich text with container

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "components": {
    "blocks": [
      { "type": "text", "text": "## Title\n\nFormatted markdown content here." },
      {
        "type": "actions",
        "buttons": [{ "label": "Click me", "style": "primary" }]
      }
    ],
    "container": { "accentColor": "#5865F2" }
  }
}
```

### Select menu

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "components": {
    "blocks": [
      {
        "type": "actions",
        "select": {
          "type": "string",
          "placeholder": "Pick one...",
          "options": [
            { "label": "Option A", "value": "a" },
            { "label": "Option B", "value": "b" }
          ]
        }
      }
    ]
  }
}
```

### Modal (form with trigger button)

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "components": {
    "modal": {
      "title": "Feedback",
      "triggerLabel": "📝 Give Feedback",
      "triggerStyle": "primary",
      "fields": [
        { "type": "text", "label": "What went well?", "style": "paragraph" },
        { "type": "text", "label": "Rating", "style": "short", "placeholder": "1-5" }
      ]
    }
  }
}
```

### Common mistakes

- ❌ `"type": "buttons"` → Does not exist. Use `"type": "actions"`.
- ❌ `"type": "section"` with only `buttons` → Section requires `text` or `texts`.
- ❌ Combining `components` with `embeds` → Discord rejects v2 + embeds together.
- ❌ Using channel name as `target` → Use explicit `to: "channel:<id>"` with the numeric ID.

Legacy embeds (not recommended):

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "message": "Status update",
  "embeds": [{ "title": "Legacy", "description": "Embeds are legacy." }]
}
```

- `embeds` are ignored when components v2 are present.

React:

```json
{
  "action": "react",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456",
  "emoji": "✅"
}
```

Read:

```json
{
  "action": "read",
  "channel": "discord",
  "to": "channel:123",
  "limit": 20
}
```

Edit / delete:

```json
{
  "action": "edit",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456",
  "message": "fixed typo"
}
```

```json
{
  "action": "delete",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456"
}
```

Poll:

```json
{
  "action": "poll",
  "channel": "discord",
  "to": "channel:123",
  "pollQuestion": "Lunch?",
  "pollOption": ["Pizza", "Sushi", "Salad"],
  "pollMulti": false,
  "pollDurationHours": 24
}
```

Pins:

```json
{
  "action": "pin",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456"
}
```

Threads:

```json
{
  "action": "thread-create",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456",
  "threadName": "bug triage"
}
```

Search:

```json
{
  "action": "search",
  "channel": "discord",
  "guildId": "999",
  "query": "release notes",
  "channelIds": ["123", "456"],
  "limit": 10
}
```

Presence (often gated):

```json
{
  "action": "set-presence",
  "channel": "discord",
  "activityType": "playing",
  "activityName": "with fire",
  "status": "online"
}
```

## Writing Style (Discord)

- Short, conversational, low ceremony.
- No markdown tables.
- Mention users as `<@USER_ID>`.
