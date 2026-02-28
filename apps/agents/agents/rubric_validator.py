import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.assignment import AnalyzeRequest, Rubric
from lib.prompts import VALIDATOR_SYSTEM

async def validate_rubric(
    assignment: AnalyzeRequest, rubric: Rubric, model: ModelInference
) -> Rubric:
    user_msg = (
        f"Assignment: {assignment.name}\n"
        f"Points possible: {assignment.points_possible}\n\n"
        f"Description:\n{assignment.description}\n\n"
        f"Draft rubric:\n{rubric.model_dump_json(indent=2)}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": VALIDATOR_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1].lstrip()
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    try:
        return Rubric.model_validate(json.loads(raw))
    except Exception:
        return rubric  # graceful fallback: return original if validation fails
