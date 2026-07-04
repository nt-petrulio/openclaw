# Mission Control

Ops hub for OpenClaw work: dashboard views, taskboard, project status, memory/docs shortcuts, cron visibility, and deploy tracking.

The app is served under `/mc` through `basePath` in `next.config.ts`.

## Local Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000/mc`.

## Checks

```bash
npm run lint
npm run build
```

## Current Surfaces

- `/mc/dashboard` - main ops dashboard.
- `/mc/dashboard/taskboard` - task board backed by backlog/manual task persistence.
- `/mc/dashboard/projects` - project status overview.
- `/mc/dashboard/agent-runs` - approval queue for Pipeline Scout/future agent runs, with approve/reject/reopen controls and no send action.
- `/mc/dashboard/calendar` - upcoming work view.
- `/mc/dashboard/docs` - documentation shortcuts.
- `/mc/dashboard/memory` - memory file shortcuts.
- `/mc/dashboard/deploy` - deployment status view.
- `/mc/api/agents/finance/status` - safe Finance Agent runtime status; never includes raw balances.
- `/mc/api/agent-runs` - approval-first agent run records for Pipeline Scout and future agents; no external sends.

## Deployment Notes

- Keep the `/mc` base path unless the OpenClaw gateway route changes.
- Do not push directly to `main`; update the feature branch and PR for review.
- Local task persistence is file-backed, so treat production persistence as a follow-up before relying on this as a shared task system.
