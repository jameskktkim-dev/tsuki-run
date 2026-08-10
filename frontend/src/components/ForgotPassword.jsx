import { useState } from "react";
import { requestPasswordReset } from "../api/auth";
import tsukiLogo from "../assets/tsuki-run-logo.svg";
import "./Login.css";

export default function ForgotPassword({
  onBackToLogin,
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const data = await requestPasswordReset(
        email.trim()
      );

      setMessage(
        data.detail ||
          "If an account exists with that email, a reset link has been sent."
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to send reset email."
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
              Reset your password.
            </h1>

            <p className="auth-description">
              Enter the email connected to your
              Tsuki Run account.
            </p>
          </header>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
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
                ? "Sending…"
                : "Send reset link"}
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