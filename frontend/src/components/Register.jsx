import { useState } from "react";
import { register } from "../api/auth";
import tsukiLogo from "../assets/tsuki-run-logo.svg";
import "./Login.css";

function getErrorMessage(error) {
  const fallbackMessage =
    "Unable to create your account. Please try again.";

  const rawMessage =
    typeof error?.message === "string"
      ? error.message
      : "";

  const normalizedMessage =
    rawMessage.toLowerCase();

  if (
    normalizedMessage.includes("network") ||
    normalizedMessage.includes("fetch")
  ) {
    return "Unable to connect to the server. Please try again.";
  }

  try {
    const parsedError = JSON.parse(rawMessage);

    if (parsedError.username?.[0]) {
      return parsedError.username[0];
    }

    if (parsedError.email?.[0]) {
      return parsedError.email[0];
    }

    if (parsedError.password?.[0]) {
      return parsedError.password[0];
    }

    if (parsedError.detail) {
      return parsedError.detail;
    }

    if (parsedError.non_field_errors?.[0]) {
      return parsedError.non_field_errors[0];
    }
  } catch {
    if (normalizedMessage.includes("already exists")) {
      return "That username or email is already in use.";
    }

    if (
      normalizedMessage.includes("400") ||
      normalizedMessage.includes("invalid")
    ) {
      return "Please check your details and try again.";
    }
  }

  return fallbackMessage;
}

export default function Register({
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

  const [isRegistered, setIsRegistered] =
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

      setIsRegistered(true);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isRegistered) {
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
                One more step
              </p>

              <h1 className="auth-title">
                Check your email.
              </h1>

              <p className="auth-description">
                We sent a verification link to{" "}
                <strong>{email}</strong>.
                Open the link to finish creating
                your Tsuki Run account.
              </p>
            </header>

            <button
              type="button"
              className="auth-submit"
              onClick={onShowLogin}
            >
              Back to sign in
            </button>
          </div>
        </section>

        <p className="auth-footer">
          Plan · Run · Reflect
        </p>
      </main>
    );
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
              Create a space for your plans, runs,
              and reflections.
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
                disabled={isSubmitting}
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
                ? "Creating account…"
                : "Create account"}
            </button>
          </form>

          <div className="auth-switch">
            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={onShowLogin}
              disabled={isSubmitting}
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