const form = document.querySelector("#brief-form");
const statusStrip = document.querySelector("#runtime-status");
const runtimeMeta = document.querySelector("#runtime-meta");
const resultTitle = document.querySelector("#result-title");
const emptyState = document.querySelector("#empty-state");
const resultStack = document.querySelector("#result-stack");
const copyAllButton = document.querySelector("#copy-all");
const copyCurrentButton = document.querySelector("#copy-current");
const demoFillButton = document.querySelector("#demo-fill");
const briefScore = document.querySelector("#brief-score");
const briefProgress = document.querySelector("#brief-progress");
const modeMetric = document.querySelector("#mode-metric");
const artifactMetric = document.querySelector("#artifact-metric");
const endpointMetric = document.querySelector("#endpoint-metric");
const tabButtons = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const presetButtons = [...document.querySelectorAll("[data-preset]")];

let latestPlanText = "";
let latestSections = {};
let activeTab = "positioning";

const presets = {
  research: {
    projectName: "PaperTrail",
    model: "deepseek-chat",
    audience: "research students and independent scientists",
    problem: "Research teams waste time turning dense papers into testable claims, limitations, and follow-up experiments.",
    runtimeUse: "The backend sends paper notes to the BTL runtime through /v1/chat/completions and receives structured claims, methods, limitations, and replication ideas.",
    notes: "Needs to feel credible for judges. Show a paper summary, limitations, and next experiments. Runtime proof must be obvious. Keep the demo under two minutes.",
    tone: "research-oriented and careful"
  },
  ops: {
    projectName: "OpsPilot",
    model: "deepseek-chat",
    audience: "small support and operations teams",
    problem: "Tiny teams drown in repetitive operational decisions and need a fast way to classify requests, draft replies, and spot escalations.",
    runtimeUse: "The server routes each support brief through the BTL runtime at /v1/chat/completions and turns it into triage, suggested reply, risk level, and owner.",
    notes: "Dashboard style. Show one messy support issue becoming a clean action plan. Mention that BTL can sit in front of multiple models.",
    tone: "technical and precise"
  },
  creator: {
    projectName: "PitchFrame",
    model: "deepseek-chat",
    audience: "creators preparing product demos",
    problem: "Creators know what they built but struggle to turn it into a sharp two-minute story that wins attention.",
    runtimeUse: "The app calls the BTL runtime to transform rough creator notes into a demo arc, hook, objections, and publish-ready launch copy.",
    notes: "Make it stylish. Needs a strong hook, copy assets, demo outline, and risk list. The runtime should be central to the story.",
    tone: "founder-friendly and punchy"
  }
};

function text(value) {
  return String(value ?? "");
}

function setField(name, value) {
  const field = form.elements[name];
  if (field) field.value = value;
}

function renderList(id, items) {
  const node = document.querySelector(id);
  node.innerHTML = "";
  for (const item of Array.isArray(items) ? items : []) {
    const li = document.createElement("li");
    li.textContent = text(item);
    node.appendChild(li);
  }
}

function normalizePlan(plan) {
  return {
    positioning: plan.positioning || "No positioning returned.",
    runtimeProof: Array.isArray(plan.runtimeProof) ? plan.runtimeProof : [],
    mvpScope: Array.isArray(plan.mvpScope) ? plan.mvpScope : [],
    demoScript: Array.isArray(plan.demoScript) ? plan.demoScript : [],
    readmeBullets: Array.isArray(plan.readmeBullets) ? plan.readmeBullets : [],
    risks: Array.isArray(plan.risks) ? plan.risks : [],
    taskBoard: Array.isArray(plan.taskBoard) ? plan.taskBoard : [],
    judgeHook: plan.judgeHook || "A sharper demo starts with a sharper plan."
  };
}

function setActiveTab(tab) {
  activeTab = tab;
  for (const button of tabButtons) {
    button.classList.toggle("active", button.dataset.tab === tab);
    button.setAttribute("aria-selected", String(button.dataset.tab === tab));
  }
  for (const panel of panels) {
    panel.classList.toggle("active", panel.dataset.panel === tab);
  }
}

function buildSectionText(plan, response) {
  const mode = response.mode === "live"
    ? "Live BTL runtime"
    : response.mode === "runtime-fallback"
      ? "BTL attempted, fallback generated"
      : "Demo mode";

  return {
    positioning: [
      "Positioning",
      plan.positioning,
      "",
      "Judge hook",
      plan.judgeHook
    ].join("\n"),
    scope: ["MVP scope", ...plan.mvpScope.map((item) => `- ${item}`)].join("\n"),
    demo: ["2-minute demo", ...plan.demoScript.map((item, index) => `${index + 1}. ${item}`)].join("\n"),
    risks: [
      "Risk repair",
      ...plan.risks.map((item) => `- ${item.risk}: ${item.fix}`)
    ].join("\n"),
    board: [
      "Task board",
      ...plan.taskBoard.map((item) => `- ${item.lane}: ${item.task}`)
    ].join("\n"),
    readme: ["README bullets", ...plan.readmeBullets.map((item) => `- ${item}`)].join("\n"),
    proof: [
      "Runtime proof",
      `Mode: ${mode}`,
      `Endpoint: ${response.endpoint}`,
      `Model: ${response.model}`,
      response.runtimeError ? `Runtime error: ${response.runtimeError}` : "",
      ...plan.runtimeProof.map((item) => `- ${item}`)
    ].filter(Boolean).join("\n")
  };
}

