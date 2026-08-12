import { useEffect, useState } from "react";
import { verifyEmail } from "../api/auth";
import tsukiLogo from "../assets/tsuki-run-logo.svg";
import "./Login.css";

export default function VerifyEmail({
  uid,
  token,
  onBackToLogin,
}) {
  const [status, setStatus] =
    useState("verifying");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function handleVerification() {
      try {
        const data = await verifyEmail(
          uid,
          token
        );

        if (!isMounted) return;

        setMessage(
          data.detail ||
            "Your email has been verified."
        );

        setStatus("success");
      } catch (requestError) {
        if (!isMounted) return;

        setMessage(
          requestError.message ||
            "Unable to verify your email."
        );

        setStatus("error");
      }
    }

    handleVerification();

    return () => {
      isMounted = false;
    };
  }, [uid, token]);

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
              Email verification
            </p>

            <h1 className="auth-title">
              {status === "verifying"
                ? "Verifying your email."
                : status === "success"
                ? "Email verified."
                : "Verification failed."}
            </h1>

            <p className="auth-description">
              {status === "verifying"
                ? "This should only take a moment."
                : message}
            </p>
          </header>

          {status !== "verifying" && (
            <button
              type="button"
              className="auth-submit"
              onClick={onBackToLogin}
            >
              Back to sign in
            </button>
          )}
        </div>
      </section>

      <p className="auth-footer">
        Plan · Run · Reflect
      </p>
    </main>
  );
}