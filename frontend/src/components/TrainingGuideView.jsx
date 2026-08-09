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

        <div className="training-guide-view-content">
          <section className="training-guide-view-section">
            <p className="training-guide-view-section-label">
              Starting Point
            </p>

            <p className="training-guide-view-copy">
              {guide.guideContent?.summary}
            </p>
          </section>

          <section className="training-guide-view-section">
            <p className="training-guide-view-section-label">
              Weekly Rhythm
            </p>

            <ul className="training-guide-view-list">
              {guide.guideContent?.weeklyRhythm?.map(
                (item, index) => (
                  <li key={`${item}-${index}`}>
                    {item}
                  </li>
                )
              )}
            </ul>
          </section>

          <section className="training-guide-view-section">
            <p className="training-guide-view-section-label">
              Training Phases
            </p>

            <div className="training-guide-phase-list">
              {guide.guideContent?.phases?.map(
                (phase, index) => (
                  <article
                    key={`${phase.title}-${index}`}
                    className="training-guide-phase"
                  >
                    <div className="training-guide-phase-header">
                      <h3>{phase.title}</h3>
                      <span>{phase.duration}</span>
                    </div>

                    <div className="training-guide-phase-details">
                      <div>
                        <span>Weekly Distance</span>
                        <p>{phase.weeklyDistance}</p>
                      </div>

                      <div>
                        <span>Runs Per Week</span>
                        <p>{phase.runsPerWeek}</p>
                      </div>

                      <div>
                        <span>Easy Running</span>
                        <p>{phase.easyRunning}</p>
                      </div>

                      <div>
                        <span>Key Run</span>
                        <p>{phase.keyRun}</p>
                      </div>

                      <div>
                        <span>Long Run</span>
                        <p>{phase.longRun}</p>
                      </div>

                      <div>
                        <span>Focus</span>
                        <p>{phase.focus}</p>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>

          <section className="training-guide-view-section">
            <p className="training-guide-view-section-label">
              Gentle Reminders
            </p>

            <ul className="training-guide-view-list">
              {guide.guideContent?.gentleReminders?.map(
                (item, index) => (
                  <li key={`${item}-${index}`}>
                    {item}
                  </li>
                )
              )}
            </ul>
          </section>

          <section className="training-guide-view-closing">
            <p>{guide.guideContent?.closingThought}</p>
          </section>
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