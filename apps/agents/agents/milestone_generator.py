import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.assignment import AnalyzeRequest, Rubric, Milestones
from lib.prompts import MILESTONE_SYSTEM

async def generate_milestones(
    assignment: AnalyzeRequest, rubric: Rubric, model: ModelInference
) -> Milestones:
    user_msg = (
        f"Assignment: {assignment.name}\n"
        f"Due: {assignment.due_at or 'not specified'}\n\n"
        f"Description:\n{assignment.description}\n\n"
        f"Rubric:\n{rubric.model_dump_json(indent=2)}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": MILESTONE_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    from lib.json_repair import parse_llm_json
    return Milestones.model_validate(parse_llm_json(raw, model))
