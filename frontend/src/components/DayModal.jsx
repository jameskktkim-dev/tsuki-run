import { useEffect, useState } from "react";
import "./DayModal.css";
import { reflectionPrompts } from "../data/reflectionPrompts";

export default function DayModal({
  selectedDay,
  monthName,
  year,
  entry,
  onClose,
  onSave,
  onDelete,
}) {
  const [planType, setPlanType] = useState("");
  const [planDistance, setPlanDistance] = useState("");

  const [resultType, setResultType] = useState("");
  const [resultDistance, setResultDistance] = useState("");
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    setPlanType(entry?.plan?.type || "");
    setPlanDistance(entry?.plan?.distance ?? "");

    setResultType(entry?.result?.type || "");
    setResultDistance(entry?.result?.distance ?? "");
    setReflection(entry?.result?.reflection || "");
  }, [entry, selectedDay]);

  if (!selectedDay) return null;

  const reflectionPrompt =
    reflectionPrompts[(selectedDay - 1) % reflectionPrompts.length];

  const handleSave = () => {
    onSave({
      day: selectedDay,
      plan: {
        type: planType,
        distance: planDistance,
      },
      result: {
        type: resultType,
        distance: resultDistance,
        reflection,
      },
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="day-modal">
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close day entry"
        >
          ×
        </button>

        <h2 className="modal-title">
          {monthName} {selectedDay}, {year}
        </h2>

        <h3>Plan</h3>

        <div className="form-group">
          <label htmlFor="plan-type">Training Type</label>

          <select
            id="plan-type"
            value={planType}
            onChange={(event) => setPlanType(event.target.value)}
          >
            <option value="">Select training type</option>
            <option value="Easy Run">Easy Run</option>
            <option value="Long Run">Long Run</option>
            <option value="Tempo">Tempo</option>
            <option value="Intervals">Intervals</option>
            <option value="Race">Race</option>
            <option value="Rest">Rest</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="plan-distance">Planned Distance</label>

          <div className="distance-row">
            <input
              id="plan-distance"
              type="number"
              min="0"
              step="0.1"
              value={planDistance}
              onChange={(event) => setPlanDistance(event.target.value)}
              placeholder="0"
            />

            <span>km</span>
          </div>
        </div>

        <h3>Result</h3>

        <div className="form-group">
          <label htmlFor="result-type">Training Type</label>

          <select
            id="result-type"
            value={resultType}
            onChange={(event) => setResultType(event.target.value)}
          >
            <option value="">Select training type</option>
            <option value="Easy Run">Easy Run</option>
            <option value="Long Run">Long Run</option>
            <option value="Tempo">Tempo</option>
            <option value="Intervals">Intervals</option>
            <option value="Race">Race</option>
            <option value="Rest">Rest</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="result-distance">Actual Distance</label>

          <div className="distance-row">
            <input
              id="result-distance"
              type="number"
              min="0"
              step="0.1"
              value={resultDistance}
              onChange={(event) => setResultDistance(event.target.value)}
              placeholder="0"
            />

            <span>km</span>
          </div>
        </div>

        <div className="reflection-prompt-section">
          <p className="reflection-prompt-eyebrow">
            A Question for Today
          </p>

          <p className="reflection-prompt-text">
            {reflectionPrompt}
          </p>

          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="Write a quiet note..."
            aria-label="Reflection"
          />
        </div>

        <button
          type="button"
          className="save-button"
          onClick={handleSave}
        >
          Save Entry
        </button>

        {entry?.id && (
          <button
            type="button"
            className="delete-entry-button"
            onClick={onDelete}
          >
            Delete Entry
          </button>
        )}
      </div>
    </div>
  );
}