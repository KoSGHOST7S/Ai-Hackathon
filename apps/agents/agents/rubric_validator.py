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
    resp = await model.achat(messages=[
        {"role": "system", "content": VALIDATOR_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    from lib.json_repair import parse_llm_json
    try:
        return Rubric.model_validate(await parse_llm_json(raw, model))
    except Exception:
        return rubric
