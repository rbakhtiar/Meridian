export function renderIntelligence(data) {
  const projects = data.projects;
  const goals = data.goals;
  const tasks = data.tasks;

  const completed = tasks.filter(task => task.done).length;
  const pending = tasks.length - completed;

  const averageProgress = projects.length
    ? Math.round(
        projects.reduce((sum, project) => sum + project.progress, 0)
        / projects.length
      )
    : 0;

  const overdue = tasks.filter(task =>
    !task.done &&
    task.due &&
    task.due < new Date().toISOString().slice(0, 10)
  );

  const stalled = projects.filter(project =>
    project.progress === 0
  );

  const insights = [];

  if (!projects.length) {
    insights.push([
      "Start with a project",
      "Create a project to begin building your productivity landscape."
    ]);
  }

  if (overdue.length) {
    insights.push([
      `${overdue.length} overdue task(s)`,
      "Review these tasks and decide whether to complete or reschedule them."
    ]);
  }

  if (stalled.length) {
    insights.push([
      `${stalled.length} project(s) haven't progressed`,
      "Consider defining the next milestone for these projects."
    ]);
  }

  if (pending > 0) {
    insights.push([
      `${pending} unfinished tasks`,
      "Review your outstanding tasks and prioritize the most important ones."
    ]);
  }

  if (projects.length && averageProgress >= 70) {
    insights.push([
      "Strong project momentum",
      "Your average project progress is looking positive. Keep moving."
    ]);
  }

  if (!insights.length) {
    insights.push([
      "Workspace looking good",
      "There are no obvious bottlenecks based on your current data."
    ]);
  }

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">WORKSPACE ANALYTICS</div>
        <h1>Intelligence</h1>
        <p class="subtitle">
          A clearer picture of how your work is progressing.
        </p>
      </div>
    </div>

    <div class="grid stats-grid">
      <div class="panel">
        <div class="stat-label">Average project progress</div>
        <div class="stat-number">${averageProgress}%</div>
      </div>

      <div class="panel">
        <div class="stat-label">Tasks completed</div>
        <div class="stat-number">${completed}</div>
      </div>

      <div class="panel">
        <div class="stat-label">Outstanding tasks</div>
        <div class="stat-number">${pending}</div>
      </div>

      <div class="panel">
        <div class="stat-label">Active goals</div>
        <div class="stat-number">${goals.length}</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <h2>Workspace insights</h2>
        <span class="tag">Automatic analysis</span>
      </div>

      ${insights.map(([title, description]) => `
        <div class="insight">
          <strong>${escapeHTML(title)}</strong>
          <p>${escapeHTML(description)}</p>
        </div>
      `).join("")}
    </div>

    <div class="panel" style="margin-top:18px">
      <div class="panel-heading">
        <h2>Project performance</h2>
      </div>

      ${projects.map(project => `
        <div class="list-item">
          <div class="project-top">
            <h3>${escapeHTML(project.name)}</h3>
            <strong>${project.progress}%</strong>
          </div>

          <div class="progress-track">
            <div class="progress-fill"
              style="width:${project.progress}%"></div>
          </div>
        </div>
      `).join("") || `
        <div class="empty-state">
          <strong>No performance data</strong>
          Create projects to see analytics.
        </div>
      `}
    </div>

    <p class="progress-caption" style="margin-top:16px">
      Insights are calculated from locally stored workspace data.
      They are not AI-generated predictions.
    </p>
  `;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[c]);
}
