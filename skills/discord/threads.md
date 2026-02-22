---
description: "Thread lifecycle — create threads from messages, reply inside threads, list threads. Read when working with threaded discussions."
links: [sending, discovery]
---

# Threads — Discord Threaded Discussions

← [[index]]

Threads are sub-channels attached to a message or created standalone. They keep conversations focused without cluttering the main channel.

## Create Thread from Message

Attaches a thread to an existing message:

```json
{
  "action": "thread-create",
  "channel": "discord",
  "channelId": "<parent-channel-id>",
  "messageId": "<id>",
  "threadName": "Discussion: feature X",
  "autoArchiveMin": 1440
}
```

- `threadName` — required, max 100 chars
- `autoArchiveMin` — auto-archive after inactivity: `60`, `1440` (1 day), `4320` (3 days), `10080` (7 days)
- `rateLimitPerUser` — slowmode in seconds

The thread is publicly visible to anyone who can see the parent channel.

## Reply Inside a Thread

Use `thread-reply` with the thread's channel id:

```json
{
  "action": "thread-reply",
  "channel": "discord",
  "threadId": "<thread-channel-id>",
  "message": "Reply text here"
}
```

- `threadId` — the thread's own channel id (not the parent)
- Same `media`, `silent`, `components` params as regular [[sending]] apply

## List Threads

```json
{
  "action": "thread-list",
  "channel": "discord",
  "channelId": "<parent-channel-id>",
  "includeArchived": false
}
```

Returns active threads in the channel. Pass `includeArchived: true` to also fetch archived threads.

Filter by specific thread: add `threadId`.

---

## Thread IDs vs Channel IDs

Threads have their **own channel id** distinct from the parent. When you create a thread, the response includes the thread's id — save it if you need to reply later.

To read messages inside a thread: use [[discovery]] `read` action with the thread's channel id as `to`.

---

## Standalone Threads (Forum Posts)

In forum channels, threads are the primary content unit. Create them the same way with `thread-create`, but the `channelId` is the forum channel id and `messageId` is omitted.

---

For sending messages generally → [[sending]].
For reading thread contents → [[discovery]].
