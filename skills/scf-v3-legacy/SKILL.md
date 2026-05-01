---
name: scf-v3-legacy
description: "DEPRECATED: SCF v3 — Legacy version preserved for backward compatibility. Use 'scf' (v4) for new work. This skill will be removed in a future release."
license: MIT
status: deprecated
last_updated: 2026-05-01
tags: [multi-agent, orchestration, composition, atoms, molecules, compounds, scf-v3, deprecated]
allowed-tools:
  - sessions_spawn
  - memory_search
metadata:
  author: Atlas
  version: 3.0.0
  scf_version: 3
  deprecated: true
  migration_guide: "Use 'scf' skill (v4) instead. See ~/.openclaw/extensions/claw-atlas-plugin/skills/scf/MIGRATION_GUIDE.md"
---

# Skill Composition Framework (SCF) v3 — DEPRECATED

⚠️ **DEPRECATED:** This skill is preserved for backward compatibility only.  
🆕 **Use:** `scf` (v4) — the production-ready version with recursion guard, explicit tool injection, and robust cleanup.

**Status:** 🔴 Deprecated — 2026-05-01  
**Replaced by:** SCF v4 (`scf` skill)  
**Location:** `~/.openclaw/extensions/claw-atlas-plugin/skills/scf/`

## Migration

### Quick Migration Path

```python
# OLD (v3 - deprecated)
from scf_v3 import Composition
result = await Composition.run(
    task="Your task",
    sessions_spawn=sessions_spawn,
    parent_session_key=session_key
)

# NEW (v4 - current)
from scf_v4 import Composition
result = Composition(
    sessions_spawn=sessions_spawn,
    subagents=subagents
).run(
    task="Your task",
    parent_session_key=session_key
)
```

### Key Changes in v4

| Feature         | v3 (deprecated)                  | v4 (current)                     |
| --------------- | -------------------------------- | -------------------------------- |
| Import          | `from scf_v3 import Composition` | `from scf_v4 import Composition` |
| Initialization  | Direct class                     | Constructor with tool injection  |
| Async           | `await Composition.run()`        | `Composition(...).run()` (sync)  |
| Cleanup         | Manual                           | Automatic with `subagents` param |
| Recursion Guard | None                             | Built-in (max depth 2)           |
| Tool Injection  | Partial                          | Explicit                         |

## Legacy Documentation

The following documentation is preserved for reference only.

---

### Original v3 Architecture

```
Compound (Atlas/you)
├── Molecule 1: Problem Decomposition
│   ├── Atom A: Scope analysis
│   ├── Atom B: Constraint identification
│   └── Atom C: Stakeholder mapping
├── Molecule 2: Solution Generation (if needed)
│   ├── Atom D: Option A analysis
│   ├── Atom E: Option B analysis
│   └── Atom F: Option C analysis
└── Synthesis: Final recommendation
```

### Original v3 Usage

```python
from scf_v3 import Composition

result = await Composition.run(
    task="Your research question",
    sessions_spawn=sessions_spawn,
    parent_session_key=session_key
)
```

### File Structure (Legacy)

```
projects/skill-composition-framework/
├── scf_v3/                          # Core implementation (v3 - deprecated)
│   ├── __init__.py                  # Main exports
│   ├── composition.py               # Composition orchestrator
│   ├── adapter.py                   # Adapter functions
│   └── types.py                     # Dataclasses
├── scf_v2/                          # Legacy v2 (archived)
└── scf_v4/                          # ✅ Current version
```

## References

- **SCF v4 (Current):** `~/.openclaw/extensions/claw-atlas-plugin/skills/scf/`
- **Migration Guide:** `~/.openclaw/extensions/claw-atlas-plugin/skills/scf/MIGRATION_GUIDE.md`
- **SCF v4 Design:** `~/openclaw/workspace/projects/skill-composition-framework/DESIGN.md`
