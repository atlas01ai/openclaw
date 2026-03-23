# Skill Creation Process — Detailed Guide

## Step 1: Understand with Concrete Examples

Gather concrete examples of how the skill will be used before designing anything.

Ask the user:

- "What functionality should this skill support?"
- "Can you give some examples of how this would be used?"
- "What would a user say that should trigger this skill?"

Avoid asking too many questions at once. Start with the most important, follow up as needed.

Conclude when you have a clear sense of the functionality the skill should support.

## Step 2: Plan Reusable Contents

For each concrete example, analyze:

1. How would you execute this from scratch?
2. What scripts, references, or assets would help when doing this repeatedly?

**Example analyses:**

- _"Help me rotate this PDF"_ → Rotating PDFs requires rewriting the same code each time → include `scripts/rotate_pdf.py`
- _"Build me a todo app"_ → Frontend apps need the same boilerplate each time → include `assets/hello-world/` template
- _"How many users logged in today?"_ → BigQuery requires rediscovering table schemas each time → include `references/schema.md`

## Step 3: Initialize the Skill

Always run `init_skill.py` when creating from scratch:

```bash
scripts/init_skill.py <skill-name> --path <output-directory> [--resources scripts,references,assets] [--examples]
```

Examples:

```bash
scripts/init_skill.py my-skill --path skills/public
scripts/init_skill.py my-skill --path skills/public --resources scripts,references
```

The script creates the skill directory, generates a SKILL.md template with frontmatter and TODO placeholders, and optionally creates resource subdirectories and example files.

Skip this step only if the skill already exists and you're iterating or packaging.

## Step 4: Implement Resources and Write SKILL.md

### Implement Resources First

Build `scripts/`, `references/`, and `assets/` files before writing SKILL.md. Some steps require user input (e.g., brand assets for a brand-guidelines skill).

**Testing scripts:** Run every added script and verify output matches expectations. For many similar scripts, test a representative sample.

If you used `--examples`, delete any placeholder files that aren't needed.

### Design Patterns for SKILL.md

Before writing, review `references/progressive-disclosure.md` for patterns on splitting content across SKILL.md and reference files.

### Writing SKILL.md

**Style:** Always use imperative/infinitive form. Write for another instance of Codex — include information that's non-obvious and procedurally important.

**Frontmatter:**

- `name`: the skill name
- `description`: triggers when matched. Include what the skill does AND when to use it. Put "when to use" here — not in the body (body loads after triggering, so it's too late for discovery context).
- No other frontmatter fields.

**Body structure:** Core principles → workflow → resources map → gotchas → known issues.

**Proven design guides:**

- Multi-step processes → `references/workflows.md` in the skill-creator scripts/
- Specific output formats → `references/output-patterns.md` in the skill-creator scripts/

## Step 5: Package the Skill

```bash
scripts/package_skill.py <path/to/skill-folder>
# Optional output dir:
scripts/package_skill.py <path/to/skill-folder> ./dist
```

The script validates first (frontmatter, naming, structure, description quality), then packages to a `.skill` file (zip) named after the skill.

**Security restriction:** Symlinks are rejected — packaging fails if any symlink is present.

Fix any validation errors and rerun.

## Step 6: Iterate

After real usage, update the skill:

1. Notice struggles or inefficiencies during actual tasks
2. Identify what SKILL.md or bundled resources should change
3. Implement and test

The Gotchas and Known Issues sections should be updated after failures — not speculatively upfront.
