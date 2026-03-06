---
name: convex
description: Connect Atlas agents to the Convex shared memory backend. Use when reading or writing shared context (cross-agent state), updating agent heartbeat/status, querying the vault (tasks, decisions, lessons), or storing memories with vector embeddings. This skill replaces the flat-file SHARED-CONTEXT.md and vault/ shell-script system with a structured, real-time, queryable backend. Trigger when: (1) reading/writing shared context across agents, (2) creating vault tasks/lessons/decisions, (3) querying open tasks or critical lessons, (4) updating agent status, (5) storing or searching memories semantically.
---

# Convex Skill

Atlas shared memory and coordination backend. Replaces SHARED-CONTEXT.md + flat vault files with a real-time reactive database.

## Setup

Prerequisites: CONVEX_HTTP_URL env var set, OR convex/http-url in atlas-cred. jq + curl required.

```bash
export CONVEX_HTTP_URL=$(atlas-cred show convex/http-url)
# Test:
bash skills/convex/scripts/convex-call.sh GET /agent/list
```

## Common Operations

### Agent Heartbeat

```bash
bash scripts/agent-heartbeat.sh research "anthropic/claude-sonnet-4-6" active "current task" discord
```

### Read Shared Context

```bash
bash scripts/convex-call.sh GET "/context/get?key=current-focus"
bash scripts/context-sync.sh           # all entries
bash scripts/context-sync.sh active-work  # by tag
```

### Write Shared Context

```bash
bash scripts/convex-call.sh POST /context/set   '{"key":"current-focus","value":"Convex integration","updatedBy":"research","tags":["active-work"]}'
```

### Vault: Create Task / Lesson / Decision

```bash
bash scripts/convex-call.sh POST /vault/task   '{"title":"Deploy Convex","priority":"high","project":"convex","agentId":"research"}'

bash scripts/convex-call.sh POST /vault/lesson   '{"insight":"lesson text","context":"ctx","severity":"important","tags":["convex"],"agentId":"research"}'

bash scripts/convex-call.sh POST /vault/decision   '{"title":"Use Convex for shared memory","rationale":"atomic + realtime","tags":["arch"],"agentId":"research"}'
```

### Query Vault

```bash
bash scripts/vault-query.sh tasks open
bash scripts/vault-query.sh tasks open convex   # by project
bash scripts/vault-query.sh lessons critical
bash scripts/vault-query.sh decisions
```

### Store Memory

```bash
bash scripts/convex-call.sh POST /memory/store   '{"content":"text","date":"2026-02-28","agentId":"research","tags":["ops"],"importance":"normal"}'
```

## Scripts

| Script                                                  | Usage                   |
| ------------------------------------------------------- | ----------------------- | ------------------- | ----------- |
| convex-call.sh METHOD PATH [body]                       | Generic HTTP call       |
| agent-heartbeat.sh name model [status] [task] [channel] | Update agent status     |
| context-sync.sh [tag]                                   | Read all shared context |
| vault-query.sh tasks                                    | lessons                 | decisions [filters] | Query vault |

## Full API Reference

See references/api-reference.md for complete endpoint list, schema, and indexes.

## Deployment

```bash
cd ~/projects/atlas-convex && npx convex deploy
```

Dashboard: https://dashboard.convex.dev/t/atlas-claw

## Key Notes

- Context keys: use namespaced names like "research:current-focus" not "focus"
- TTL is Unix ms; omit for permanent entries
- Vector search: pre-compute 1536d embeddings (OpenAI text-embedding-3-small) before storing
- Mutations are serialized — safe for concurrent agent writes, no race conditions
- Source repo: ~/projects/atlas-convex
