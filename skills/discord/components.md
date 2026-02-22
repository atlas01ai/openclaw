---
description: "Discord Components v2 — rich UI primitives: text blocks, buttons, selects, modals, media galleries, containers. Read when building interactive or visually rich messages."
links: [sending, formatting]
---

# Components v2 — Rich Discord UI

← [[index]]

Components v2 is the **correct way** to build rich Discord UI. Do not combine with `embeds` — Discord rejects the mix.

For plain text messages, use `message` directly → [[sending]]. Components are for interactive or structured layouts.

## Structure

Pass a `components` object to `send`:

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:<id>",
  "components": {
    "text": "Optional top-level text",
    "blocks": [ ...block objects... ],
    "reusable": false
  }
}
```

- `text` — plain text above the component stack (subject to [[formatting]] rules)
- `blocks` — array of block objects (see below)
- `reusable: true` — keeps buttons/selects/forms active after one interaction (until expiry). Default: false (single-use)
- `container` — wrap all blocks in a styled container (accent color, spoiler)

---

## Block Types

### Text Block

```json
{ "type": "text", "text": "Markdown text here" }
```

Multiple text lines: use `texts` array (renders each as a paragraph).

### Section (Text + Accessory)

```json
{
  "type": "section",
  "text": "Left side text",
  "accessory": {
    "type": "button",
    "button": { "label": "Click me", "style": "primary" }
  }
}
```

Accessory types: `button`, `url` (link button).

### Buttons

Buttons live in a block directly or as accessories:

```json
{
  "type": "buttons",
  "buttons": [
    { "label": "Approve", "style": "success" },
    { "label": "Reject", "style": "danger" },
    { "label": "Docs", "style": "link", "url": "https://example.com" }
  ]
}
```

**Button styles:** `primary` (blue), `secondary` (grey), `success` (green), `danger` (red), `link` (grey, opens URL)

**Restrict who can click:**

```json
{ "label": "Admin only", "style": "primary", "allowedUsers": ["706660274266046494"] }
```

**Disable:** `"disabled": true`

**Emoji on button:**

```json
{ "label": "Vote", "emoji": { "name": "✅" } }
```

### Select Menu

```json
{
  "type": "section",
  "select": {
    "type": "string",
    "placeholder": "Choose an option...",
    "options": [
      { "label": "Option A", "value": "a", "description": "First choice" },
      { "label": "Option B", "value": "b" }
    ],
    "minValues": 1,
    "maxValues": 1
  }
}
```

**Select types:** `string` (custom options), `user`, `role`, `mentionable`, `channel`

For user/role/channel selects, omit `options` — Discord populates them automatically.

### Media Gallery

```json
{
  "type": "media-gallery",
  "items": [
    { "url": "https://example.com/img1.png", "description": "Alt text" },
    { "url": "https://example.com/img2.png", "spoiler": true }
  ]
}
```

- `description` — alt text for accessibility
- `spoiler: true` — blurs image until clicked

### File Attachment Block

```json
{ "type": "file", "file": "attachment://filename.png" }
```

Use with `media` in the parent `send` call. The `file` field references the attachment.

### Divider

```json
{ "type": "divider" }
```

Thin horizontal line. Optional `spacing: "small"` or `"large"`.

---

## Container (Wrapper)

Wrap all blocks in a styled card:

```json
{
  "components": {
    "blocks": [ ...blocks... ],
    "container": {
      "accentColor": "#5865F2",
      "spoiler": false
    }
  }
}
```

- `accentColor` — left-side color stripe (hex)
- `spoiler: true` — hides content until clicked

---

## Modal (Form)

Modals appear as popups triggered by a button click. Pass `modal` in the components object:

```json
{
  "components": {
    "modal": {
      "title": "Submit Feedback",
      "triggerLabel": "Open Form",
      "triggerStyle": "primary",
      "fields": [
        {
          "type": "text",
          "label": "Your feedback",
          "name": "feedback",
          "style": "paragraph",
          "placeholder": "Tell us what you think...",
          "required": true,
          "minLength": 10,
          "maxLength": 500
        },
        {
          "type": "select",
          "label": "Category",
          "name": "category",
          "options": [
            { "label": "Bug", "value": "bug" },
            { "label": "Feature", "value": "feature" }
          ]
        }
      ]
    }
  }
}
```

**Field types:** `text` (short/paragraph), `select`
**Text styles:** `short` (single line), `paragraph` (multi-line)

---

## Reusable Components

By default, buttons/selects deactivate after one interaction. For persistent UI (dashboards, ongoing controls):

```json
{
  "components": {
    "blocks": [ ...buttons... ],
    "reusable": true
  }
}
```

Components stay active until they expire (Discord's TTL). Use for dashboards and status panels.

---

## Common Patterns

**Status card with actions:**

```json
{
  "components": {
    "container": { "accentColor": "#57F287" },
    "blocks": [
      { "type": "text", "text": "**✅ Deploy complete**\nVersion 2.1.4 is live." },
      { "type": "divider" },
      {
        "type": "buttons",
        "buttons": [
          { "label": "View logs", "style": "link", "url": "https://logs.example.com" },
          { "label": "Rollback", "style": "danger" }
        ]
      }
    ]
  }
}
```

**Inline buttons on Discord** are disabled by default. Enable via `discord.capabilities.inlineButtons` config if needed.

For message text formatting inside components → [[formatting]].
