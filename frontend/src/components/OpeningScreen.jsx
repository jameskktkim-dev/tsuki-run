import tsukiLogo from "../assets/tsuki-run-logo.svg";
import "./OpeningScreen.css";

export default function OpeningScreen({ onEnter }) {
  return (
    <main className="opening-screen">
      <section className="opening-hero">
        <div className="opening-content">
          <img
            src={tsukiLogo}
            alt="Tsuki Run"
            className="opening-logo"
          />

          <h1 className="opening-heading">
            Run with intention.
            <br />
            Progress without comparison.
          </h1>

          <p className="opening-intro">
            Plan your month, record what happened,
            reflect on how it felt, and use gentle AI
            guidance when you need direction.
          </p>

          <button
            type="button"
            className="opening-enter"
            onClick={onEnter}
          >
            Enter Tsuki Run
          </button>
        </div>
      </section>

      <section className="opening-section">
        <p className="opening-section-label">
          How it works
        </p>

        <div className="opening-steps">
          <article>
            <span>01</span>
            <h2>Plan</h2>
            <p>
              Set a monthly goal and sketch out your
              training with intention.
            </p>
          </article>

          <article>
            <span>02</span>
            <h2>Run</h2>
            <p>
              Record what you actually did without
              chasing every metric.
            </p>
          </article>

          <article>
            <span>03</span>
            <h2>Reflect</h2>
            <p>
              Leave short notes about how the run felt
              and what you noticed.
            </p>
          </article>

          <article>
            <span>04</span>
            <h2>Find Direction</h2>
            <p>
              Create a gentle training guide based on
              your goal and recent running.
            </p>
          </article>
        </div>
      </section>

      <section className="opening-section opening-editorial">
        <p className="opening-section-label">
          A gentle guide, not a prescription
        </p>

        <h2>
          Your training guide is a starting point.
        </h2>

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
      </section>

      <section className="opening-section opening-editorial">
        <p className="opening-section-label">
          Keep a quiet record
        </p>

        <h2>
          Journaling gives the numbers context.
        </h2>

        <p>
          Tsuki Run works best when you leave a few
          honest notes along the way. How the run felt,
          what changed, what worked, or what did not.
        </p>

        <p>
          Over time, those records can help you notice
          patterns that distance and pace alone often
          miss.
        </p>
      </section>

      <section className="opening-final">
        <p>
          Your run, your rhythm.
        </p>

        <button
          type="button"
          className="opening-enter"
          onClick={onEnter}
        >
          Enter Tsuki Run
        </button>
      </section>
    </main>
  );
}