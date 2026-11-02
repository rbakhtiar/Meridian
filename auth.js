const USERS_KEY = "meridian_accounts_v1";
const SESSION_KEY = "meridian_session_v1";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const result = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 200000,
      hash: "SHA-256"
    },
    key,
    256
  );

  return Array.from(new Uint8Array(result))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export function getCurrentUser() {
  const session = localStorage.getItem(SESSION_KEY);

  if (!session) return null;

  try {
    const user = getUsers().find(item => item.id === session);

    if (!user) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  location.reload();
}

export function renderAuth(onAuthenticated) {
  const app = document.getElementById("app");

  document.body.classList.add("auth-mode");

  let mode = "login";

  function render(error = "") {
    const signup = mode === "signup";

    app.innerHTML = `
      <div class="auth-screen">

        <section class="auth-visual">
          <div class="auth-brand">
            <div class="auth-brand-mark">M</div>
            <span>Meridian</span>
          </div>

          <div class="auth-message">
            <h1>Your work,<br>connected.</h1>
            <p>
              A thoughtful space for your projects,
              goals and everything you're building.
            </p>
          </div>

          <div class="auth-footer">
            Clarity in every direction.
          </div>
        </section>

        <section class="auth-form-area">
          <div class="auth-form-container">

            <h2>${signup ? "Create your account" : "Welcome back."}</h2>

            <p class="auth-description">
              ${signup
                ? "Start building your personal workspace."
                : "Sign in to continue to your workspace."}
            </p>

            ${error ? `
              <div class="auth-error" role="alert">
                ${escapeHTML(error)}
              </div>
            ` : ""}

            <form id="authForm">

              ${signup ? `
                <div class="auth-field">
                  <label for="authName">Your name</label>
                  <input id="authName" name="name"
                    placeholder="Enter your name"
                    autocomplete="name" required maxlength="60">
                </div>
              ` : ""}

              <div class="auth-field">
                <label for="authEmail">Email address</label>
                <input id="authEmail" name="email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email" required>
              </div>

              <div class="auth-field">
                <label for="authPassword">Password</label>
                <input id="authPassword" name="password"
                  type="password"
                  placeholder="Enter your password"
                  autocomplete="${signup ? "new-password" : "current-password"}"
                  minlength="8" required>
              </div>

              <button class="auth-submit" type="submit">
                ${signup ? "Create account" : "Log in"}
              </button>
            </form>

            <div class="auth-switch">
              ${signup
                ? `Already have an account?`
                : `New to Meridian?`}

              <button type="button" id="authSwitch">
                ${signup ? "Log in" : "Create an account"}
              </button>
            </div>

            <p class="auth-note">
              Prototype authentication: your account is stored
              in this browser. Do not use a password you use
              for other services.
            </p>

          </div>
        </section>
      </div>
    `;

    document.getElementById("authSwitch").addEventListener("click", () => {
      mode = signup ? "login" : "signup";
      render();
    });

    document.getElementById("authForm").addEventListener(
      "submit",
      async event => {
        event.preventDefault();

        const form = event.currentTarget;
        const button = form.querySelector("button[type=submit]");
        const formData = new FormData(form);

        const email = String(formData.get("email"))
          .trim().toLowerCase();

        const password = String(formData.get("password"));

        const name = String(formData.get("name") || "").trim();

        button.disabled = true;
        button.textContent = "Please wait...";

        try {
          const users = getUsers();

          if (signup) {
            if (password.length < 8) {
              throw new Error("Password must be at least 8 characters.");
            }

            if (!name) {
              throw new Error("Please enter your name.");
            }

            if (users.some(user => user.email === email)) {
              throw new Error("An account with this email already exists.");
            }

            const salt = createSalt();
            const passwordHash = await hashPassword(password, salt);

            const user = {
              id: crypto.randomUUID(),
              name,
              email,
              salt,
              passwordHash
            };

            users.push(user);
            saveUsers(users);

            localStorage.setItem(SESSION_KEY, user.id);

          } else {
            const user = users.find(item => item.email === email);

            if (!user) {
              throw new Error("Invalid email or password.");
            }

            const passwordHash = await hashPassword(password, user.salt);

            if (passwordHash !== user.passwordHash) {
              throw new Error("Invalid email or password.");
            }

            localStorage.setItem(SESSION_KEY, user.id);
          }

          document.body.classList.remove("auth-mode");
          onAuthenticated();

        } catch (error) {
          render(error.message || "Something went wrong.");
        }
      }
    );
  }

  render();
}
