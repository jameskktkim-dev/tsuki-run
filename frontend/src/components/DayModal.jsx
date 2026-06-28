import { useState, useEffect } from "react";
import "./DayModal.css";

const MOODS = ["Calm", "Strong", "Tired", "Hard", "Rest"];

export default function DayModal({ selectedDay, entry, onClose, onSave }) {
  const [planType, setPlanType] = useState("");
  const [planDistance, setPlanDistance] = useState("");
  const [planNote, setPlanNote] = useState("");

  const [resultType, setResultType] = useState("");
  const [resultDistance, setResultDistance] = useState("");
  const [mood, setMood] = useState("");
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    setPlanType(entry?.plan?.type || "");
    setPlanDistance(entry?.plan?.distance || "");
    setPlanNote(entry?.plan?.note || "");

    setResultType(entry?.result?.type || "");
    setResultDistance(entry?.result?.distance || "");
    setMood(entry?.result?.mood || "");
    setReflection(entry?.result?.reflection || "");
  }, [entry, selectedDay]);

  if (!selectedDay) return null;

  const handleSave = () => {
    onSave({
      day: selectedDay,
      plan: {
        type: planType,
        distance: planDistance,
        note: planNote,
      },
      result: {
        type: resultType,
        distance: resultDistance,
        mood,
        reflection,
      },
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="day-modal">
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">June {selectedDay}</h2>

        <h3>Plan</h3>

        <div className="form-group">
          <label>Training Type</label>
          <select
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
          <label>Planned Distance</label>
          <div className="distance-row">
            <input
              type="number"
              value={planDistance}
              onChange={(event) => setPlanDistance(event.target.value)}
              placeholder="0"
            />
            <span>km</span>
          </div>
        </div>

        <div className="form-group">
          <label>Plan Note</label>
          <textarea
            rows="3"
            value={planNote}
            onChange={(event) => setPlanNote(event.target.value)}
            placeholder="What is the plan?"
          />
        </div>

        <h3>Result</h3>

        <div className="form-group">
          <label>Training Type</label>
          <select
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
          <label>Actual Distance</label>
          <div className="distance-row">
            <input
              type="number"
              value={resultDistance}
              onChange={(event) => setResultDistance(event.target.value)}
              placeholder="0"
            />
            <span>km</span>
          </div>
        </div>

        <div className="form-group">
          <label>How did it feel?</label>
          <div className="mood-options">
            {MOODS.map((moodOption) => (
              <button
                key={moodOption}
                type="button"
                className={
                  mood === moodOption
                    ? "mood-button mood-button-selected"
                    : "mood-button"
                }
                onClick={() => setMood(moodOption)}
              >
                {moodOption}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Reflection</label>
          <textarea
            rows="5"
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="A few quiet notes from today."
          />
        </div>

        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}