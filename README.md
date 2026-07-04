# LaunchOps: BTL Runtime Hackathon Project

LaunchOps is the actual hackathon project: a BTL runtime-powered command center that turns rough AI product notes into a judge-ready launch plan.

The browser collects a project brief. The local backend keeps the API key private and calls the BTL OpenAI-compatible runtime at `/v1/chat/completions`.

## Included

- AI launch plan generator
- Runtime proof panel
- MVP scope, task board, risk review, demo script, and README bullets
- Server-side BTL runtime call
- Demo mode when no API key is set
- Original event launch page preserved at `index.html`

## Run locally

```bash
npm start
```

Open:

```text
http://localhost:4173
```

## Deploy to Vercel

LaunchOps is Vercel-ready. The frontend is served from `app/`, and the BTL calls run through serverless functions in `api/`.

Set these environment variables in Vercel before deploying:

```text
BTL_API_KEY=your_btl_runtime_key_here
BTL_BASE_URL=https://api.badtheorylabs.com/v1
BTL_MODEL=deepseek-chat
```

Then deploy the GitHub repo to Vercel. The deployed link will work on mobile phones and other devices without your laptop being on.

Do not put your BTL key in the frontend code or in GitHub. Keep it only as a Vercel environment variable.

If Vercel shows `FUNCTION_INVOCATION_FAILED`, open the Vercel project logs and check the API route that crashed. The app uses:

- `/api/status`
- `/api/launch-plan`

Both routes import shared runtime logic from `lib/launchops.js`, so the serverless functions do not depend on the local `server.js` process.

On Windows, open PowerShell in this folder first:

```text
C:\Users\Dell\Documents\Bad Theory Labs
```

## Enable live BTL runtime calls

Set these environment variables before running the server:

```bash
BTL_API_KEY=your_btl_runtime_key_here
BTL_BASE_URL=https://api.badtheorylabs.com/v1
BTL_MODEL=deepseek-chat
```

Without `BTL_API_KEY`, the app runs in demo mode so judges can still inspect the complete flow. With `BTL_API_KEY`, the backend calls:

```text
POST /v1/chat/completions
```

The backend accepts either `https://api.badtheorylabs.com/v1` from the BTL email or `https://api.badtheorylabs.com`; it normalizes the final request URL before calling the runtime.

If BTL returns a credits/provider error, LaunchOps now shows a graceful fallback plan and preserves the runtime error in the proof panel. For the July 4 follow-up credit grant, use a DeepSeek route from the BTL dashboard. The app defaults to `deepseek-chat`; if your dashboard shows a different DeepSeek route name, enter that model in the app's runtime model field or set `BTL_MODEL`.

## PowerShell setup after receiving your BTL key

```powershell
$env:BTL_API_KEY="paste_your_raw_key_here"
$env:BTL_BASE_URL="https://api.badtheorylabs.com/v1"
$env:BTL_MODEL="deepseek-chat"
npm start
```

Then open:

```text
http://localhost:4173
```

## Submission angle

LaunchOps helps hackathon builders convert raw ideas into the assets judges care about: clear positioning, a narrow MVP, runtime proof, a two-minute demo, risk fixes, and README content.
