export default function MonthlyGoal({ entries, goal, onEdit }) {
  const goalDistance = Number(goal.distance || 0);
  const goalRuns = Number(goal.runs || 0);
  const trainingPhase = goal.phase;

  const completedEntries = entries.filter(
    (entry) =>
      entry?.result?.distance &&
      entry?.result?.type !== "Rest"
  );

  const completedDistance = completedEntries.reduce(
    (total, entry) =>
      total + Number(entry.result.distance || 0),
    0
  );

  const completedRuns = completedEntries.length;

  const distanceProgress =
    goalDistance > 0
      ? Math.min(
          Math.round((completedDistance / goalDistance) * 100),
          100
        )
      : 0;

  return (
    <section className="monthly-goal">
      <div className="monthly-goal-header">
        <p className="monthly-goal-label">
          Monthly Goal
        </p>
      </div>

      <div className="monthly-goal-summary">
        <div className="monthly-goal-distance">
          <span>{goalDistance}</span>
          <small>km</small>
        </div>

        <div className="monthly-goal-progress-value">
          <strong>{distanceProgress}%</strong>
          <span>complete</span>
        </div>
      </div>

      <div className="monthly-goal-progress-meta">
        <span>
          {completedDistance} / {goalDistance} km
        </span>

        <span>
          {completedRuns} / {goalRuns} runs
        </span>
      </div>

      <div
        className="monthly-goal-progress-track"
        role="progressbar"
        aria-label="Monthly distance progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={distanceProgress}
      >
        <div
          className="monthly-goal-progress-fill"
          style={{ width: `${distanceProgress}%` }}
        />
      </div>

      <div className="monthly-goal-footer">
        <p className="monthly-goal-phase">
          {trainingPhase}
        </p>

        <button
          type="button"
          className="monthly-goal-edit"
          onClick={onEdit}
        >
          Edit Goal
        </button>
      </div>
    </section>
  );
}