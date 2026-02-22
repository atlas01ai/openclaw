---
description: "Discord text formatting — markdown support, mentions, link suppression, platform-specific rules. Read when composing message text."
links: [sending, components]
---

# Formatting — Discord Text Rules

← [[index]]

Discord has its own markdown dialect with important platform-specific quirks.

## What Discord Supports

| Syntax                   | Result               |
| ------------------------ | -------------------- | ------- | --- | --- | ------------------------------ |
| `**bold**`               | **bold**             |
| `*italic*` or `_italic_` | _italic_             |
| `__underline__`          | underline            |
| `~~strikethrough~~`      | ~~strikethrough~~    |
| `` `inline code` ``      | `inline code`        |
| `\`\`\`code block\`\`\`` | fenced code block    |
| `> quote`                | block quote          |
| `>>> multi-line quote`   | extended block quote |
| `# Heading`              | Large heading        |
| `## Heading 2`           | Medium heading       |
| `### Heading 3`          | Small heading        |
| `- bullet`               | unordered list       |
| `1. item`                | ordered list         |
| `                        |                      | spoiler |     | `   | spoiler (hidden until clicked) |

**Code blocks with language:**
\`\`\`python
print("hello")
\`\`\`

## What Discord Does NOT Support

- **Tables** — render as plain text, broken layout → use bullet lists instead
- HTML — not rendered
- Footnotes, definition lists, task lists (`- [ ]`)

## Mentions

```
<@USER_ID>        — mention a user
<@&ROLE_ID>       — mention a role
<#CHANNEL_ID>     — link to a channel
@everyone         — ping everyone (use sparingly, usually gated)
@here             — ping online users only
```

Always use user **id**, not username — usernames change, ids are permanent.

## Emoji

**Unicode emoji:** paste directly — `✅ 🚀 ❌`

**Custom server emoji:**

```
<:emojiname:EMOJI_ID>
<a:animatedname:EMOJI_ID>   (animated)
```

Get emoji ids via [[discovery]] `emoji-list`.

## Link Handling

By default, Discord **auto-embeds** link previews (large cards). To suppress:

```
<https://example.com>          — suppress preview for one link
<https://a.com> <https://b.com> — suppress multiple
```

Wrap links in `<>` when posting multiple URLs to avoid cluttering the channel with embed cards.

## Timestamps

Discord renders dynamic timestamps that adjust to each user's timezone:

```
<t:UNIX_TIMESTAMP>            — default: "January 1, 2026"
<t:UNIX_TIMESTAMP:R>          — relative: "3 hours ago"
<t:UNIX_TIMESTAMP:T>          — time only: "9:00 PM"
<t:UNIX_TIMESTAMP:D>          — date only: "January 1, 2026"
<t:UNIX_TIMESTAMP:F>          — full: "Thursday, January 1, 2026 9:00 PM"
```

Get a unix timestamp: `date +%s` or `Math.floor(Date.now() / 1000)`.

## Voice/Status Presence

When setting bot presence text (not message content), use `activityState` in presence calls — not Discord markdown.

## Platform Rules for Outbound Messages

1. **No tables** — use bullets or numbered lists
2. **Wrap multiple links** in `<>` to suppress embeds
3. **Headings work** but use sparingly — can look aggressive in chat
4. **Keep it conversational** — Discord is chat, not a document editor

## Inside Components

Text inside [[components]] `text` blocks follows the same markdown rules. Heading syntax (`#`) inside components renders slightly differently — test before deploying.

For rich structured layout that doesn't rely on markdown → use [[components]] instead.
