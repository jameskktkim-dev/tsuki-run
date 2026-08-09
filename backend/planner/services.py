import json

from django.conf import settings
from django.utils import timezone
from openai import OpenAI
from pydantic import BaseModel


class TrainingPhase(BaseModel):
    title: str
    duration: str
    weeklyDistance: str
    runsPerWeek: str
    easyRunning: str
    keyRun: str
    longRun: str
    focus: str


class TrainingGuideOutput(BaseModel):
    summary: str
    weeklyRhythm: list[str]
    phases: list[TrainingPhase]
    gentleReminders: list[str]
    closingThought: str


SYSTEM_PROMPT = """
You are the AI companion inside Tsuki Run.

Tsuki Run is a quiet running journal and mindful running planner.
You are not a strict coach.

Create a gentle, flexible, but practical training guide based only
on the runner information provided.

Gentle does not mean vague.

The runner should finish reading the guide with a clear sense of
what they could reasonably try during each training phase.

Do not shame, pressure, or guarantee results.
Do not diagnose injuries.
Do not describe the guide as something the runner must follow.

Use calm, practical, and supportive language.

Give specific distances, run frequency, workout examples, and pace
ranges when the runner's data supports them.

When the runner has a time goal, calculate the approximate goal pace
and use it as a reference when appropriate.

Do not force pace recommendations when the runner only wants to finish
or when their current data does not support a useful pace estimate.

Present numbers as flexible ranges or suggestions rather than strict
requirements.

Do not create a rigid day-by-day calendar.

The guide should reduce uncertainty while leaving the runner free to
adjust it around everyday life.
"""


def generate_training_guide(guide):
    if not settings.OPENAI_API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY is not configured."
        )

    client = OpenAI(
        api_key=settings.OPENAI_API_KEY
    )

    current_date = timezone.localdate()

    days_until_goal = (
        guide.goal_date - current_date
    ).days

    if days_until_goal <= 0:
        raise ValueError(
            "The goal date must be in the future."
        )

    weeks_until_goal = max(
        1,
        (days_until_goal + 6) // 7,
    )

    runner_context = {
        "currentDate": current_date.isoformat(),
        "trainingGoal": guide.training_goal,
        "goalDate": guide.goal_date.isoformat(),
        "daysUntilGoal": days_until_goal,
        "weeksUntilGoal": weeks_until_goal,
        "targetTime": guide.target_time,
        "longestRunKm": (
            float(guide.longest_run)
            if guide.longest_run is not None
            else None
        ),
        "averageWeeklyDistanceKm": (
            float(guide.weekly_distance)
            if guide.weekly_distance is not None
            else None
        ),
        "personalBests": {
            "5K": guide.pb_5k or None,
            "10K": guide.pb_10k or None,
            "halfMarathon": (
                guide.pb_half_marathon or None
            ),
            "marathon": guide.pb_marathon or None,
        },
    }

    user_prompt = f"""
Create a gentle but actionable training guide for this runner.

The current date is {current_date.isoformat()}.
The goal date is {guide.goal_date.isoformat()}.
There are {days_until_goal} days, or approximately
{weeks_until_goal} weeks, remaining.

All training phases must:

- begin on or after the current date
- end on or before the goal date
- cover only the remaining training period
- appear in chronological order
- use practical recommendations appropriate to the runner's current level

Runner information:

{json.dumps(runner_context, indent=2)}

The guide must include:

1. Starting Point
Explain the runner's current training base and how it relates to the goal.

2. Weekly Rhythm
Give a simple overall rhythm for the week.

3. Training Phases
For every phase, provide:

- title
- calendar duration
- suggested weekly distance range
- suggested number of runs per week
- easy-running guidance
- one specific key workout or training stimulus
- long-run distance or progression
- the main focus of the phase

The recommendations should be specific enough that the runner can answer:

"What should I roughly try to do this week?"

Examples of useful guidance:

- "Aim for roughly 12-15 km per week across 3 runs."
- "Try one 4 km run including 2 km around 6:15-6:30/km."
- "Build the long run gradually from 5 km toward 7 km."
- "Keep easy runs around conversational effort."

When a time goal is provided:

- calculate the approximate goal pace
- use that pace to inform relevant training recommendations
- do not suggest that every run should be completed at goal pace
- introduce goal-pace work gradually when appropriate

When the target is "Finish":

- prioritize consistency, distance, effort, and time on feet
- do not invent unnecessary pace targets
- run-walk recommendations are welcome when appropriate

For beginner runners:

- keep progression conservative
- prioritize consistency before intensity
- avoid aggressive increases in weekly distance
- use simple workouts that are easy to understand

For experienced runners:

- recommendations may include more specific pace ranges,
  threshold work, marathon effort, intervals, or structured long runs
  when supported by their training history

4. Gentle Reminders
Give practical reminders about flexibility, recovery, and adapting the guide.

5. Closing Thought
End with a calm, concise reflection.

Do not create a rigid day-by-day calendar.
Do not guarantee the target time.
Do not invent personal information.
Do not make every phase sound generic.
"""

    response = client.responses.parse(
        model="gpt-5.6",
        input=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        text_format=TrainingGuideOutput,
    )

    guide_output = response.output_parsed

    if guide_output is None:
        raise RuntimeError(
            "OpenAI returned an empty training guide."
        )

    return guide_output.model_dump()