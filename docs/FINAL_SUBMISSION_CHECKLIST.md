# Final Submission Checklist

Deadline: July 5, 2026 at 15:00 UTC.

## Required by BTL

- [ ] GitHub repo or public code link
- [ ] 2-minute demo video
- [ ] Short description of what you built
- [ ] BTL runtime endpoint(s) used
- [ ] Team name and member names

## Before recording

- [ ] Start PowerShell in `C:\Users\Dell\Documents\Bad Theory Labs`
- [ ] Set `BTL_API_KEY`
- [ ] Set `BTL_BASE_URL=https://api.badtheorylabs.com/v1`
- [ ] Set `BTL_MODEL` to an eligible DeepSeek route from the BTL dashboard
- [ ] Run `npm start`
- [ ] Open `http://localhost:4173`
- [ ] Generate one successful launch plan
- [ ] Confirm runtime proof shows `/v1/chat/completions`

## Demo video structure

1. 0:00-0:15 - Explain that hackathon teams lose time turning rough ideas into submission-ready plans.
2. 0:15-0:35 - Show the LaunchOps brief, model field, and BTL runtime status.
3. 0:35-0:55 - Generate the plan through the BTL runtime.
4. 0:55-1:30 - Show positioning, scope, demo, risks, board, and README tabs.
5. 1:30-1:45 - Show the runtime proof panel with `/v1/chat/completions`.
6. 1:45-2:00 - Close with the judge hook.

## Repo safety

- [ ] No raw API key in README, source files, screenshots, or commits
- [ ] `.env` is not committed
- [ ] `.env.example` contains placeholders only
- [ ] README includes setup instructions
