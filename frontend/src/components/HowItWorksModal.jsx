import "./HowItWorksModal.css";

export default function HowItWorksModal({
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="how-it-works-backdrop">
      <section className="how-it-works-modal">
        <button
          type="button"
          className="how-it-works-close"
          onClick={onClose}
          aria-label="Close how it works"
        >
          ×
        </button>

        <p className="how-it-works-label">
          How Tsuki Run Works
        </p>

        <h2 className="how-it-works-title">
          Plan. Run. Reflect.
        </h2>

        <div className="how-it-works-steps">
          <article>
            <span>01</span>

            <div>
              <h3>Plan</h3>
              <p>
                Set a monthly goal and sketch out your
                training with intention.
              </p>
            </div>
          </article>

          <article>
            <span>02</span>

            <div>
              <h3>Run</h3>
              <p>
                Record what you actually did without
                chasing every metric.
              </p>
            </div>
          </article>

          <article>
            <span>03</span>

            <div>
              <h3>Reflect</h3>
              <p>
                Leave short notes about how the run felt,
                what changed, and what you noticed.
              </p>
            </div>
          </article>

          <article>
            <span>04</span>

            <div>
              <h3>Find Direction</h3>
              <p>
                Create a gentle training guide based on
                your goal and recent running.
              </p>
            </div>
          </article>
        </div>

        <div className="how-it-works-section">
          <p className="how-it-works-section-label">
            A gentle guide, not a prescription
          </p>

          <h3>
            Your training guide is a starting point.
          </h3>

          <p>
            Tsuki Run can suggest weekly distance, key
            sessions, long runs, and useful pace ranges.
            But no plan can know exactly how your body
            feels on a given day.
          </p>

          <p>
            Listen to your body. Adjust when life gets
            busy. Rest when you need it. Keep the plan
            yours.
          </p>
        </div>

        <div className="how-it-works-section">
          <p className="how-it-works-section-label">
            Keep a quiet record
          </p>

          <h3>
            Journaling gives the numbers context.
          </h3>

          <p>
            Leave a few honest notes along the way —
            how the run felt, what worked, and what did
            not.
          </p>

          <p>
            Over time, those records can help you notice
            patterns that distance and pace alone often
            miss.
          </p>
        </div>

      </section>
    </div>
  );
}