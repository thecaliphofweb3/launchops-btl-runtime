# LaunchOps Demo Script

Use this as your word-for-word guide for the 2-minute demo video. Speak calmly and do not rush. The goal is to make the judges understand the problem, the BTL runtime call, and the value of the app.

## 0:00-0:15 - Opening

Say:

```text
Hi, I am Jeffrey from team THE CALIPH. This is LaunchOps, a BTL runtime-powered workspace for hackathon builders.

The problem is simple: teams often have good AI ideas, but they lose time turning those rough ideas into a focused demo, README, task plan, and submission story.
```

What to show:

- Show the top of the LaunchOps app.
- Keep the hero headline visible: “From idea to submission.”

## 0:15-0:35 - What LaunchOps Does

Say:

```text
LaunchOps takes a messy project brief and turns it into the exact assets a team needs before submission: positioning, MVP scope, a two-minute demo script, README bullets, risks, a task board, and runtime proof.
```

What to show:

- Scroll slightly to the project brief.
- Point out the project name, target user, user problem, BTL runtime use, messy notes, and model route.

## 0:35-0:55 - BTL Runtime Explanation

Say:

```text
The important part is that the AI generation is routed through the BTL runtime. The frontend sends this brief to my local Node backend. The backend keeps my API key private and calls the BTL OpenAI-compatible endpoint: /v1/chat/completions.

For this demo, the app is configured to use a DeepSeek route through BTL.
```

What to show:

- Show the runtime status pill.
- Show the model field, for example `deepseek-chat` or the exact DeepSeek route from your BTL dashboard.
- Do not show your raw API key.

## 0:55-1:10 - Generate

Say:

```text
Now I will generate the launch plan.
```

What to do:

- Click `Load sample` if the form is not already filled.
- Click `Generate launch plan`.
- Wait for the result.

If it returns live output, say:

```text
This response came through the live BTL runtime.
```

If it falls back because credits or route access fail, say:

```text
The app attempted the live BTL runtime call and preserved the gateway response in the proof panel. It also keeps the demo usable with a fallback plan, which is useful for handling runtime or billing issues gracefully.
```

## 1:10-1:35 - Show The Generated Artifacts

Say:

```text
The result is organized into tabs so a team can quickly use it. Positioning explains the product clearly. Scope narrows the build to what can actually ship. Demo gives a timed two-minute structure. Risks show what could break and how to fix it. Board turns the plan into tasks. README gives copy that can go straight into the repo.
```

What to show:

- Click `Positioning`.
- Click `Scope`.
- Click `Demo`.
- Click `Risks`.
- Click `Board`.
- Click `README`.
- Do not read every bullet. Just show that each section exists and is useful.

## 1:35-1:50 - Runtime Proof

Say:

```text
Here is the runtime proof. LaunchOps shows the endpoint, the selected model route, and the proof notes. The endpoint used is https://api.badtheorylabs.com/v1/chat/completions.
```

What to show:

- Scroll to the `Runtime proof` panel.
- Show `/v1/chat/completions`.
- Show the proof bullets.

## 1:50-2:00 - Closing

Say:

```text
LaunchOps helps builders go from idea chaos to a judge-ready submission in one BTL runtime-powered workflow. That is the project. Thank you.
```

What to show:

- End on the polished generated output or the runtime proof panel.

## Submission Details To Copy

Project name:

```text
LaunchOps
```

Short description:

```text
LaunchOps is a BTL runtime-powered workspace that turns rough hackathon product notes into a judge-ready launch plan, including positioning, MVP scope, demo script, README bullets, risks, task board, and runtime proof.
```

BTL endpoint used:

```text
https://api.badtheorylabs.com/v1/chat/completions
```

Team:

```text
THE CALIPH
```

Member:

```text
Jeffrey
```
