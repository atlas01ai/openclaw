# Persistent Channels — Never Audit

These channels are permanent infrastructure. Skip them entirely during any channel audit.

## Exclusion List

| Channel           | ID                  | Reason                              |
| ----------------- | ------------------- | ----------------------------------- |
| #general          | 1467779294297325644 | Main Atlas conversation channel     |
| #system-alerts    | 1468442523708952698 | Infrastructure alerts, always-on    |
| #backlog          | 1468453815060664343 | Async capture, always-on            |
| #identity         | 1468464295191908424 | Ongoing identity work, never closes |
| #security         | 1468411497427243089 | Security discussions, always-on     |
| #self-improvement | 1468826126968164600 | Richard drops resources, ongoing    |
| #opus             | 1471192759892443252 | Opus agent channel, permanent       |
| #chatgpt          | 1473824245321830516 | Codex/ChatGPT channel, permanent    |
| #clawtrading      | 1473846404135780465 | Live trading, always-on             |
| #heartbeat        | 1475301099790401687 | Monitor channel, always-on          |

## Updating This List

If Richard designates a new permanent channel, add it here with its ID and reason.
Run `message(action="channel-info", channel="discord", target="CHANNEL_NAME")` to get the ID.
