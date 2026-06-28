import "./ReflectionTimeline.css";

export default function ReflectionTimeline({ entries }) {
  const reflections = Object.values(entries)
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
            <div className="reflection-date">June {entry.day}</div>

            <div className="reflection-meta">
              {entry.result.type || "Run"}
              {entry.result.distance && ` • ${entry.result.distance} km`}
            </div>

            <p className="reflection-text">{entry.result.reflection}</p>
          </article>
        ))}
      </div>
    </section>
  );
}