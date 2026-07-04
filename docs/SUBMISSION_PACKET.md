# LaunchOps Submission Packet

Use this file to copy details into the BTL Runtime Hackathon submission form.

## Project name

LaunchOps

## Short description

LaunchOps is a sleek BTL runtime-powered workspace that turns rough hackathon product notes into a judge-ready launch plan. It generates positioning, MVP scope, a two-minute demo script, README bullets, risk fixes, a task board, and runtime proof from one project brief.

## BTL runtime endpoint used

```text
https://api.badtheorylabs.com/v1/chat/completions
```

The code calls the endpoint from `server.js`. The browser never receives the raw BTL API key.

## Runtime model/route

Default:

```text
deepseek-chat
```

If the BTL dashboard lists a different eligible DeepSeek route, use that route in the app's runtime model field or set:

```powershell
$env:BTL_MODEL="your_deepseek_route_here"
```

## Team

Team name:

```text
THE CALIPH
```

Member name:

```text
Jeffrey
```

Add any other teammates before submission if needed.

## GitHub repo link

```text
PASTE_PUBLIC_REPO_LINK_HERE
```

## 2-minute demo video link

```text
PASTE_DEMO_VIDEO_LINK_HERE
```

## 100-point rubric fit

- 30 pts - Use of BTL Runtime: backend calls `/v1/chat/completions`, keeps the key server-side, and shows runtime proof in the UI.
- 25 pts - Usefulness: helps teams turn messy ideas into demo-ready submission assets.
- 20 pts - Technical execution: local Node backend, clean frontend, configurable model route, graceful fallback if credits fail.
- 15 pts - Creativity: meta-hackathon command center focused on shipping better submissions.
- 10 pts - Presentation: sleek glassmorphism interface, tabbed artifacts, copy actions, and a tight demo script.

## Final submission text

LaunchOps is a BTL runtime-powered command center for hackathon builders. It turns rough project notes into a polished launch plan: positioning, MVP scope, demo script, README bullets, risk fixes, task board, and runtime proof. The frontend collects the brief, then the Node backend calls the BTL OpenAI-compatible runtime at `https://api.badtheorylabs.com/v1/chat/completions`. The API key stays server-side. The app defaults to a DeepSeek route for the starter-token grant and lets judges see the endpoint/model used in the runtime proof panel.
