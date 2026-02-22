---
description: "Core message actions: send, edit, delete, react, reply, pin, poll. Read when you're sending or modifying messages."
links: [components, formatting, threads]
---

# Sending — Discord Message Actions

← [[index]]

## Send

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:<id>",
  "message": "text",
  "silent": true
}
```

**Key params:**

- `to` — `"channel:<id>"` or `"user:<id>"` (DM)
- `silent: true` — suppresses @mention notifications (default: false)
- `replyTo: "<messageId>"` — makes it a reply; use with `quoteText` to quote the original
- `media` — URL or local file path for attachment (`"file:///tmp/img.png"`)
- `filename` — override attachment filename
- `contentType` — MIME type if needed

**For rich UI (buttons, selects, modals):** don't add embeds here, go to [[components]] instead.
**For text formatting:** see [[formatting]].

## Edit

Only your own messages. Edits don't notify.

```json
{
  "action": "edit",
  "channel": "discord",
  "channelId": "<id>",
  "messageId": "<id>",
  "message": "corrected text"
}
```

## Delete

```json
{
  "action": "delete",
  "channel": "discord",
  "channelId": "<id>",
  "messageId": "<id>"
}
```

`deleteDays` is for pruning bulk messages (moderation, gated).

## React

One emoji per call. Custom emoji: use `emojiName` + `emoji` (id).

```json
{
  "action": "react",
  "channel": "discord",
  "channelId": "<id>",
  "messageId": "<id>",
  "emoji": "✅"
}
```

Custom server emoji:

```json
{
  "emoji": "<:emojiname:1234567890>",
  "emojiName": "emojiname"
}
```

To remove a reaction: same call with `remove: true`.

## Reply to a Message

Combine `replyTo` with `quoteText` to quote the original line:

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:<id>",
  "replyTo": "<messageId>",
  "quoteText": "the line you're replying to",
  "message": "your reply"
}
```

## Poll

```json
{
  "action": "poll",
  "channel": "discord",
  "to": "channel:<id>",
  "pollQuestion": "Question text?",
  "pollOption": ["Option A", "Option B", "Option C"],
  "pollMulti": false,
  "pollDurationHours": 24
}
```

- `pollMulti: true` — allow multiple selections
- Duration range: 1–168 hours (1 week max)
- Polls can't be edited after posting

## Pin / Unpin

```json
{ "action": "pin",   "channel": "discord", "channelId": "<id>", "messageId": "<id>" }
{ "action": "unpin", "channel": "discord", "channelId": "<id>", "messageId": "<id>" }
```

List pins: `list-pins` with `channelId`.

## Sticker

```json
{
  "action": "sticker",
  "channel": "discord",
  "to": "channel:<id>",
  "stickerId": ["<id>"]
}
```

## Thread → see [[threads]]

Creating a thread from a message → `thread-create`. Replying inside a thread → `thread-reply`. Both covered in [[threads]].
