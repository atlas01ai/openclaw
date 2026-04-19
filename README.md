# OpenClaw — Atlas Deployment Fork

This is a personal deployment fork of [OpenClaw](https://github.com/openclaw/openclaw) with custom patches for specific infrastructure needs.

## Custom Patches

| Patch | Description | Status |
|-------|-------------|--------|
| 0001 | Browser renderer leak fix | Active |
| 0002-0006 | Auto-retrieval memory feature | Active |
| 0007 | Gateway loopback bypass | Active |
| 0008 | Thinking block fix | Active |

## Branches

- `upstream/v*` — Tracking branches for upstream releases (auto-synced)
- `atlas/v*` — Legacy version branches (manual)
- `feature/*` — Feature development branches

## Auto-Sync

This fork uses [GitHub Actions](.github/workflows/sync-upstream.yml) to automatically track upstream releases:
- **Schedule:** Daily at 06:00 UTC
- **Manual:** Via `workflow_dispatch`
- **Patches:** Applied via `git am --3way` on each new version
- **Validation:** `validate.sh` runs after patch application
- **Failures:** GitHub issues created for manual intervention

## Upstream

This fork tracks [openclaw/openclaw](https://github.com/openclaw/openclaw). See the [network graph](https://github.com/atlas01ai/openclaw/network) for divergence.

## Usage

```bash
# Clone this fork
git clone https://github.com/atlas01ai/openclaw.git
cd openclaw

# Checkout a version with patches
git checkout upstream/v2026.4.10

# Build and run
pnpm install
pnpm run build
```

## License

Follows upstream OpenClaw license. Patches are original work for personal deployment.
