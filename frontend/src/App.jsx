import { useState } from "react";
import "./App.css";
import MonthlyCalendar from "./components/MonthlyCalendar";
import OpeningScreen from "./components/OpeningScreen";
import tsukiLogo from "./assets/tsuki-run-logo.svg";

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  if (!hasEntered) {
    return (
      <OpeningScreen onEnter={() => setHasEntered(true)} />
    );
  }

  return (
    <main className="app-shell">
      <header className="app-header">
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