export function renderTasks(data) {
  const projects = data.projects;

  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">EXECUTION</div>
        <h1>Tasks</h1>
        <p class="subtitle">
          Small actions. Meaningful progress.
        </p>
      </div>
    </div>

    <div class="panel form-panel">
      <h2>Create a task</h2>

      <form data-form="tasks">
        <input class="field" name="title"
          placeholder="What needs to get done?"
          required maxlength="150">

        <div class="form-row">
          <select class="field" name="project">
            <option value="">No associated project</option>
            ${projects.map(project => `
              <option value="${escapeHTML(project.name)}">
                ${escapeHTML(project.name)}
              </option>
            `).join("")}
          </select>

          <input class="field" name="due"
            type="date" aria-label="Due date">
        </div>

        <button class="button" style="margin-top:14px">
          + Add task
        </button>
      </form>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <h2>All tasks</h2>
        <small>${data.tasks.length} total</small>
      </div>

      ${data.tasks.map(task => `
        <div class="task-row ${task.done ? "done" : ""}">
          <input type="checkbox"
            data-task-check="${task.id}"
            ${task.done ? "checked" : ""}>

          <span>${escapeHTML(task.title)}</span>

          <span class="task-meta">
            ${escapeHTML(task.project || "Personal")}
            ${task.due ? " · " + escapeHTML(task.due) : ""}
          </span>

          <button class="delete-button"
            data-type="tasks"
            data-delete="${task.id}">
            ×
          </button>
        </div>
      `).join("") || `
        <div class="empty-state">
          <strong>No tasks yet</strong>
          Add your first task above.
        </div>
      `}
    </div>
  `;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[c]);
}
