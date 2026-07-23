import { useEffect, useState } from "react";

import {
  createEntry,
  deleteEntry,
  fetchEntries,
  updateEntry,
} from "../api/entries";

import {
  createGoal,
  fetchGoals,
  updateGoal,
} from "../api/goals";

import MonthlyGoal from "./MonthlyGoal";
import GoalModal from "./GoalModal";
import ReflectionTimeline from "./ReflectionTimeline";
import DayModal from "./DayModal";
import DayCell from "./DayCell";

import "./MonthlyCalendar.css";

const DEFAULT_GOAL = {
  id: null,
  distance: 0,
  runs: 0,
  focus: "",
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
    const monthKey = entry.date.slice(0, 7);

    return {
      ...groupedEntries,
      [monthKey]: [
        ...(groupedEntries[monthKey] || []),
        toCalendarEntry(entry),
      ],
    };
  }, {});
};

const toCalendarGoal = (goal) => {
  return {
    id: goal.id,
    month: goal.month,
    distance: Number(goal.distance ?? 0),
    runs: Number(goal.runs ?? 0),
    focus: goal.focus || "",
  };
};

const groupGoalsByMonth = (goals) => {
  return goals.reduce((groupedGoals, goal) => {
    const monthKey = goal.month.slice(0, 7);

    return {
      ...groupedGoals,
      [monthKey]: toCalendarGoal(goal),
    };
  }, {});
};

export default function MonthlyCalendar() {
  const [entriesByMonth, setEntriesByMonth] = useState({});
  const [goalsByMonth, setGoalsByMonth] = useState({});

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
    const loadCalendarData = async () => {
      try {
        const [entries, goals] = await Promise.all([
          fetchEntries(),
          fetchGoals(),
        ]);

        setEntriesByMonth(groupEntriesByMonth(entries));
        setGoalsByMonth(groupGoalsByMonth(goals));
      } catch (error) {
        console.error(
          "Unable to load Django calendar data:",
          error
        );
      }
    };

    loadCalendarData();
  }, []);

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

  const handleSaveGoal = async (updatedGoal) => {
    const apiGoal = {
      month: `${monthKey}-01`,
      distance: Number(updatedGoal.distance || 0),
      runs: Number(updatedGoal.runs || 0),
      focus: updatedGoal.focus || "",
      user: 1,
    };

    try {
      const savedGoal = currentGoal.id
        ? await updateGoal(currentGoal.id, apiGoal)
        : await createGoal(apiGoal);

      const calendarGoal = toCalendarGoal(savedGoal);

      setGoalsByMonth((currentGoalsByMonth) => ({
        ...currentGoalsByMonth,
        [monthKey]: calendarGoal,
      }));

      setShowGoalModal(false);
    } catch (error) {
      console.error(
        "Unable to save Django monthly goal:",
        error
      );
    }
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