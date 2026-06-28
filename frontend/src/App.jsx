import "./App.css";
import MonthlyCalendar from "./components/MonthlyCalendar";

export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">A mindful running planner</p>
        <h1>Tsuki Run</h1>
      </header>

      <MonthlyCalendar />
    </main>
  );
}