export function renderGoals(data) {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR DIRECTION</div>
        <h1>Goals</h1>
        <p class="subtitle">
          Define where you're going. Track how far you've come.
        </p>
      </div>
    </div>

    <div class="panel form-panel">
      <h2>Create a goal</h2>

      <form data-form="goals">
        <input class="field" name="name"
          placeholder="What do you want to achieve?"
          required maxlength="100">

        <input class="field" name="description"
          placeholder="Describe your goal"
          style="margin-top:10px" maxlength="250">

        <button class="button" style="margin-top:14px">
          + Add goal
        </button>
      </form>
    </div>

    <div class="grid"
      style="grid-template-columns:repeat(auto-fit,minmax(270px,1fr))">

      ${data.goals.map(goal => `
        <div class="panel">
          <div class="project-top">
            <span class="eyebrow">OBJECTIVE</span>
            <button class="delete-button"
              data-type="goals"
              data-delete="${goal.id}">
              Delete
            </button>
          </div>

          <h2 style="font-size:24px;margin-top:8px">
            ${escapeHTML(goal.name)}
          </h2>

          <p class="subtitle">
            ${escapeHTML(goal.description)}
          </p>

          <div style="font-size:34px;margin-top:23px">
            ${goal.progress}%
          </div>

          <div class="progress-track">
            <div class="progress-fill"
              style="width:${goal.progress}%"></div>
          </div>

          <div class="form-row">
            <button class="button secondary"
              data-type="goals"
              data-id="${goal.id}"
              data-progress="${Math.min(100, goal.progress + 10)}">
              Update progress
            </button>
          </div>
        </div>
      `).join("") || `
        <div class="panel empty-state">
          <strong>No goals yet</strong>
          Your next big achievement starts here.
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
