export function renderProjects(data) {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR WORK</div>
        <h1>Projects</h1>
        <p class="subtitle">
          Everything you're building, in one place.
        </p>
      </div>
    </div>

    <div class="panel form-panel">
      <div class="panel-heading">
        <h2>Create a project</h2>
      </div>

      <form data-form="projects">
        <input class="field" name="name"
          placeholder="Project name" required maxlength="100">

        <div class="form-row">
          <input class="field" name="description"
            placeholder="What is this project about?"
            maxlength="250">

          <input class="field" name="deadline"
            type="date" aria-label="Project deadline">
        </div>

        <button class="button" style="margin-top:14px">
          + Create project
        </button>
      </form>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(270px,1fr))">
      ${data.projects.map(project => `
        <div class="panel">
          <div class="project-top">
            <strong>${escapeHTML(project.name)}</strong>
            <button class="delete-button"
              data-type="projects"
              data-delete="${project.id}">
              Delete
            </button>
          </div>

          <p class="subtitle">
            ${escapeHTML(project.description)}
          </p>

          <span class="tag">${project.status}</span>

          <div class="progress-track">
            <div class="progress-fill"
              style="width:${project.progress}%"></div>
          </div>

          <div class="progress-caption">
            ${project.progress}% complete
          </div>

          <div class="form-row">
            <button class="button secondary"
              data-type="projects"
              data-id="${project.id}"
              data-progress="${Math.min(100, project.progress + 10)}">
              +10% progress
            </button>
          </div>

          ${project.deadline ? `
            <p class="progress-caption">
              Deadline: ${project.deadline}
            </p>` : ""}
        </div>
      `).join("") || `
        <div class="panel empty-state">
          <strong>No projects yet</strong>
          Create your first project above.
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
