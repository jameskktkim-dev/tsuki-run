import MonthlyGoal from "./MonthlyGoal";
import GoalModal from "./GoalModal";
import ReflectionTimeline from "./ReflectionTimeline";
import { useEffect, useState } from "react";
import { entries as initialEntries } from "../data/mockEntries";
import DayModal from "./DayModal";
import DayCell from "./DayCell";
import "./MonthlyCalendar.css";

export default function MonthlyCalendar() {
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("tsuki-run-entries");

    if (savedEntries) {
      return JSON.parse(savedEntries);
    }

    return initialEntries;
  });

  const [selectedDay, setSelectedDay] = useState(null);

  const [goal, setGoal] = useState(() => {
    const savedGoal = localStorage.getItem("tsuki-run-goal");

    if (savedGoal) {
      return JSON.parse(savedGoal);
    }

    return {
      distance: 150,
      runs: 20,
      phase: "Victoria Marathon Base Phase",
    };
  });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 5, 1)
  );

  useEffect(() => {
    localStorage.setItem(
      "tsuki-run-entries",
      JSON.stringify(entries)
    );
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(
      "tsuki-run-goal",
      JSON.stringify(goal)
    );
  }, [goal]);

  const actualToday = new Date();
  actualToday.setHours(0, 0, 0, 0);

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    year,
    month,
    1
  ).getDay();

  const days = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  );

  const blankDays = Array.from(
    { length: firstDayOfMonth },
    (_, index) => null
  );

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );

    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );

    setSelectedDay(null);
  };

  const getEntryForDay = (day) => {
    return entries.find((entry) => entry.day === day);
  };

  const selectedEntry = selectedDay
    ? getEntryForDay(selectedDay)
    : null;

  const handleSaveEntry = (updatedEntry) => {
    const existingEntry = entries.find(
      (entry) => entry.day === updatedEntry.day
    );

    if (existingEntry) {
      setEntries(
        entries.map((entry) =>
          entry.day === updatedEntry.day
            ? updatedEntry
            : entry
        )
      );
    } else {
      setEntries([...entries, updatedEntry]);
    }

    setSelectedDay(null);
  };

  return (
    <div>
      <MonthlyGoal
        entries={entries}
        goal={goal}
        onEdit={() => setShowGoalModal(true)}
      />

      <div className="month-header">
        <button
          type="button"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>

        <h2>
          {monthName} {year}
        </h2>

        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

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

          const cellDate = new Date(year, month, day);
          cellDate.setHours(0, 0, 0, 0);

          const isToday =
            cellDate.getTime() === actualToday.getTime();

          const isPast = cellDate < actualToday;

          return (
            <DayCell
              key={day}
              day={day}
              entry={entry}
              isToday={isToday}
              isPast={isPast}
              onClick={() => setSelectedDay(day)}
            />
          );
        })}
      </div>

      <ReflectionTimeline entries={entries} />

      <DayModal
        selectedDay={selectedDay}
        entry={selectedEntry}
        onClose={() => setSelectedDay(null)}
        onSave={handleSaveEntry}
      />

      <GoalModal
        isOpen={showGoalModal}
        goal={goal}
        onClose={() => setShowGoalModal(false)}
        onSave={(updatedGoal) => {
          setGoal(updatedGoal);
          setShowGoalModal(false);
        }}
      />
    </div>
  );
}