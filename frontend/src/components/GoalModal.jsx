import { useState, useEffect } from "react";
import "./GoalModal.css";

export default function GoalModal({ isOpen, goal, onClose, onSave }) {
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
        <button className="goal-close-button" onClick={onClose}>
          ×
        </button>

        <h2>Monthly Goal</h2>

        <div className="goal-form-group">
          <label>Goal Distance</label>
          <input
            type="number"
            value={distance}
            onChange={(event) => setDistance(event.target.value)}
          />
        </div>

        <div className="goal-form-group">
          <label>Target Runs</label>
          <input
            type="number"
            value={runs}
            onChange={(event) => setRuns(event.target.value)}
          />
        </div>

        <div className="goal-form-group">
          <label>Training Phase</label>
          <input
            type="text"
            value={phase}
            onChange={(event) => setPhase(event.target.value)}
          />
        </div>

        <div className="goal-button-row">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}