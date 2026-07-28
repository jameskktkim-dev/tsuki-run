import { useState } from "react";
import { login } from "../api/auth";
import tsukiLogo from "../assets/tsuki-run-logo.svg";
import "./Login.css";

export default function Login({
  onLogin,
  onShowRegister,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
      onLogin();
    } catch (requestError) {
      const message =
        requestError.message?.toLowerCase() ?? "";

      if (
        message.includes("401") ||
        message.includes("invalid")
      ) {
        setError(
          "Incorrect username or password."
        );
      } else if (
        message.includes("network") ||
        message.includes("fetch")
      ) {
        setError(
          "Unable to connect to the server. Please try again."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
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
              Your running journal
            </p>

            <h1 className="auth-title">
              Welcome back.
            </h1>

            <p className="auth-description">
              Return to your plans, runs, and reflections.
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
                disabled={isSubmitting}
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
                autoComplete="current-password"
                disabled={isSubmitting}
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
                ? "Signing in…"
                : "Sign in"}
            </button>
          </form>

          <div className="auth-switch">
            <span>New to Tsuki Run?</span>

            <button
              type="button"
              onClick={onShowRegister}
              disabled={isSubmitting}
            >
              Create an account
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