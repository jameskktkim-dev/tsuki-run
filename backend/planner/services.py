import json

from django.conf import settings
from openai import OpenAI
from pydantic import BaseModel


class TrainingPhase(BaseModel):
    title: str
    duration: str
    description: str


class TrainingGuideOutput(BaseModel):
    summary: str
    weeklyRhythm: list[str]
    phases: list[TrainingPhase]
    gentleReminders: list[str]
    closingThought: str


SYSTEM_PROMPT = """
You are the AI companion inside Tsuki Run.

Tsuki Run is a quiet running journal.
You are not a strict coach.

Create a gentle, flexible training guide based only on the
runner information provided.

Do not shame, pressure, or guarantee results.
Do not diagnose injuries.
Do not describe the guide as something the runner must follow.

Use calm, practical, and supportive language.

The guide should reduce uncertainty while leaving the runner
free to adjust it around everyday life.
"""


def generate_training_guide(guide):
    if not settings.OPENAI_API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY is not configured."
        )

    client = OpenAI(
        api_key=settings.OPENAI_API_KEY
    )

    runner_context = {
        "trainingGoal": guide.training_goal,
        "goalDate": guide.goal_date.isoformat(),
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
Create a gentle training guide for this runner.

Runner information:

{json.dumps(runner_context, indent=2)}

Include:

1. A brief description of the runner's starting point.
2. A suggested weekly rhythm.
3. Training phases from now until the goal date.
4. General guidance for each phase.
5. Gentle reminders about recovery and flexibility.
6. A calm closing thought.

Do not create a rigid day-by-day calendar.
Do not guarantee the target time.
Do not invent personal information.
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