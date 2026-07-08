import "./App.css";
import MonthlyCalendar from "./components/MonthlyCalendar";
import tsukiLogo from "./assets/tsuki-run-logo.svg";

export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <img src={tsukiLogo} alt="Tsuki Run" className="app-logo" />
        <p className="app-eyebrow">A mindful running planner</p>
      </header>

      <MonthlyCalendar />
    </main>
  );
}