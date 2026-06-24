import { useState } from "react";
import { entries as initialEntries } from "../data/mockEntries";
import DayModal from "./DayModal";

const days = Array.from({ length: 30 }, (_, index) => index + 1);
const blankDays = Array.from({ length: 1 }, (_, index) => null);

export default function MonthlyCalendar() {
  const [entries, setEntries] = useState(initialEntries);
  const [selectedDay, setSelectedDay] = useState(null);

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
      <div
        style={{
          border: "1px solid #ddd",
          padding: "16px",
          marginBottom: "24px",
          borderRadius: "12px",
          backgroundColor: "#faf7f0",
        }}
      >
        <h3>Monthly Goal</h3>
        <p>150 km · 20 runs</p>
        <p>Victoria Marathon Base Phase</p>
      </div>

      <h2>June 2026</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "8px",
          fontWeight: "bold",
        }}
      >
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
        }}
      >
        {blankDays.map((_, index) => (
          <div key={`blank-${index}`}></div>
        ))}

        {days.map((day) => {
          const entry = getEntryForDay(day);

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                border: "1px solid #ccc",
                height: "100px",
                padding: "8px",
                cursor: "pointer",
                backgroundColor: day === today ? "#faf7f0" : "white",
              }}
            >
              <div>{day}</div>

              {entry?.hasPlan && (
                <div>
                  🟡 {entry.planType} {entry.planDistance}km
                </div>
              )}

              {entry?.hasResult && <div>🟢 Result</div>}

              {entry?.reflection && <div>📝 Reflection</div>}
            </div>
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