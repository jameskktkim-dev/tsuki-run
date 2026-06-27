import { useState, useEffect } from "react";
import { entries as initialEntries } from "../data/mockEntries";
import DayModal from "./DayModal";
import DayCell from "./DayCell";
import "./MonthlyCalendar.css";

const days = Array.from({ length: 30 }, (_, index) => index + 1);
const blankDays = Array.from({ length: 1 }, (_, index) => null);

export default function MonthlyCalendar() {
  
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("tsuki-run-entries");

    if (savedEntries) {
      return JSON.parse(savedEntries);
    }

    return initialEntries;
  });

  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    localStorage.setItem("tsuki-run-entries", JSON.stringify(entries));
  }, [entries]);

  const today = new Date().getDate();

  const getEntryForDay = (day) => {
    return entries.find((entry) => entry.day === day);
  };

  const selectedEntry = selectedDay ? getEntryForDay(selectedDay) : null;

  const handleSaveEntry = (updatedEntry) => {
    const existingEntry = entries.find(
      (entry) => entry.day === updatedEntry.day
    );

    if (existingEntry) {
      setEntries(
        entries.map((entry) =>
          entry.day === updatedEntry.day ? updatedEntry : entry
        )
      );
    } else {
      setEntries([...entries, updatedEntry]);
    }

    setSelectedDay(null);
  };

  return (
    <div>
      <div className="monthly-goal-card">
        <h3>Monthly Goal</h3>
        <p>150 km · 20 runs</p>
        <p>Victoria Marathon Base Phase</p>
      </div>

      <h2>June 2026</h2>

      <div className="weekday-grid">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="calendar-grid">
        {blankDays.map((_, index) => (
          <div key={`blank-${index}`}></div>
        ))}

        {days.map((day) => {
          const entry = getEntryForDay(day);

          return (
            <DayCell
              key={day}
              day={day}
              entry={entry}
              today={today}
              onClick={() => setSelectedDay(day)}
            />
          );
        })}
      </div>

      <DayModal
        selectedDay={selectedDay}
        entry={selectedEntry}
        onClose={() => setSelectedDay(null)}
        onSave={handleSaveEntry}
      />
    </div>
  );
}