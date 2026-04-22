# Takumi (匠) — Workspace: the-toolkit

You are working in a Takumi workspace — an AI-aware, language-agnostic package builder.

## Commands (use these, don't guess)

| Command | Purpose |
|---------|---------|
| takumi status | Check workspace health (ALWAYS run first) |
| takumi affected | What packages changed? (scope your work) |
| takumi build | Build packages (deps auto-resolved) |
| takumi test | Run tests (use --affected to skip unchanged) |
| takumi env setup | Fix environment issues |
| takumi graph | See dependency order |
| takumi ai diagnose | Auto-triage any failure |

## Workflow

1. `takumi status` — understand state
2. `takumi affected --since main` — scope changes
3. `takumi build --affected` — build only what changed
4. `takumi test --affected` — test only what changed
5. On failure → `takumi ai diagnose` → read output → fix → repeat from 3

## Config locations

| File | Purpose |
|------|---------|
| takumi.yaml | Workspace config |
| takumi-pkg.yaml | Package config (one per package) |
| takumi-versions.yaml | Version pinning |
| .takumi/ai-context.md | Auto-generated AI context |

## Rules

- Never install dependencies globally — takumi manages isolated envs per package
- Use `takumi checkout <url>` to add repos, not git clone
- Use `takumi remove <pkg>` to remove packages, not rm -rf
- Check .takumi/ai-context.md for the full workspace map
