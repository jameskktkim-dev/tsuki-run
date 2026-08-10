import { useState } from "react";
import { confirmPasswordReset } from "../api/auth";
import tsukiLogo from "../assets/tsuki-run-logo.svg";
import "./Login.css";

export default function ResetPassword({
  uid,
  token,
  onBackToLogin,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await confirmPasswordReset(
        uid,
        token,
        password
      );

      setMessage(
        data.detail ||
          "Your password has been reset."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to reset your password."
      );
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
              Account recovery
            </p>

            <h1 className="auth-title">
              Choose a new password.
            </h1>

            <p className="auth-description">
              Enter a new password for your
              Tsuki Run account.
            </p>
          </header>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <label className="auth-field">
              <span className="auth-label">
                New Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />
            </label>

            <label className="auth-field">
              <span className="auth-label">
                Confirm Password
              </span>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                disabled={isSubmitting}
                required
              />
            </label>

            {message && (
              <p className="auth-success">
                {message}
              </p>
            )}

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
                ? "Resetting…"
                : "Reset password"}
            </button>
          </form>

          <div className="auth-switch">
            <button
              type="button"
              onClick={onBackToLogin}
              disabled={isSubmitting}
            >
              Back to sign in
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