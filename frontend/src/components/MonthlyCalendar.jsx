const days = Array.from({ length: 31 }, (_, index) => index + 1);

// June 2026 starts on Monday
const blankDays = Array.from({ length: 1 }, (_, index) => null);

export default function MonthlyCalendar() {
  return (
    <div>
      <h2>June 2026</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "8px",
          fontWeight: "bold",
        }}
      >
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
        }}
      >
        {blankDays.map((_, index) => (
          <div key={`blank-${index}`}></div>
        ))}

        {days.map((day) => (
          <div
            key={day}
            style={{
              border: "1px solid #ccc",
              height: "100px",
              padding: "8px",
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
