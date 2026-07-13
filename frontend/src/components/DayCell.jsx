export default function DayCell({
  day,
  entry,
  isToday,
  isPast,
  onClick,
}) {
  const cellClassName = [
    "day-cell",
    isPast ? "past" : "",
    isToday ? "today" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      onClick={onClick}
      className={cellClassName}
    >
      <div className="day-number">{day}</div>

      {entry?.plan?.type ? (
        <div className="entry-line plan-entry">
          <span className="entry-marker">○</span>

          <span>
            {entry.plan.type}
            {entry.plan.distance &&
              ` ${entry.plan.distance} km`}
          </span>
        </div>
      ) : (
        <div
          className="entry-line placeholder-entry"
          aria-hidden="true"
        >
          <span className="entry-marker">○</span>
          <span>Placeholder</span>
        </div>
      )}

      {entry?.result?.type && (
        <div className="entry-line completed-entry">
          <span className="entry-marker completed">●</span>

          <span className="completed-entry-text">
            {entry.result.type}
            {entry.result.distance &&
              ` ${entry.result.distance} km`}
          </span>
        </div>
      )}
    </div>
  );
}