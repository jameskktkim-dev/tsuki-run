export default function DayCell({ day, entry, today, onClick }) {
  const isToday = day === today;

  return (
    <div
      onClick={onClick}
      className={isToday ? "day-cell today" : "day-cell"}
    >
      <div className="day-number">{day}</div>

      {entry?.plan?.type && (
        <div className="entry-line">
          🟡 {entry.plan.type} {entry.plan.distance}km
        </div>
      )}

      {entry?.result?.completed && <div className="entry-line">🟢 Result</div>}

      {entry?.result?.reflection && (
        <div className="entry-line">📝 Reflection</div>
      )}
    </div>
  );
}