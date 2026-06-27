import "./GoalModal.css";

export default function GoalModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="goal-modal-backdrop">
      <div className="goal-modal">

        <button
          className="goal-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <h2>Monthly Goal</h2>

        <div className="goal-form-group">
          <label>Goal Distance</label>
          <input
            type="number"
            defaultValue={150}
          />
        </div>

        <div className="goal-form-group">
          <label>Target Runs</label>
          <input
            type="number"
            defaultValue={20}
          />
        </div>

        <div className="goal-form-group">
          <label>Training Phase</label>

          <input
            type="text"
            defaultValue="Victoria Marathon Base Phase"
          />
        </div>

        <div className="goal-button-row">
          <button onClick={onClose}>
            Cancel
          </button>

          <button>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}