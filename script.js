const kickoff = new Date("2026-07-03T15:00:00Z").getTime();
const units = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const diff = Math.max(0, kickoff - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  units.days.textContent = pad(days);
  units.hours.textContent = pad(hours);
  units.minutes.textContent = pad(minutes);
  units.seconds.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const ideas = {
  agent: [
    "A meeting-to-momentum agent that turns a messy voice note into tasks, owners, calendar blocks, and a follow-up brief using BTL runtime tool calls.",
    "A founder support agent that reads a product update, drafts customer replies, and routes each reply through a different model behind the runtime.",
    "A personal grant scout that watches a saved criteria file and produces ranked opportunities with source-backed next steps."
  ],
  research: [
    "A paper triage desk that summarizes PDFs into claims, methods, limitations, and replication ideas with a visible BTL runtime trace.",
    "A clinical-trial explainer that converts dense public records into plain-language patient questions and doctor discussion prompts.",
    "A policy brief companion that compares stakeholder arguments and flags missing evidence before a live debate."
  ],
  memory: [
    "A memory layer for project teams that turns Discord-style updates into searchable decisions, blockers, and reusable context packs.",
    "A customer research vault that clusters interview notes and retrieves exact themes while preserving participant privacy.",
    "A study partner that remembers a learner's weak spots and adapts practice prompts across the weekend."
  ],
  creative: [
    "A pitch-room simulator that plays investor, buyer, and skeptic roles while tracking how the founder's answer improves.",
    "A script-to-storyboard assistant that creates shot lists, narration, and production constraints for a 2-minute demo.",
    "A brand voice lab that generates, tests, and scores launch copy variants through multiple providers behind BTL."
  ],
  ops: [
    "A support inbox copilot that classifies tickets, drafts replies, and escalates edge cases with model routing through the gateway.",
    "A compliance checklist bot that turns a new feature spec into launch risks, owners, and release gates.",
    "A usage watchdog that reads API logs and suggests cost, quality, and latency improvements for runtime-backed apps."
  ]
};

const ideaButton = document.querySelector("#idea-button");
const trackSelect = document.querySelector("#track");
const ideaOutput = document.querySelector("#idea-output");

ideaButton.addEventListener("click", () => {
  const pool = ideas[trackSelect.value];
  const pick = pool[Math.floor(Math.random() * pool.length)];
  ideaOutput.textContent = pick;
});

const form = document.querySelector("#registration-form");
const formNote = document.querySelector("#form-note");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem("btl-hackathon-registration", JSON.stringify({
    ...data,
    registeredAt: new Date().toISOString()
  }));
  formNote.textContent = "You are registered in this local preview. Next step: join Discord and watch for your runtime key.";
  form.reset();
});
