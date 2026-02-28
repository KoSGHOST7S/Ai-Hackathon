from ibm_watsonx_ai.foundation_models import ModelInference

from lib.json_repair import parse_llm_json
from lib.prompts import REQUIREMENT_EXTRACTOR_SYSTEM
from models.assignment import AnalyzeRequest, Requirements


def _build_requirement_context(assignment: AnalyzeRequest) -> str:
    parts = [
        f"Assignment: {assignment.name}",
        f"Points possible: {assignment.points_possible}",
        f"Due: {assignment.due_at or 'not specified'}",
        "",
        "Assignment description:",
        assignment.description,
    ]
    if assignment.canvas_rubric_summary:
        parts.extend(["", "Canvas rubric summary:", assignment.canvas_rubric_summary])
    if assignment.file_contents:
        for fc in assignment.file_contents:
            parts.extend(["", f"Linked/attached file ({fc.name}):", fc.text[:3000]])
    return "\n".join(parts)


async def extract_requirements(
    assignment: AnalyzeRequest, model: ModelInference
) -> Requirements:
    user_msg = _build_requirement_context(assignment)
    resp = model.chat(messages=[
        {"role": "system", "content": REQUIREMENT_EXTRACTOR_SYSTEM},
        {"role": "user", "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    parsed = parse_llm_json(raw, model)
    return Requirements.model_validate(parsed)
