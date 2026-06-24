import { useState, useEffect } from "react";

export default function DayModal({ selectedDay, entry, onClose, onSave }) {
  const [trainingType, setTrainingType] = useState(entry?.planType || "");
  const [distance, setDistance] = useState(entry?.planDistance || "");
  const [reflection, setReflection] = useState(entry?.reflection || "");
  const [hasResult, setHasResult] = useState(entry?.hasResult || false);

  useEffect(() => {
    setTrainingType(entry?.planType || "");
    setDistance(entry?.planDistance || "");
    setReflection(entry?.reflection || "");
    setHasResult(entry?.hasResult || false);
  }, [entry, selectedDay]);

  if (!selectedDay) return null;

  const handleSave = () => {
    onSave({
      day: selectedDay,
      planType: trainingType,
      planDistance: distance,
      reflection: reflection,
      hasPlan: Boolean(trainingType || distance),
      hasResult: hasResult,
    });
  };

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
          width: "420px",
          padding: "24px",
          borderRadius: "12px",
        }}
      >
        <button onClick={onClose}>Close</button>

        <h2>June {selectedDay}</h2>

        <label>Training Type</label>
        <select
          value={trainingType}
          onChange={(event) => setTrainingType(event.target.value)}
        >
          <option value="">Select training type</option>
          <option value="Easy Run">Easy Run</option>
          <option value="Long Run">Long Run</option>
          <option value="Tempo">Tempo</option>
          <option value="Intervals">Intervals</option>
          <option value="Race">Race</option>
          <option value="Rest">Rest</option>
        </select>

        <br />
        <br />

        <label>Distance</label>
        <input
          type="number"
          value={distance}
          onChange={(event) => setDistance(event.target.value)}
          placeholder="km"
        />

        <br />
        <br />

        <label>Reflection</label>
        <textarea
          placeholder="How did it feel?"
          rows="5"
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
        />

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={hasResult}
            onChange={(event) => setHasResult(event.target.checked)}
          />
          Completed
        </label>

        <br />
        <br />

        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}