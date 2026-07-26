import { useState } from "react";
import {
  login,
  register,
} from "../api/auth";
import tsukiLogo from "../assets/tsuki-run-logo.svg";
import "./Login.css";

function getErrorMessage(error) {
  try {
    const parsedError = JSON.parse(error.message);

    if (parsedError.username) {
      return parsedError.username[0];
    }

    if (parsedError.email) {
      return parsedError.email[0];
    }

    if (parsedError.password) {
      return parsedError.password[0];
    }
  } catch {
    return error.message;
  }

  return error.message;
}

export default function Register({
  onRegister,
  onShowLogin,
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(
        cleanUsername,
        cleanEmail,
        password
      );

      await login(cleanUsername, password);

      onRegister();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">
          <img
            src={tsukiLogo}
            alt="Tsuki Run"
            className="auth-logo"
          />
        </div>

        <div className="auth-content">
          <header className="auth-header">
            <p className="auth-eyebrow">
              A quiet notebook for runners
            </p>

            <h1 className="auth-title">
              Begin your journal.
            </h1>

            <p className="auth-description">
              Create a space for your plans, runs, and
              reflections.
            </p>
          </header>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <label className="auth-field">
              <span className="auth-label">
                Username
              </span>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                autoComplete="username"
                required
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">
                Email
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">
                Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">
                Confirm password
              </span>

              <input
                type="password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>

            <button
              type="button"
              onClick={onShowLogin}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      <p className="auth-footer">
        Plan · Run · Reflect
      </p>
    </main>
  );
}