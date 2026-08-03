import { useState } from "react";
import "./TrainingGuideModal.css";

export default function TrainingGuideModal({
  isOpen,
  onClose,
  onSave,
}) {
  const [trainingGoal, setTrainingGoal] =
    useState("Marathon");
  const [goalDate, setGoalDate] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [longestRun, setLongestRun] = useState("");
  const [weeklyDistance, setWeeklyDistance] =
    useState("");

  const [pb5k, setPb5k] = useState("");
  const [pb10k, setPb10k] = useState("");
  const [pbHalf, setPbHalf] = useState("");
  const [pbMarathon, setPbMarathon] =
    useState("");

  if (!isOpen) return null;

  const handleGenerate = () => {
    onSave({
      trainingGoal,
      goalDate,
      targetTime: targetTime.trim(),
      longestRun:
        longestRun === "" ? null : Number(longestRun),
      weeklyDistance:
        weeklyDistance === ""
          ? null
          : Number(weeklyDistance),
      personalBests: {
        fiveK: pb5k.trim(),
        tenK: pb10k.trim(),
        halfMarathon: pbHalf.trim(),
        marathon: pbMarathon.trim(),
      },
    });
  };

  return (
    <div className="training-guide-backdrop">
      <div className="training-guide-modal">
        <button
          type="button"
          className="training-guide-close-button"
          onClick={onClose}
          aria-label="Close training guide"
        >
          ×
        </button>

        <h2 className="training-guide-title">
          Training Guide
        </h2>

        <h3>Goal</h3>

        <div className="training-guide-form-group">
          <label htmlFor="training-goal">
            Training Goal
          </label>

          <select
            id="training-goal"
            value={trainingGoal}
            onChange={(event) =>
              setTrainingGoal(event.target.value)
            }
          >
            <option value="5K">5K</option>
            <option value="10K">10K</option>
            <option value="Half Marathon">
              Half Marathon
            </option>
            <option value="Marathon">
              Marathon
            </option>
          </select>
        </div>

        <div className="training-guide-form-group">
          <label htmlFor="goal-date">
            Goal Completion Date
          </label>

          <input
            id="goal-date"
            type="date"
            value={goalDate}
            onChange={(event) =>
              setGoalDate(event.target.value)
            }
          />
        </div>

        <div className="training-guide-form-group">
          <label htmlFor="target-time">
            Target Time
          </label>

          <input
            id="target-time"
            type="text"
            placeholder="HH:MM:SS or Finish"
            value={targetTime}
            onChange={(event) =>
              setTargetTime(event.target.value)
            }
          />
        </div>

        <div className="training-guide-form-group">
          <label htmlFor="longest-run">
            Longest Run (last 3 months)
          </label>

          <div className="training-guide-input-row">
            <input
              id="longest-run"
              type="number"
              min="0"
              step="0.1"
              value={longestRun}
              onChange={(event) =>
                setLongestRun(event.target.value)
              }
            />

            <span>km</span>
          </div>
        </div>

        <div className="training-guide-form-group">
          <label htmlFor="weekly-distance">
            Average Weekly Distance (last 4 weeks)
          </label>

          <div className="training-guide-input-row">
            <input
              id="weekly-distance"
              type="number"
              min="0"
              step="0.1"
              value={weeklyDistance}
              onChange={(event) =>
                setWeeklyDistance(event.target.value)
              }
            />

            <span>km</span>
          </div>
        </div>

        <h3>Personal Bests (Optional)</h3>

        <div className="training-guide-form-group">
          <label htmlFor="pb-5k">5K</label>
          <input
            id="pb-5k"
            type="text"
            placeholder="HH:MM:SS"
            value={pb5k}
            onChange={(event) =>
              setPb5k(event.target.value)
            }
          />
        </div>

        <div className="training-guide-form-group">
          <label htmlFor="pb-10k">10K</label>
          <input
            id="pb-10k"
            type="text"
            placeholder="HH:MM:SS"
            value={pb10k}
            onChange={(event) =>
              setPb10k(event.target.value)
            }
          />
        </div>

        <div className="training-guide-form-group">
          <label htmlFor="pb-half">
            Half Marathon
          </label>
          <input
            id="pb-half"
            type="text"
            placeholder="HH:MM:SS"
            value={pbHalf}
            onChange={(event) =>
              setPbHalf(event.target.value)
            }
          />
        </div>

        <div className="training-guide-form-group">
          <label htmlFor="pb-marathon">
            Marathon
          </label>
          <input
            id="pb-marathon"
            type="text"
            placeholder="HH:MM:SS"
            value={pbMarathon}
            onChange={(event) =>
              setPbMarathon(event.target.value)
            }
          />
        </div>

        <div className="training-guide-button-row">
          <button
            type="button"
            className="training-guide-save-button"
            onClick={handleGenerate}
          >
            Generate Guide
          </button>
        </div>
      </div>
    </div>
  );
}