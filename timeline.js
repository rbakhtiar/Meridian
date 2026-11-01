export function renderTimeline(data) {
  const events = [
    ...data.projects.map(project => ({
      name: project.name,
      type: "Project",
      date: project.deadline
    })),

    ...data.tasks.filter(task => !task.done).map(task => ({
      name: task.title,
      type: "Task",
      date: task.due
    }))
  ];

  events.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  const dated = events.filter(event => event.date);
  const undated = events.filter(event => !event.date);

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR TIME</div>
        <h1>Timeline</h1>
        <p class="subtitle">
          See your upcoming work and important milestones.
        </p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <h2>Upcoming milestones</h2>
        <small>${dated.length} scheduled</small>
      </div>

      ${dated.length ? dated.map(event => `
        <div class="timeline-item">
          <div class="timeline-date">
            ${formatDate(event.date)}
          </div>
          <h3>${escapeHTML(event.name)}</h3>
          <p class="subtitle">${event.type}</p>
        </div>
      `).join("") : `
        <div class="empty-state">
          <strong>No scheduled milestones</strong>
          Add deadlines to your projects and tasks.
        </div>
      `}
    </div>

    <div class="panel" style="margin-top:18px">
      <div class="panel-heading">
        <h2>Unscheduled work</h2>
        <small>${undated.length} items</small>
      </div>

      ${undated.map(event => `
        <div class="list-item">
          <h3>${escapeHTML(event.name)}</h3>
          <p>${event.type} · No deadline assigned</p>
        </div>
      `).join("") || `
        <div class="empty-state">
          Everything has a date.
        </div>
      `}
    </div>
  `;
}

function formatDate(date) {
  return new Date(date + "T12:00:00").toLocaleDateString(
    undefined,
    { day: "numeric", month: "long", year: "numeric" }
  );
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[c]);
}
