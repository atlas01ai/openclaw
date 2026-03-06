# Atlas Convex Backend

## Endpoints

Base URL stored in `convex/http-url` via atlas-cred.
All endpoints respond with JSON.

### Agents

| Method | Path             | Body/Params                                          | Description         |
| ------ | ---------------- | ---------------------------------------------------- | ------------------- |
| POST   | /agent/heartbeat | {name, model, status, currentTask?, currentChannel?} | Upsert agent status |
| GET    | /agent/list      | —                                                    | All agent statuses  |

### Shared Context (replaces SHARED-CONTEXT.md)

| Method | Path            | Body/Params                          | Description                     |
| ------ | --------------- | ------------------------------------ | ------------------------------- |
| POST   | /context/set    | {key, value, updatedBy, ttl?, tags?} | Set/update a key                |
| GET    | /context/get    | ?key=KEY                             | Get single entry                |
| GET    | /context/list   | ?tag=TAG                             | List all (optionally by tag)    |
| DELETE | /context/remove | ?key=KEY                             | Delete a key                    |
| GET    | /context/since  | ?since=UNIX_MS                       | Entries updated since timestamp |

### Vault

| Method | Path            | Body/Params                                                   | Description     |
| ------ | --------------- | ------------------------------------------------------------- | --------------- |
| POST   | /vault/task     | {title, description?, priority?, project?, agentId, dueDate?} | Create task     |
| GET    | /vault/tasks    | ?status=open&project=X                                        | List tasks      |
| POST   | /vault/lesson   | {insight, context, severity, tags[], agentId, embedding?}     | Create lesson   |
| GET    | /vault/lessons  | ?severity=critical                                            | List lessons    |
| POST   | /vault/decision | {title, rationale, context?, tags[], agentId}                 | Create decision |

### Memory

| Method | Path          | Body/Params                                              | Description  |
| ------ | ------------- | -------------------------------------------------------- | ------------ |
| POST   | /memory/store | {content, date, agentId, tags[], importance, embedding?} | Store memory |

## Schema Summary

```
agents: {name, model, lastSeen, status, currentTask?, currentChannel?, sessionKey?}
sharedContext: {key, value, updatedBy, updatedAt, ttl?, tags?}
vaultTasks: {title, desc?, status, priority?, project?, agentId, dueDate?, completedAt?}
vaultDecisions: {title, rationale, context?, tags[], agentId}
vaultLessons: {insight, context, severity, tags[], agentId, embedding?}
memories: {content, date, agentId, tags[], importance, embedding?}
```

## Status Values

- agent status: active | idle | error
- task status: open | in-progress | done | cancelled
- task priority: low | normal | high | critical
- lesson severity: normal | important | critical
- memory importance: low | normal | high

## Indexes

- agents: by_name
- sharedContext: by_key, by_updatedAt
- vaultTasks: by_status, by_project, by_agentId
- vaultLessons: by_severity, by_agentId, by_embedding (vector, 1536d)
- memories: by_date, by_agentId, by_embedding (vector, 1536d)

## Repo

Source: https://github.com/richykong/atlas-convex
Local: ~/projects/atlas-convex
Deploy: cd ~/projects/atlas-convex && npx convex deploy
