export default function MonthlyGoal({ entries, goal, onEdit }) {
  const goalDistance = goal.distance;
  const goalRuns = goal.runs;
  const trainingPhase = goal.phase;

  const completedEntries = entries.filter(
    (entry) => entry?.result?.distance && entry?.result?.type !== "Rest"
  );

  const completedDistance = completedEntries.reduce(
    (total, entry) => total + Number(entry.result.distance || 0),
    0
  );

  const completedRuns = completedEntries.length;

  return (
    <section className="monthly-goal">
      <div className="monthly-goal-header">
        <p className="monthly-goal-label">Monthly Goal</p>

        <button className="monthly-goal-edit" onClick={onEdit}>
          Edit
        </button>
      </div>

      <div className="monthly-goal-distance">
        <span>{goalDistance}</span>
        <small>km</small>
      </div>

      <div className="monthly-goal-details">
        <p>{completedDistance} km completed</p>
        <p>
          {completedRuns} / {goalRuns} Runs
        </p>
        <p>{trainingPhase}</p>
      </div>
    </section>
  );
}