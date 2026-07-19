import { useEffect, useState } from "react";
import { entries as initialEntries } from "../data/mockEntries";

import MonthlyGoal from "./MonthlyGoal";
import GoalModal from "./GoalModal";
import ReflectionTimeline from "./ReflectionTimeline";
import DayModal from "./DayModal";
import DayCell from "./DayCell";

import "./MonthlyCalendar.css";

const LEGACY_MONTH_KEY = "2026-06";

const DEFAULT_GOAL = {
  distance: 0,
  runs: 0,
  focus: "",
};

const normalizeGoal = (goal) => {
  if (!goal || typeof goal !== "object") {
    return DEFAULT_GOAL;
  }

  return {
    distance: Number(goal.distance ?? 0),
    runs: Number(goal.runs ?? 0),
    focus: goal.focus ?? goal.phase ?? "",
  };
};

const normalizeGoalsByMonth = (goalsByMonth) => {
  if (!goalsByMonth || typeof goalsByMonth !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(goalsByMonth).map(([monthKey, goal]) => [
      monthKey,
      normalizeGoal(goal),
    ])
  );
};

export default function MonthlyCalendar() {
  const [entriesByMonth, setEntriesByMonth] = useState(() => {
    const savedEntries = localStorage.getItem("tsuki-run-entries");

    if (!savedEntries) {
      return initialEntries;
    }

    try {
      const parsedEntries = JSON.parse(savedEntries);

      if (Array.isArray(parsedEntries)) {
        return {
          [LEGACY_MONTH_KEY]: parsedEntries,
        };
      }

      return parsedEntries;
    } catch {
      return initialEntries;
    }
  });

  const [goalsByMonth, setGoalsByMonth] = useState(() => {
    const savedGoals = localStorage.getItem("tsuki-run-goals");

    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);

        return normalizeGoalsByMonth(parsedGoals);
      } catch {
        return {};
      }
    }

    const legacyGoal = localStorage.getItem("tsuki-run-goal");

    if (legacyGoal) {
      try {
        return {
          [LEGACY_MONTH_KEY]: normalizeGoal(
            JSON.parse(legacyGoal)
          ),
        };
      } catch {
        return {};
      }
    }

    return {};
  });

  const [selectedDay, setSelectedDay] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
  });

  useEffect(() => {
    localStorage.setItem(
      "tsuki-run-entries",
      JSON.stringify(entriesByMonth)
    );
  }, [entriesByMonth]);

  useEffect(() => {
    localStorage.setItem(
      "tsuki-run-goals",
      JSON.stringify(goalsByMonth)
    );
  }, [goalsByMonth]);

  const actualToday = new Date();
  actualToday.setHours(0, 0, 0, 0);

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthKey = `${year}-${String(month + 1).padStart(
    2,
    "0"
  )}`;

  const monthEntries = entriesByMonth[monthKey] || [];

  const currentGoal =
    goalsByMonth[monthKey] || DEFAULT_GOAL;

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
    () => null
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
    return monthEntries.find(
      (entry) => entry.day === day
    );
  };

  const selectedEntry = selectedDay
    ? getEntryForDay(selectedDay)
    : null;

  const handleSaveEntry = (updatedEntry) => {
    setEntriesByMonth((currentEntriesByMonth) => {
      const currentMonthEntries =
        currentEntriesByMonth[monthKey] || [];

      const existingEntry = currentMonthEntries.find(
        (entry) => entry.day === updatedEntry.day
      );

      const updatedMonthEntries = existingEntry
        ? currentMonthEntries.map((entry) =>
            entry.day === updatedEntry.day
              ? updatedEntry
              : entry
          )
        : [...currentMonthEntries, updatedEntry];

      return {
        ...currentEntriesByMonth,
        [monthKey]: updatedMonthEntries,
      };
    });

    setSelectedDay(null);
  };

  const handleSaveGoal = (updatedGoal) => {
    setGoalsByMonth((currentGoalsByMonth) => ({
      ...currentGoalsByMonth,
      [monthKey]: normalizeGoal(updatedGoal),
    }));

    setShowGoalModal(false);
  };

  return (
    <div>
      <MonthlyGoal
        entries={monthEntries}
        goal={currentGoal}
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

      <div className="calendar-scroll">
        <div className="calendar-inner">
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

              const cellDate = new Date(
                year,
                month,
                day
              );

              cellDate.setHours(0, 0, 0, 0);

              const isToday =
                cellDate.getTime() ===
                actualToday.getTime();

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
        </div>
      </div>

      <ReflectionTimeline entries={monthEntries} />

      <DayModal
        selectedDay={selectedDay}
        monthName={monthName}
        year={year}
        entry={selectedEntry}
        onClose={() => setSelectedDay(null)}
        onSave={handleSaveEntry}
      />

      <GoalModal
        isOpen={showGoalModal}
        goal={currentGoal}
        onClose={() => setShowGoalModal(false)}
        onSave={handleSaveGoal}
      />
    </div>
  );
}