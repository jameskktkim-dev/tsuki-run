import "./TrainingGuideView.css";

export default function TrainingGuideView({
  guide,
  onClose,
  onEdit,
}) {
  if (!guide) return null;

  return (
    <div className="training-guide-view-backdrop">
      <section className="training-guide-view">
        <button
          type="button"
          className="training-guide-view-close"
          onClick={onClose}
          aria-label="Close training guide"
        >
          ×
        </button>

        <p className="training-guide-view-label">
          A Gentle Training Guide
        </p>

        <h2 className="training-guide-view-title">
          {guide.trainingGoal}
        </h2>

        <div className="training-guide-view-summary">
          <div>
            <span>Goal Date</span>
            <strong>{guide.goalDate || "Not set"}</strong>
          </div>

          <div>
            <span>Target Time</span>
            <strong>{guide.targetTime || "Finish"}</strong>
          </div>

          <div>
            <span>Longest Run</span>
            <strong>
              {guide.longestRun ?? "—"} km
            </strong>
          </div>

          <div>
            <span>Weekly Distance</span>
            <strong>
              {guide.weeklyDistance ?? "—"} km
            </strong>
          </div>
        </div>

        <div className="training-guide-view-placeholder">
          <p>Your guide will appear here.</p>
          <p>
            Next, Tsuki will use your running background
            and goal to create a flexible training direction.
          </p>
        </div>

        <button
          type="button"
          className="training-guide-view-edit"
          onClick={onEdit}
        >
          Edit Guide
        </button>
      </section>
    </div>
  );
}