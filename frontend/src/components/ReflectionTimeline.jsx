import { useState } from "react";
import "./ReflectionTimeline.css";

const DEFAULT_VISIBLE_COUNT = 5;

export default function ReflectionTimeline({ entries }) {
  const [showAll, setShowAll] = useState(false);

  const reflections = entries
    .filter((entry) => entry?.result?.reflection)
    .sort((a, b) => b.day - a.day);

  if (reflections.length === 0) {
    return null;
  }

  const visibleReflections = showAll
    ? reflections
    : reflections.slice(0, DEFAULT_VISIBLE_COUNT);

  const hasMoreReflections =
    reflections.length > DEFAULT_VISIBLE_COUNT;

  return (
    <section className="reflection-timeline">
      <h2 className="reflection-title">Reflections</h2>

      <div className="reflection-list">
        {visibleReflections.map((entry) => (
          <article key={entry.day} className="reflection-item">
            <div className="reflection-date">
              <span>June</span>
              <strong>{entry.day}</strong>
            </div>

            <div className="reflection-content">
              <div className="reflection-meta">
                {entry.result.type || "Run"}
                {entry.result.distance &&
                  ` · ${entry.result.distance} km`}
              </div>

              <p className="reflection-text">
                {entry.result.reflection}
              </p>
            </div>
          </article>
        ))}
      </div>

      {hasMoreReflections && (
        <button
          type="button"
          className="reflection-toggle"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
        >
          {showAll
            ? "Show fewer reflections"
            : `View all reflections (${reflections.length})`}
          <span aria-hidden="true">
            {showAll ? " ↑" : " →"}
          </span>
        </button>
      )}
    </section>
  );
}