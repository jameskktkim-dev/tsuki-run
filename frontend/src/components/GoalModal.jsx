import { useEffect, useState } from "react";
import "./GoalModal.css";

export default function GoalModal({
  isOpen,
  goal,
  onClose,
  onSave,
}) {
  const [distance, setDistance] = useState(goal?.distance || 150);
  const [runs, setRuns] = useState(goal?.runs || 20);
  const [phase, setPhase] = useState(goal?.phase || "");

  useEffect(() => {
    setDistance(goal?.distance || 150);
    setRuns(goal?.runs || 20);
    setPhase(goal?.phase || "");
  }, [goal, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      distance: Number(distance),
      runs: Number(runs),
      phase,
    });
  };

  return (
    <div className="goal-modal-backdrop">
      <div className="goal-modal">
        <button
          type="button"
          className="goal-close-button"
          onClick={onClose}
          aria-label="Close monthly goal"
        >
          ×
        </button>

        <h2 className="goal-modal-title">Monthly Goal</h2>

        <div className="goal-form-group">
          <label htmlFor="goal-distance">Goal Distance</label>

          <div className="goal-input-row">
            <input
              id="goal-distance"
              type="number"
              min="0"
              step="1"
              value={distance}
              onChange={(event) =>
                setDistance(event.target.value)
              }
            />

            <span>km</span>
          </div>
        </div>

        <div className="goal-form-group">
          <label htmlFor="goal-runs">Target Runs</label>

          <input
            id="goal-runs"
            type="number"
            min="0"
            step="1"
            value={runs}
            onChange={(event) => setRuns(event.target.value)}
          />
        </div>

        <div className="goal-form-group">
          <label htmlFor="goal-phase">Training Phase</label>

          <input
            id="goal-phase"
            type="text"
            value={phase}
            onChange={(event) => setPhase(event.target.value)}
            placeholder="Victoria Marathon Base Phase"
          />
        </div>

        <div className="goal-button-row">
          <button
            type="button"
            className="goal-save-button"
            onClick={handleSave}
          >
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
}