import { useEffect, useState } from "react";

import {
  createEntry,
  deleteEntry,
  fetchEntries,
  updateEntry,
} from "../api/entries";

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

const toCalendarEntry = (entry) => {
  const [, , day] = entry.date.split("-").map(Number);

  return {
    id: entry.id,
    date: entry.date,
    day,
    plan: {
      type: entry.planType || "",
      distance:
        entry.planDistance === null
          ? ""
          : Number(entry.planDistance),
    },
    result: {
      type: entry.resultType || "",
      distance:
        entry.resultDistance === null
          ? ""
          : Number(entry.resultDistance),
      reflection: entry.reflection || "",
      completed: entry.completed,
    },
  };
};

const groupEntriesByMonth = (entries) => {
  return entries.reduce((groupedEntries, entry) => {
    const [year, month] = entry.date.split("-").map(Number);

    const monthKey = `${year}-${String(month).padStart(
      2,
      "0"
    )}`;

    return {
      ...groupedEntries,
      [monthKey]: [
        ...(groupedEntries[monthKey] || []),
        toCalendarEntry(entry),
      ],
    };
  }, {});
};

export default function MonthlyCalendar() {
  const [entriesByMonth, setEntriesByMonth] = useState({});

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
    const loadEntries = async () => {
      try {
        const entries = await fetchEntries();
        const groupedEntries = groupEntriesByMonth(entries);

        setEntriesByMonth(groupedEntries);
      } catch (error) {
        console.error(
          "Unable to load Django entries:",
          error
        );
      }
    };

    loadEntries();
  }, []);

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

  const getEntryForDay = (day) => {
    return monthEntries.find(
      (entry) => entry.day === day
    );
  };

  const selectedEntry = selectedDay
    ? getEntryForDay(selectedDay)
    : null;

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

  const handleSaveEntry = async (updatedEntry) => {
    const date = `${monthKey}-${String(
      updatedEntry.day
    ).padStart(2, "0")}`;

    const existingEntry = monthEntries.find(
      (entry) => entry.day === updatedEntry.day
    );

    const apiEntry = {
      date,
      planType: updatedEntry.plan.type,
      planDistance:
        updatedEntry.plan.distance === ""
          ? null
          : Number(updatedEntry.plan.distance),
      resultType: updatedEntry.result.type,
      resultDistance:
        updatedEntry.result.distance === ""
          ? null
          : Number(updatedEntry.result.distance),
      completed: Boolean(updatedEntry.result.type),
      reflection: updatedEntry.result.reflection,
      user: 1,
    };

    try {
      const savedEntry = existingEntry?.id
        ? await updateEntry(existingEntry.id, apiEntry)
        : await createEntry(apiEntry);

      const calendarEntry = toCalendarEntry(savedEntry);

      setEntriesByMonth((currentEntriesByMonth) => {
        const currentMonthEntries =
          currentEntriesByMonth[monthKey] || [];

        const entryAlreadyExists =
          currentMonthEntries.some(
            (entry) => entry.id === calendarEntry.id
          );

        const updatedMonthEntries = entryAlreadyExists
          ? currentMonthEntries.map((entry) =>
              entry.id === calendarEntry.id
                ? calendarEntry
                : entry
            )
          : [...currentMonthEntries, calendarEntry];

        return {
          ...currentEntriesByMonth,
          [monthKey]: updatedMonthEntries,
        };
      });

      setSelectedDay(null);
    } catch (error) {
      console.error(
        "Unable to save Django entry:",
        error
      );
    }
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry?.id) {
      return;
    }

    try {
      await deleteEntry(selectedEntry.id);

      setEntriesByMonth((currentEntriesByMonth) => {
        const currentMonthEntries =
          currentEntriesByMonth[monthKey] || [];

        const updatedMonthEntries =
          currentMonthEntries.filter(
            (entry) => entry.id !== selectedEntry.id
          );

        return {
          ...currentEntriesByMonth,
          [monthKey]: updatedMonthEntries,
        };
      });

      setSelectedDay(null);
    } catch (error) {
      console.error(
        "Unable to delete Django entry:",
        error
      );
    }
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
        onDelete={handleDeleteEntry}
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