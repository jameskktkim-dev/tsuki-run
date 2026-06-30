import { useState, useEffect } from "react";
import "./DayModal.css";
import { reflectionPrompts } from "../data/reflectionPrompts";

export default function DayModal({
  selectedDay,
  entry,
  onClose,
  onSave,
}) {
  const [planType, setPlanType] = useState("");
  const [planDistance, setPlanDistance] = useState("");

  const [resultType, setResultType] = useState("");
  const [resultDistance, setResultDistance] = useState("");
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    setPlanType(entry?.plan?.type || "");
    setPlanDistance(entry?.plan?.distance || "");

    setResultType(entry?.result?.type || "");
    setResultDistance(entry?.result?.distance || "");
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
          className="modal-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="modal-title">June {selectedDay}</h2>

        <h3>Plan</h3>

        <div className="form-group">
          <label>Training Type</label>

          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
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
          <label>Planned Distance</label>

          <div className="distance-row">
            <input
              type="number"
              value={planDistance}
              onChange={(e) => setPlanDistance(e.target.value)}
              placeholder="0"
            />

            <span>km</span>
          </div>
        </div>

        <h3>Completed Run</h3>

        <div className="form-group">
          <label>Training Type</label>

          <select
            value={resultType}
            onChange={(e) => setResultType(e.target.value)}
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
          <label>Actual Distance</label>

          <div className="distance-row">
            <input
              type="number"
              value={resultDistance}
              onChange={(e) => setResultDistance(e.target.value)}
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
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write a few quiet notes..."
          />
        </div>

        <button
          className="save-button"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}