function renderPlan(response) {
  const plan = normalizePlan(response.content || {});
  const modeLabel = response.mode === "live"
    ? "Live BTL runtime"
    : response.mode === "runtime-fallback"
      ? "BTL attempted, fallback generated"
      : "Demo mode";

  resultTitle.textContent = `${modeLabel} plan generated`;
  emptyState.classList.add("hidden");
  resultStack.classList.remove("hidden");
  modeMetric.textContent = response.mode === "live" ? "Live" : response.mode === "runtime-fallback" ? "Fallback" : "Demo";
  artifactMetric.textContent = "6";
  endpointMetric.textContent = "/chat";

  document.querySelector("#positioning").textContent = plan.positioning;
  document.querySelector("#judge-hook").textContent = plan.judgeHook;
  renderList("#runtime-proof", plan.runtimeProof);
  renderList("#mvp-scope", plan.mvpScope);
  renderList("#demo-script", plan.demoScript);
  renderList("#readme-bullets", plan.readmeBullets);

  const riskList = document.querySelector("#risk-list");
  riskList.innerHTML = "";
  for (const item of plan.risks) {
    const risk = document.createElement("div");
    risk.className = "risk-item";
    const riskTitle = document.createElement("strong");
    const riskFix = document.createElement("span");
    riskTitle.textContent = text(item.risk);
    riskFix.textContent = text(item.fix);
    risk.append(riskTitle, riskFix);
    riskList.appendChild(risk);
  }

  const taskBoard = document.querySelector("#task-board");
  taskBoard.innerHTML = "";
  for (const item of plan.taskBoard) {
    const task = document.createElement("div");
    task.className = "task-item";
    const lane = document.createElement("span");
    const taskText = document.createElement("strong");
    lane.textContent = text(item.lane);
    taskText.textContent = text(item.task);
    task.append(lane, taskText);
    taskBoard.appendChild(task);
  }

  latestSections = buildSectionText(plan, response);
  latestPlanText = [
    latestSections.proof,
    "",
    latestSections.positioning,
    "",
    latestSections.scope,
    "",
    latestSections.demo,
    "",
    latestSections.risks,
    "",
    latestSections.board,
    "",
    latestSections.readme
  ].join("\n");

  setActiveTab("positioning");
}

function updateBriefScore() {
  const fields = ["projectName", "audience", "problem", "runtimeUse", "notes", "model"];
  const total = fields.reduce((sum, name) => {
    const value = form.elements[name]?.value.trim() || "";
    return sum + Math.min(value.length / (name === "notes" ? 180 : 90), 1);
  }, 0);
  const score = Math.round((total / fields.length) * 100);
  briefScore.textContent = `${score}%`;
  briefProgress.style.width = `${score}%`;
}

async function loadStatus() {
  try {
    const response = await fetch("/api/status");
    const status = await response.json();
    const mode = status.liveRuntimeEnabled ? "Live BTL runtime" : "Demo mode";
    statusStrip.textContent = `${mode} | ${status.model}`;
    statusStrip.classList.toggle("live", status.liveRuntimeEnabled);
    runtimeMeta.textContent = status.endpoint;
    endpointMetric.textContent = status.endpoint.includes("/v1/chat/completions") ? "/chat" : "/v1";
  } catch {
    statusStrip.textContent = "Local server unavailable";
  }
}

async function copyText(value, button, label) {
  if (!value) return;
  await navigator.clipboard.writeText(value);
  const original = button.textContent;
  button.textContent = label;
  setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

form.addEventListener("input", updateBriefScore);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector(".generate-button");
  button.disabled = true;
  button.classList.add("loading");
  button.querySelector("span").textContent = "Generating...";
  resultTitle.textContent = "Asking the BTL runtime...";

  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/launch-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Generation failed.");
    renderPlan(data);
  } catch (error) {
    resultTitle.textContent = "Something needs attention";
    emptyState.classList.remove("hidden");
    emptyState.textContent = "";
    const title = document.createElement("strong");
    const message = document.createElement("span");
    title.textContent = "Generation failed.";
    message.textContent = text(error.message);
    emptyState.append(title, message);
  } finally {
    button.disabled = false;
    button.classList.remove("loading");
    button.querySelector("span").textContent = "Generate launch plan";
  }
});

for (const button of tabButtons) {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
}

for (const button of presetButtons) {
  button.addEventListener("click", () => {
    const preset = presets[button.dataset.preset];
    for (const [name, value] of Object.entries(preset)) setField(name, value);
    for (const item of presetButtons) item.classList.toggle("active", item === button);
    updateBriefScore();
  });
}

demoFillButton.addEventListener("click", () => {
  const button = presetButtons.find((item) => item.dataset.preset === "creator");
  button.click();
  document.querySelector("#brief-form").scrollIntoView({ behavior: "smooth", block: "start" });
});

copyAllButton.addEventListener("click", () => copyText(latestPlanText, copyAllButton, "Copied"));
copyCurrentButton.addEventListener("click", () => {
  copyText(latestSections[activeTab] || "", copyCurrentButton, "Copied");
});

updateBriefScore();
loadStatus();
