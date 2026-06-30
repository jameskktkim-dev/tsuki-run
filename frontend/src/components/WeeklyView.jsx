// Reserved for a future sprint.
import "./WeeklyView.css";

export default function WeeklyView({ entries }) {
  const completedRuns = entries.filter(
    (entry) => entry?.result?.distance && entry.result.type !== "Rest"
  );

  const totalDistance = completedRuns.reduce(
    (sum, entry) => sum + Number(entry.result.distance || 0),
    0
  );

  return (
    <section className="weekly-view">
      <h2 className="weekly-title">This Week</h2>

      <div className="weekly-stats">
        <div>
          <span>{completedRuns.length}</span>
          <p>runs</p>
        </div>

        <div>
          <span>{totalDistance}</span>
          <p>km</p>
        </div>
      </div>
    </section>
  );
}