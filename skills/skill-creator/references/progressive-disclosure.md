# Progressive Disclosure Patterns

Keep SKILL.md under 500 lines. Split into reference files when approaching that limit. Always reference the files explicitly from SKILL.md — without a navigation map, agents won't know they exist.

**Key principle:** Core workflow and selection guidance stay in SKILL.md. Variant-specific details, patterns, and examples go in reference files.

## Pattern 1: High-level guide with references

```markdown
# PDF Processing

## Quick start

Extract text with pdfplumber:
[code example]

## Advanced features

- **Form filling**: See `references/forms.md` for complete guide
- **API reference**: See `references/api.md` for all methods
```

Codex loads `forms.md` or `api.md` only when those features are needed.

## Pattern 2: Domain-specific organization

Organize by domain to avoid loading irrelevant context:

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── references/
    ├── finance.md   (revenue, billing metrics)
    ├── sales.md     (opportunities, pipeline)
    └── marketing.md (campaigns, attribution)
```

When a user asks about sales metrics, Codex reads only `sales.md`.

Same pattern for multiple frameworks:

```
cloud-deploy/
├── SKILL.md (workflow + provider selection)
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```

## Pattern 3: Conditional details

```markdown
## Editing documents

For simple edits, modify XML directly.

**For tracked changes**: See `references/redlining.md`
**For OOXML details**: See `references/ooxml.md`
```

Codex loads only the file needed for the current task.

## Guidelines

- **One level deep**: All reference files link directly from SKILL.md. No nested references.
- **Table of contents**: For files longer than 100 lines, include a TOC at the top so Codex can preview scope without reading the full file.
- **Declarative vs. procedural**: Keep procedural instructions (when to act, how to decide) in SKILL.md. Move declarative lookups (field definitions, API specs, format tables) to references. An agent must know HOW before it can know WHAT to look up.
