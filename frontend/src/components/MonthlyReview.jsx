// Reserved for a future sprint.
import "./MonthlyReview.css";

export default function MonthlyReview({ entries, goal }) {
  const completedRuns = entries.filter(
    (entry) => entry?.result?.distance && entry.result.type !== "Rest"
  );

  const totalDistance = completedRuns.reduce(
    (sum, entry) => sum + Number(entry.result.distance || 0),
    0
  );

  const distanceProgress = goal?.distance
    ? Math.round((totalDistance / goal.distance) * 100)
    : 0;

  return (
    <section className="monthly-review">
      <h2 className="monthly-review-title">Monthly Review</h2>

      <div className="monthly-review-grid">
        <div>
          <span>{completedRuns.length}</span>
          <p>runs completed</p>
        </div>

        <div>
          <span>{totalDistance}</span>
          <p>km completed</p>
        </div>

        <div>
          <span>{distanceProgress}%</span>
          <p>of monthly goal</p>
        </div>
      </div>
    </section>
  );
}