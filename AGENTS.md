# Project Agent Rules

## Environment Variables

**Rule: All environment variables MUST be managed via EAS. Never put env vars inside `eas.json`.**

### How it works

Environment variables are stored in the EAS dashboard per project and per environment. To pull them locally:

```bash
# Pull dev env (all team members)
cd apps/app
EXPO_PUBLIC_APP_VARIANT=development eas env:pull --environment development   # → writes .env.local

# Pull staging env (all team members)
EXPO_PUBLIC_APP_VARIANT=staging eas env:pull --environment preview           # → writes .env.local

# Pull production env (lead only — requires production project access)
EXPO_PUBLIC_APP_VARIANT=production eas env:pull --environment production     # → writes .env.local
```

> [!IMPORTANT]
> **Always prefix with `EXPO_PUBLIC_APP_VARIANT=<env>`.**
> `app.config.js` uses `EXPO_PUBLIC_APP_VARIANT` to decide which Expo project ID to expose.
> Without it, EAS targets the wrong project and returns nothing.


### Rules

1. **Never add `env` keys inside `eas.json` build profiles.** The only exception is if EAS itself has no way to inject the variable (extremely rare).

2. **Never commit `.env*` files to git.** They are gitignored. Each developer pulls their own via `eas env:pull`.

3. **All new env vars must be added in the EAS dashboard first**, then documented in this file.

4. **CI pipelines use `eas env:pull` too** — or the variables are injected automatically by EAS Build, which reads from the dashboard at build/update time.

### Expo Project Split

This repo has two separate Expo projects:

| Project | EAS Project ID | Who has access |
|---|---|---|
| **Production** | `2b926d19-2f7e-47c7-8a8b-3113c4434caf` | Lead + CI bot only |
| **Dev/Staging** | `2021007d-da18-4957-9319-0f1e3c34401f` | All team members |

- Junior devs are **only** members of the Dev/Staging Expo project.
- Production OTA updates are **only** published via the CI `workflow_dispatch` pipeline.

### Environment → Channel mapping

| `EXPO_PUBLIC_APP_VARIANT` | EAS environment | Expo channel | Project used |
|---|---|---|---|
| `development` | `development` | `development` | Dev/Staging |
| `staging` | `preview` | `preview` | Dev/Staging |
| `production` | `production` | `production` | Production |
