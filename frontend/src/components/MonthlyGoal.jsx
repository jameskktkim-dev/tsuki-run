export default function MonthlyGoal({
  entries,
  goal,
  onEdit,
}) {
  const goalDistance = goal.distance;
  const goalRuns = goal.runs;
  const trainingPhase = goal.phase;
  const completedDistance = entries.reduce((total, entry) => {
    if (entry.result?.completed) {
      return total + Number(entry.result.distance || 0);
    }

    return total;
  }, 0);

  const completedRuns = entries.filter(
    (entry) => entry.result?.completed
  ).length;

  const progress = Math.min(
    (completedDistance / goalDistance) * 100,
    100
  );

  return (
    <div className="monthly-goal-card">
      <h3>Monthly Goal</h3>

      <h2>{goalDistance} km</h2>

      <p>{completedDistance} km completed</p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p>{Math.round(progress)}%</p>

      <p>
        {completedRuns} / {goalRuns} Runs
      </p>

      <p>{trainingPhase}</p>
      <button
        onClick={onEdit}
        style={{
            marginTop: "16px",
        }}
        >
        ✏ Edit Goal
      </button>
    </div>
  );
}