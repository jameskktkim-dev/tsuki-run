export default function DayModal({ selectedDay, entry, onClose }) {
  if (!selectedDay) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "400px",
          padding: "24px",
          borderRadius: "12px",
        }}
      >
        <button onClick={onClose}>Close</button>

        <h2>June {selectedDay}</h2>

        <h3>Plan</h3>
        <p>{entry?.planType || "No plan yet"}</p>
        <p>{entry?.planDistance ? `${entry.planDistance} km` : ""}</p>

        <h3>Result</h3>
        <p>{entry?.hasResult ? "Completed" : "No result yet"}</p>
      </div>
    </div>
  );
}