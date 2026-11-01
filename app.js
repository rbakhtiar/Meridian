import { getData, addItem, updateItem, deleteItem } from "./data.js";

import { renderDashboard } from "./dashboard.js";
import { renderProjects } from "./projects.js";
import { renderGoals } from "./goals.js";
import { renderTasks } from "./tasks.js";
import { renderTimeline } from "./timeline.js";
import { renderIntelligence } from "./intelligence.js";

const app = document.getElementById("app");
const breadcrumb = document.getElementById("breadcrumb");

let currentView = "dashboard";

const views = {
  dashboard: ["Overview", renderDashboard],
  projects: ["Projects", renderProjects],
  goals: ["Goals", renderGoals],
  tasks: ["Tasks", renderTasks],
  timeline: ["Timeline", renderTimeline],
  intelligence: ["Intelligence", renderIntelligence]
};

function refresh() {
  const [name, renderer] = views[currentView];

  breadcrumb.textContent = `Workspace / ${name}`;
  app.innerHTML = renderer(getData());

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === currentView
    );
  });
}

function navigate(view) {
  if (!views[view]) return;
  currentView = view;
  refresh();
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]");

  if (nav) {
    navigate(nav.dataset.view);
    return;
  }

  const remove = event.target.closest("[data-delete]");

  if (remove) {
    const confirmed = confirm("Delete this item?");
    if (!confirmed) return;

    deleteItem(remove.dataset.type, remove.dataset.delete);
    refresh();
    return;
  }

  const progressButton = event.target.closest("[data-progress]");

  if (progressButton) {
    const type = progressButton.dataset.type;
    const id = progressButton.dataset.id;
    const value = Number(progressButton.dataset.progress);

    updateItem(type, id, { progress: value });
    refresh();
  }
});

document.addEventListener("change", event => {
  const checkbox = event.target.closest("[data-task-check]");

  if (checkbox) {
    updateItem("tasks", checkbox.dataset.taskCheck, {
      done: checkbox.checked
    });
    refresh();
  }
});

document.addEventListener("submit", event => {
  const form = event.target;

  if (!form.matches("[data-form]")) return;

  event.preventDefault();

  const formData = new FormData(form);
  const type = form.dataset.form;

  if (type === "projects") {
    addItem("projects", {
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      progress: 0,
      status: "Active",
      deadline: formData.get("deadline")
    });
  }

  if (type === "goals") {
    addItem("goals", {
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      progress: 0
    });
  }

  if (type === "tasks") {
    addItem("tasks", {
      title: formData.get("title").trim(),
      project: formData.get("project"),
      due: formData.get("due"),
      done: false
    });
  }

  refresh();
});

const overlay = document.getElementById("commandOverlay");
const commandInput = document.getElementById("commandInput");
const commandResults = document.getElementById("commandResults");

function openCommand() {
  overlay.classList.remove("hidden");
  commandInput.value = "";
  commandInput.focus();
  showCommands("");
}

function closeCommand() {
  overlay.classList.add("hidden");
}

function showCommands(query) {
  const filtered = Object.entries(views).filter(([key, value]) =>
    `${key} ${value[0]}`.toLowerCase().includes(query.toLowerCase())
  );

  commandResults.innerHTML = filtered.map(([key, value]) => `
    <button class="command-result" data-command="${key}">
      ${value[0]}
    </button>
  `).join("");
}

document.getElementById("commandButton").addEventListener(
  "click",
  openCommand
);

commandInput.addEventListener("input", () => {
  showCommands(commandInput.value);
});

commandResults.addEventListener("click", event => {
  const button = event.target.closest("[data-command]");
  if (!button) return;

  navigate(button.dataset.command);
  closeCommand();
});

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommand();
  }

  if (event.key === "Escape") closeCommand();
});

overlay.addEventListener("click", event => {
  if (event.target === overlay) closeCommand();
});

refresh();
