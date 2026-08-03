# Monthly Reflection Context

## Purpose

Define the data sent to the AI when generating a monthly reflection.

The backend should prepare clear, structured context before calling the AI.

The AI should focus on observation and writing, not calculation.

---

## Context Shape

```json
{
  "month": "2026-07",
  "goal": {
    "distanceKm": 80,
    "runs": 16,
    "trainingPhase": "Base"
  },
  "summary": {
    "plannedRuns": 15,
    "completedRuns": 12,
    "plannedDistanceKm": 76,
    "completedDistanceKm": 61,
    "reflectionCount": 9
  },
  "entries": [
    {
      "date": "2026-07-03",
      "planned": {
        "type": "Easy Run",
        "distanceKm": 5
      },
      "completed": {
        "type": "Easy Run",
        "distanceKm": 5
      },
      "reflection": "Felt relaxed after a busy day."
    }
  ]
}