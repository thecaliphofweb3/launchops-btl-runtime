const BTL_BASE_URL = (process.env.BTL_BASE_URL || "https://api.badtheorylabs.com").replace(/\/$/, "");
const BTL_MODEL = process.env.BTL_MODEL || "deepseek-chat";
const BTL_API_KEY = process.env.BTL_API_KEY || "";
const BTL_CHAT_COMPLETIONS_URL = `${BTL_BASE_URL.replace(/\/v1$/, "")}/v1/chat/completions`;

function cleanInput(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, 6000);
}

function runtimeModel(input = {}) {
  return cleanInput(input.model, BTL_MODEL).slice(0, 120);
}

function buildPrompt(input) {
  const projectName = cleanInput(input.projectName, "Untitled project");
  const audience = cleanInput(input.audience, "busy hackathon judges");
  const problem = cleanInput(input.problem, "The problem is still being explored.");
  const notes = cleanInput(input.notes, "No extra notes provided.");
  const runtimeUse = cleanInput(input.runtimeUse, "Use the BTL runtime for the core AI workflow.");
  const tone = cleanInput(input.tone, "confident, practical, and demo-ready");
  const model = runtimeModel(input);

  return [
    {
      role: "system",
      content:
        "You are LaunchOps, an expert hackathon copilot. Produce concise, practical, demo-ready output. Return valid JSON only."
    },
    {
      role: "user",
      content: `Create a launch plan for a BTL Runtime Hackathon project.

Project name: ${projectName}
Audience: ${audience}
Problem: ${problem}
Runtime use: ${runtimeUse}
Runtime model/route: ${model}
Tone: ${tone}
Raw notes:
${notes}

Return JSON with exactly these keys:
{
  "positioning": "one sharp paragraph",
  "runtimeProof": ["3 bullets showing how BTL runtime is central"],
  "mvpScope": ["5 build items"],
  "demoScript": ["5 timed beats for a 2-minute demo"],
  "readmeBullets": ["6 bullets for the README"],
  "risks": [{"risk":"short risk", "fix":"short mitigation"}],
  "taskBoard": [{"lane":"Now|Next|Later", "task":"short task"}],
  "judgeHook": "one memorable sentence"
}`
    }
  ];
}

function demoPlan(input = {}) {
  const name = cleanInput(input.projectName, "LaunchOps");
  const problem = cleanInput(input.problem, "teams lose time turning messy ideas into a shippable demo");
  const runtimeUse = cleanInput(input.runtimeUse, "BTL runtime generates launch plans, risks, demo scripts, and README content");
  const model = runtimeModel(input);

  return {
    mode: "demo",
    endpoint: BTL_CHAT_COMPLETIONS_URL,
    model,
    content: {
      positioning: `${name} helps builders turn rough notes into a judge-ready launch plan. It focuses the product around a clear user pain, then converts the idea into scope, demo beats, README bullets, and risks so the team can spend more time shipping.`,
      runtimeProof: [
        `The core planning workflow is designed to call ${BTL_CHAT_COMPLETIONS_URL} through the server.`,
        `The selected runtime model/route is ${model}.`,
        "The prompt asks the BTL runtime to produce structured JSON for scope, demo, risks, and README output.",
        "The API key stays server-side, so the client proves gateway usage without exposing credentials."
      ],
      mvpScope: [
        "Capture project name, target audience, problem, notes, and intended runtime use.",
        "Generate a structured launch plan through the BTL-compatible chat completions endpoint.",
        "Render scope, demo script, task board, risks, README bullets, and runtime proof in one workspace.",
        "Allow teams to copy each section into their repo or demo notes.",
        "Show runtime status so judges can verify whether live BTL calls are enabled."
      ],
      demoScript: [
        "0:00-0:15: Show the messy project idea and explain the time pressure.",
        "0:15-0:45: Fill the LaunchOps brief with the user problem and runtime strategy.",
        "0:45-1:20: Generate the plan and show the BTL runtime proof panel.",
        "1:20-1:45: Walk through the demo script, task board, and risk fixes.",
        "1:45-2:00: End with the judge hook and the next feature."
      ],
      readmeBullets: [
        `Project: ${name}`,
        `Problem: ${problem}`,
        `BTL runtime use: ${runtimeUse}`,
        "Core workflow: turn rough notes into a shippable launch plan.",
        "How to run: set BTL_API_KEY, then start the local server.",
        "Demo proof: the server calls /v1/chat/completions when a key is present."
      ],
      risks: [
        { risk: "The live runtime key is missing during demo.", fix: "Use demo mode while showing the server code path and env setup." },
        { risk: "The idea feels too broad.", fix: "Use the MVP scope section to narrow to one working user flow." },
        { risk: "Judges cannot verify runtime usage.", fix: "Open the runtime proof panel and server call in the repo." }
      ],
      taskBoard: [
        { lane: "Now", task: "Connect BTL_API_KEY and confirm the endpoint returns structured JSON." },
        { lane: "Now", task: "Record a 2-minute demo around one successful generated plan." },
        { lane: "Next", task: "Add export to README and markdown." },
        { lane: "Next", task: "Save prior project briefs locally." },
        { lane: "Later", task: "Add multi-provider comparison through the runtime gateway." }
      ],
      judgeHook: "LaunchOps turns the chaos of a hackathon idea into a credible ship plan in one runtime-powered click."
    }
  };
}

function runtimeFallback(input, error) {
  const fallback = demoPlan(input);
  const message = error instanceof Error ? error.message : String(error);

  return {
    ...fallback,
    mode: "runtime-fallback",
    runtimeError: message,
    content: {
      ...fallback.content,
      runtimeProof: [
        `LaunchOps attempted a live BTL runtime call to ${BTL_CHAT_COMPLETIONS_URL}.`,
        `BTL returned an error before generation completed: ${message}`,
        "The app kept the demo usable with a local fallback plan while preserving the runtime attempt for judges to inspect."
      ],
      risks: [
        {
          risk: "The BTL workspace has insufficient credits or no connected provider route.",
          fix: "Add credits, connect a provider key, or switch BTL_MODEL to an explicitly free route in the BTL dashboard."
        },
        ...fallback.content.risks
      ]
    }
  };
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("The model did not return JSON.");
    return JSON.parse(match[0]);
  }
}

async function callBtlRuntime(input) {
  const messages = buildPrompt(input);
  const model = runtimeModel(input);
  const response = await fetch(BTL_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${BTL_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.55,
      messages
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`BTL runtime returned ${response.status}: ${text.slice(0, 400)}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content || "{}";
  return {
    mode: "live",
    endpoint: BTL_CHAT_COMPLETIONS_URL,
    model,
    content: safeJsonParse(content)
  };
}

function runtimeStatus() {
  return {
    liveRuntimeEnabled: Boolean(BTL_API_KEY),
    endpoint: BTL_CHAT_COMPLETIONS_URL,
    model: BTL_MODEL
  };
}

async function createLaunchPlan(input = {}) {
  try {
    return BTL_API_KEY ? await callBtlRuntime(input) : demoPlan(input);
  } catch (error) {
    if (BTL_API_KEY) return runtimeFallback(input, error);
    throw error;
  }
}

module.exports = { createLaunchPlan, demoPlan, runtimeStatus };
