import "./ReflectionTimeline.css";

export default function ReflectionTimeline({ entries }) {
  const reflections = entries
    .filter((entry) => entry?.result?.reflection)
    .sort((a, b) => b.day - a.day);

  if (reflections.length === 0) {
    return null;
  }

  return (
    <section className="reflection-timeline">
      <h2 className="reflection-title">Reflection Timeline</h2>

      <div className="reflection-list">
        {reflections.map((entry) => (
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
    </section>
  );
}