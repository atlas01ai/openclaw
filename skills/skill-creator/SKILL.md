---
name: skill-creator
description: Create, edit, improve, or audit AgentSkills. Use when creating a new skill from scratch or when asked to improve, review, audit, tidy up, or clean up an existing skill or SKILL.md file. Also use when editing or restructuring a skill directory (moving files to references/ or scripts/, removing stale content, validating against the AgentSkills spec). Triggers on phrases like "create a skill", "author a skill", "tidy up a skill", "improve this skill", "review the skill", "clean up the skill", "audit the skill".
---

# Skill Creator

Skills are modular, self-contained packages that extend agent capabilities via specialized knowledge, workflows, and tools. They are "onboarding guides" — providing procedural knowledge no model reliably holds internally.

**Before creating or editing a skill:** Read `references/anatomy.md` for the full spec.
**When executing creation steps:** Read `references/creation-process.md`.
**When structuring SKILL.md or splitting content:** Read `references/progressive-disclosure.md`.

## Core Principles

**Concise is key.** The context window is shared. Challenge every section: does the agent need this? Prefer concise examples over verbose explanations.

**Don't railroad the agent.** Give information needed, not a rigid script. Tell it _what matters_, not _how to type_. Focus on non-obvious things the agent would plausibly get wrong.

**Match degrees of freedom to fragility:**

- High freedom (text) — multiple valid approaches, context-dependent
- Medium freedom (pseudocode/scripts with params) — preferred pattern but variation OK
- Low freedom (specific scripts) — fragile operations where consistency is critical

## Quick Anatomy

```
skill-name/
├── SKILL.md           ← required: frontmatter (name, description only) + instructions
├── scripts/           ← optional: executable code (Python/Bash)
├── references/        ← optional: documentation loaded on demand
└── assets/            ← optional: files used in output (templates, images)
```

Frontmatter: only `name` and `description`. No other fields.
Description is the primary triggering mechanism — be specific about when to use AND when not to.

## Creation Steps

1. **Understand** — gather concrete usage examples; ask what would trigger this skill
2. **Plan** — identify what scripts/references/assets would help when doing this repeatedly
3. **Initialize** — run `scripts/init_skill.py <name> --path <dir> [--resources scripts,references,assets]`
4. **Implement** — build resources first, then write SKILL.md (see `references/creation-process.md`)
5. **Package** — run `scripts/package_skill.py <skill-folder>`; validates then creates `.skill` zip
6. **Iterate** — update after real usage; populate Gotchas/Known Issues from actual failures

**Naming:** lowercase, hyphens only, under 64 chars. Verb-led preferred. Namespace by tool when helpful (e.g., `gh-address-comments`).

## SKILL.md Writing

- Use imperative/infinitive form
- Body structure: principles → workflow → resources map → gotchas → known issues
- `description` field: include "when to use" here — not in the body (body loads after triggering)

**Standard ending (required on every SKILL.md):**

```markdown
## Gotchas

<!-- Populate after real failures — not during authoring.
     Format: - **[Failure pattern]**: What goes wrong → what to do instead -->

## Known Issues / Lessons

<!-- Timestamped incidents. Format: - **YYYY-MM-DD** What went wrong and the fix. -->
```

**Resources navigation map (required when skill has bundled files):**

```markdown
## Resources

- `references/api.md` — Full API reference. Read when working with auth or rate limits.
- `scripts/run.sh` — Automation script. Execute when [Y].
```

Without this map, agents won't discover the files exist.

## Reference Files

| Task                                                                        | Load                                   |
| --------------------------------------------------------------------------- | -------------------------------------- |
| Full folder structure, scripts/references/assets spec, frontmatter rules    | `references/anatomy.md`                |
| Step-by-step creation process with examples                                 | `references/creation-process.md`       |
| Progressive disclosure patterns (splitting SKILL.md, reference file design) | `references/progressive-disclosure.md` |

## Gotchas

- **Skill not visible to agents**: The skill directory must be registered in the plugin's `openclaw.plugin.json` manifest (or equivalent skill registry). Creating the directory is not enough — agents discover skills from the manifest, not by scanning directories.
- **Frontmatter extra fields**: Only `name` and `description` are valid frontmatter keys. Extra fields are silently stripped on packaging and may cause validation failure.
- **Symlinks**: Packaging rejects symlinks — they fail validation silently. Resolve symlinks before packaging.
- **Empty Gotchas/Known Issues**: Better empty than speculative. Don't pre-populate with obvious warnings.

## Known Issues / Lessons

- **2026-03-23**: Progressive disclosure refactor. Moved anatomy, creation-process, and progressive-disclosure detail to references/. SKILL.md was 428 lines; now ~160. Triggered by canary test validation confirming reference file loading works reliably (10/10 across Sonnet + Haiku).
