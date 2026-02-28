import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.assignment import AnalyzeRequest, Rubric
from lib.prompts import RUBRIC_SYSTEM

async def generate_rubric(assignment: AnalyzeRequest, model: ModelInference) -> Rubric:
    user_msg = (
        f"Assignment: {assignment.name}\n"
        f"Points possible: {assignment.points_possible}\n"
        f"Submission types: {', '.join(assignment.submission_types)}\n\n"
        f"Description:\n{assignment.description}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": RUBRIC_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"].strip()
    # Strip markdown code fences if model wraps output
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return Rubric.model_validate(json.loads(raw))
