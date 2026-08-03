import { useEffect, useState } from "react";
import "./App.css";
import {
  isAuthenticated,
  logout,
} from "./api/auth";
import Login from "./components/Login";
import Register from "./components/Register";
import MonthlyCalendar from "./components/MonthlyCalendar";
import OpeningScreen from "./components/OpeningScreen";
import tsukiLogo from "./assets/tsuki-run-logo.svg";

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    isAuthenticated()
  );

  const [authScreen, setAuthScreen] =
    useState("login");

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

  if (!hasEntered) {
    return (
      <OpeningScreen
        onEnter={() => setHasEntered(true)}
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

    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() =>
          setAuthScreen("register")
        }
      />
    );
  }

  return (
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
        </div>

        <img
          src={tsukiLogo}
          alt="Tsuki Run"
          className="app-logo"
        />
      </header>

      <MonthlyCalendar />
    </main>
  );
}