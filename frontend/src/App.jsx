import { useEffect, useState } from "react";
import "./App.css";

import {
  isAuthenticated,
  logout,
} from "./api/auth";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MonthlyCalendar from "./components/MonthlyCalendar";
import OpeningScreen from "./components/OpeningScreen";
import HowItWorksModal from "./components/HowItWorksModal";

import tsukiLogo from "./assets/tsuki-run-logo.svg";

export default function App() {
  const [hasEntered, setHasEntered] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      isAuthenticated()
    );

  const [authScreen, setAuthScreen] =
    useState("login");

  const [
    showHowItWorks,
    setShowHowItWorks,
  ] = useState(false);

  const isPasswordResetPage =
    window.location.pathname ===
    "/reset-password";

  const searchParams =
    new URLSearchParams(
      window.location.search
    );

  const resetUid =
    searchParams.get("uid") ?? "";

  const resetToken =
    searchParams.get("token") ?? "";

  useEffect(() => {
    function handleAuthExpired() {
      logout();
      setIsLoggedIn(false);
      setAuthScreen("login");
    }

    window.addEventListener(
      "tsuki-auth-expired",
      handleAuthExpired
    );

    return () => {
      window.removeEventListener(
        "tsuki-auth-expired",
        handleAuthExpired
      );
    };
  }, []);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    logout();

    setIsLoggedIn(false);
    setAuthScreen("login");
  }

  function handleHome() {
    setHasEntered(false);
  }

  function handleBackToLogin() {
    window.history.replaceState(
      {},
      "",
      "/"
    );

    setAuthScreen("login");
    setHasEntered(true);
  }

  if (
    isPasswordResetPage &&
    resetUid &&
    resetToken
  ) {
    return (
      <ResetPassword
        uid={resetUid}
        token={resetToken}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  if (!hasEntered) {
    return (
      <OpeningScreen
        onEnter={() =>
          setHasEntered(true)
        }
      />
    );
  }

  if (!isLoggedIn) {
    if (authScreen === "register") {
      return (
        <Register
          onRegister={handleLogin}
          onShowLogin={() =>
            setAuthScreen("login")
          }
        />
      );
    }

    if (authScreen === "forgot") {
      return (
        <ForgotPassword
          onBackToLogin={() =>
            setAuthScreen("login")
          }
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() =>
          setAuthScreen("register")
        }
        onShowForgotPassword={() =>
          setAuthScreen("forgot")
        }
      />
    );
  }

  return (
    <>
      <main className="app-shell">
        <header className="app-header">
          <div className="app-utility">
            <button
              type="button"
              className="app-logout"
              onClick={handleLogout}
            >
              Log out
            </button>

            <button
              type="button"
              className="app-how-it-works"
              onClick={() =>
                setShowHowItWorks(true)
              }
            >
              How it works
            </button>
          </div>

          <button
            type="button"
            className="app-logo-button"
            onClick={handleHome}
            aria-label="Return to Tsuki Run home"
          >
            <img
              src={tsukiLogo}
              alt="Tsuki Run"
              className="app-logo"
            />
          </button>
        </header>

        <MonthlyCalendar />
      </main>

      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() =>
          setShowHowItWorks(false)
        }
      />
    </>
  );
}