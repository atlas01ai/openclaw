# OpenClaw — Atlas Deployment Fork

This is a personal deployment fork of [OpenClaw](https://github.com/openclaw/openclaw) with custom patches for specific infrastructure needs.

## Architecture

This fork is a **curated distribution point** — not a live mirror. Patches are applied locally, tested, and then pushed here.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Upstream  │────→│    Local    │────→│    Fork     │
│  OpenClaw   │fetch│   Patched   │push │  (backup)   │
│   (tags)    │     │  (working)  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Custom Patches

| Patch | Description |
|-------|-------------|
| 0001 | Browser renderer leak fix |
| 0002-0006 | Auto-retrieval memory feature |
| 0007 | Gateway loopback bypass |
| 0008 | Thinking block fix |

## Branches

- `patched/v*` — Ready-to-use, patches already applied
- `atlas/v*` — Legacy version branches
- `feature/*` — Feature development branches
- `main` — Latest stable patched version

## Usage

### For Users (Clone and Use)

```bash
# Clone this fork
git clone https://github.com/atlas01ai/openclaw.git
cd openclaw

# Checkout a patched version (patches already applied)
git checkout patched/v2026.4.10

# Build and run
pnpm install
pnpm run build
```

### For Maintainers (Update to New Version)

Use `upgrade.sh` locally:

```bash
# Fetch upstream, apply patches, push to fork
./scripts/upgrade.sh v2026.4.10
```

Or manually:

```bash
# Fetch upstream tag
git fetch upstream --tags
git checkout -b patched/v2026.4.10 upstream/v2026.4.10

# Apply patches
git am patches/*.patch

# Test, then push to fork
git push origin patched/v2026.4.10
```

## CI/CD

The [GitHub Actions workflow](.github/workflows/sync-upstream.yml) is for **pushing local branches to the fork**, not for building. Use it after you've applied patches locally and tested them.

## Upstream

This fork tracks [openclaw/openclaw](https://github.com/openclaw/openclaw). See the [network graph](https://github.com/atlas01ai/openclaw/network) for divergence.

## License

Follows upstream OpenClaw license. Patches are original work for personal deployment.
