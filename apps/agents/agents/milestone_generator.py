import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.assignment import AnalyzeRequest, Rubric, Milestones, Requirements
from lib.prompts import MILESTONE_SYSTEM

async def generate_milestones(
    assignment: AnalyzeRequest, requirements: Requirements, rubric: Rubric, model: ModelInference
) -> Milestones:
    user_msg = (
        f"Assignment: {assignment.name}\n"
        f"Due: {assignment.due_at or 'not specified'}\n\n"
        f"Description:\n{assignment.description}\n\n"
        f"Explicit requirements:\n{requirements.model_dump_json(indent=2)}\n\n"
        f"Rubric:\n{rubric.model_dump_json(indent=2)}"
    )
    resp = await model.achat(messages=[
        {"role": "system", "content": MILESTONE_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    from lib.json_repair import parse_llm_json
    return Milestones.model_validate(await parse_llm_json(raw, model))
