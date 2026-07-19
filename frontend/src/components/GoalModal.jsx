import { useEffect, useState } from "react";
import "./GoalModal.css";

export default function GoalModal({
  isOpen,
  goal,
  onClose,
  onSave,
}) {
  const [distance, setDistance] = useState(
    goal?.distance ?? 0
  );

  const [runs, setRuns] = useState(
    goal?.runs ?? 0
  );

  const [focus, setFocus] = useState(
    goal?.focus ?? goal?.phase ?? ""
  );

  useEffect(() => {
    setDistance(goal?.distance ?? 0);
    setRuns(goal?.runs ?? 0);
    setFocus(goal?.focus ?? goal?.phase ?? "");
  }, [goal, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      distance: Number(distance),
      runs: Number(runs),
      focus: focus.trim(),
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

        <h2 className="goal-modal-title">
          Monthly Goal
        </h2>

        <div className="goal-form-group">
          <label htmlFor="goal-distance">
            Goal Distance
          </label>

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
          <label htmlFor="goal-runs">
            Target Runs
          </label>

          <input
            id="goal-runs"
            type="number"
            min="0"
            step="1"
            value={runs}
            onChange={(event) =>
              setRuns(event.target.value)
            }
          />
        </div>

        <div className="goal-form-group">
          <label htmlFor="goal-focus">
            Monthly Focus
          </label>

          <input
            id="goal-focus"
            type="text"
            value={focus}
            onChange={(event) =>
              setFocus(event.target.value)
            }
            placeholder="What is your focus this month?"
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