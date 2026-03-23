# Skill Anatomy — Full Reference

## Folder Structure

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter: name, description (only these two fields)
│   └── Markdown body: instructions loaded after skill triggers
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts)
```

## Scripts (`scripts/`)

- **When to include**: When the same code is rewritten repeatedly or deterministic reliability is needed
- **Examples**: `scripts/rotate_pdf.py`, `scripts/run.sh`
- **Benefits**: Token-efficient, deterministic, may be executed without loading into context
- **Note**: Scripts may still need to be read by Codex for patching or environment-specific adjustments

## References (`references/`)

- **When to include**: Documentation that Codex should reference while working
- **Examples**: `references/schema.md` for DB schemas, `references/api.md` for API specs, `references/policies.md` for company policies
- **Best practice**: If files are large (>10k words), include grep search patterns in SKILL.md
- **Avoid duplication**: Content lives in SKILL.md OR references, not both. SKILL.md holds procedural instructions; references hold lookup material.

## Assets (`assets/`)

- **When to include**: Files used in the output Codex produces (not loaded into context)
- **Examples**: `assets/logo.png`, `assets/template.pptx`, `assets/frontend-template/`
- **Use cases**: Templates, images, boilerplate code, fonts

## What NOT to Include

Do NOT create extraneous files:

- README.md, INSTALLATION_GUIDE.md, QUICK_REFERENCE.md, CHANGELOG.md

The skill should contain only what an AI agent needs to do the job. No auxiliary context about the creation process, no setup guides, no user-facing docs.

## SKILL.md Frontmatter

YAML frontmatter must have exactly `name` and `description`. No other fields.

```yaml
---
name: my-skill
description: "What this skill does and when to use it. Include triggers."
---
```

The description is the primary triggering mechanism — the agent decides whether to load this skill based on description matching alone. Be specific about when to use and when NOT to use.

## Standard Ending Sections

Every SKILL.md body should end with:

```markdown
## Gotchas

<!-- Populate after real failures — not during authoring.
     Format: - **[Failure pattern]**: What goes wrong → what to do instead -->

## Known Issues / Lessons

<!-- Timestamped incidents and resolutions.
     Format: - **YYYY-MM-DD** Description of what went wrong and the fix. -->
```

Gotchas are evergreen failure patterns discovered during real usage. Known Issues tracks specific incidents. Both sections are better empty than filled with speculation.

## Resources Navigation Map

When a skill has bundled files, list them in SKILL.md:

```markdown
## Resources

- `references/api.md` — Full API reference. Read when working with auth or rate limits.
- `scripts/run.sh` — Automation script. Execute when [condition].
- `assets/template.md` — Output template. Copy when generating reports.
```

Without this map, agents won't discover the files exist.
