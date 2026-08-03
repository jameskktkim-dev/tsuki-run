import "./TrainingGuideCard.css";

export default function TrainingGuideCard({
  hasGuide,
  onOpen,
}) {
  return (
    <section className="training-guide-card">
      <p className="training-guide-label">
        A GENTLE TRAINING GUIDE
      </p>

      <p className="training-guide-description">
        For your next running goal.
      </p>

      <button
        type="button"
        className="training-guide-link"
        onClick={onOpen}
      >
        {hasGuide
          ? "View Guide →"
          : "Create Your Guide →"}
      </button>
    </section>
  );
}