export function renderDashboard(data) {
  const projects = data.projects;
  const tasks = data.tasks;
  const goals = data.goals;

  const completed = tasks.filter(task => task.done).length;
  const pending = tasks.length - completed;

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR WORKSPACE</div>
        <h1>Good to see you.</h1>
        <p class="subtitle">
          Here's what's happening across your work.
        </p>
      </div>

      <button class="button" data-view="tasks">
        View tasks →
      </button>
    </div>

    <div class="grid stats-grid">
      <div class="panel">
        <div class="stat-label">Active projects</div>
        <div class="stat-number">${projects.length}</div>
      </div>

      <div class="panel">
        <div class="stat-label">Your goals</div>
        <div class="stat-number">${goals.length}</div>
      </div>

      <div class="panel">
        <div class="stat-label">Completed tasks</div>
        <div class="stat-number">${completed}</div>
      </div>

      <div class="panel">
        <div class="stat-label">Remaining tasks</div>
        <div class="stat-number">${pending}</div>
      </div>
    </div>

    <div class="grid dashboard-grid">
      <div class="panel">
        <div class="panel-heading">
          <h2>Your projects</h2>
          <button class="button secondary" data-view="projects">
            All projects
          </button>
        </div>

        ${projects.length ? projects.map(project => `
          <div class="project-card">
            <div class="project-top">
              <strong>${escapeHTML(project.name)}</strong>
              <small>${project.progress}%</small>
            </div>

            <div class="progress-track">
              <div class="progress-fill"
                style="width:${project.progress}%"></div>
            </div>

            <div class="progress-caption">
              ${escapeHTML(project.description)}
            </div>
          </div>
        `).join("") : empty("No projects yet.")}
      </div>

      <div class="panel">
        <div class="panel-heading">
          <h2>Priority tasks</h2>
          <small>${pending} remaining</small>
        </div>

        ${tasks.filter(t => !t.done).slice(0, 6).map(task => `
          <div class="task-row">
            <input type="checkbox"
              data-task-check="${task.id}">
            <span>${escapeHTML(task.title)}</span>
          </div>
        `).join("") || empty("You're all caught up.")}
      </div>
    </div>

    <div class="panel" style="margin-top:18px">
      <div class="panel-heading">
        <h2>Goals in motion</h2>
        <button class="button secondary" data-view="goals">
          Explore goals
        </button>
      </div>

      ${goals.length ? goals.map(goal => `
        <div class="list-item">
          <h3>${escapeHTML(goal.name)}</h3>
          <p>${escapeHTML(goal.description)}</p>
          <div class="progress-track">
            <div class="progress-fill"
              style="width:${goal.progress}%"></div>
          </div>
          <div class="progress-caption">${goal.progress}% complete</div>
        </div>
      `).join("") : empty("Your goals will appear here.")}
    </div>
  `;
}

function empty(message) {
  return `<div class="empty-state">${message}</div>`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}
