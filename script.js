// Point this at your deployed backend (e.g. https://your-api.onrender.com/api).
// For local dev with `backend` running on port 5000, this default works as-is.
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000/api"
  : "https://YOUR-BACKEND-URL.onrender.com/api";

// Static fallback so the page still looks complete if the API is down or not deployed yet.
const FALLBACK_PROJECTS = [
  {
    year: "2026",
    title: "Ledger — real-time payments ledger",
    description: "Event-sourced ledger handling 40M+ transactions/day with sub-100ms reconciliation.",
    stack: "Node.js · Postgres · Kafka"
  },
  {
    year: "2025",
    title: "Pathfinder — internal deploy tool",
    description: "Cut deploy time from 22 minutes to 3 by parallelizing build & migration steps.",
    stack: "Go · Docker · AWS"
  },
  {
    year: "2024",
    title: "Signal — anomaly alerting service",
    description: "Statistical alerting layer on top of metrics pipelines; reduced false pages by 60%.",
    stack: "Python · Redis · gRPC"
  }
];

function projectRow(p) {
  const a = document.createElement(p.url ? "a" : "div");
  if (p.url) { a.href = p.url; a.target = "_blank"; a.rel = "noopener"; }
  a.className = "project";
  a.innerHTML = `
    <span class="project-year">${escapeHtml(p.year || "")}</span>
    <div>
      <p class="project-title">${escapeHtml(p.title)}</p>
      <p class="project-desc">${escapeHtml(p.description || "")}</p>
    </div>
    <span class="project-stack">${escapeHtml(p.stack || "")}</span>
  `;
  return a;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function loadProjects() {
  const list = document.getElementById("project-list");
  const status = document.getElementById("work-status");

  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("empty");

    list.innerHTML = "";
    data.forEach(p => list.appendChild(projectRow(p)));
    status.textContent = `${data.length} projects, live from the API`;
  } catch (err) {
    // Backend not deployed yet / unreachable — show the static fallback instead of an empty page.
    list.innerHTML = "";
    FALLBACK_PROJECTS.forEach(p => list.appendChild(projectRow(p)));
    status.textContent = "Showing sample data (API not connected yet)";
  }
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const statusEl = document.getElementById("form-status");
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  };

  statusEl.textContent = "Sending…";

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    statusEl.textContent = "Thanks — message sent.";
    form.reset();
  } catch (err) {
    statusEl.textContent = "Couldn't reach the server. Try emailing directly instead.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  document.getElementById("contact-form").addEventListener("submit", handleContactSubmit);
});
