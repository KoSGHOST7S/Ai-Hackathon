import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.assignment import AnalyzeRequest, Rubric
from lib.prompts import RUBRIC_SYSTEM

async def generate_rubric(assignment: AnalyzeRequest, model: ModelInference) -> Rubric:
    parts = [
        f"Assignment: {assignment.name}",
        f"Points possible: {assignment.points_possible}",
        f"Grading type: {assignment.grading_type}",
        f"Submission types: {', '.join(assignment.submission_types) or 'not specified'}",
    ]
    if assignment.allowed_attempts and assignment.allowed_attempts > 0:
        parts.append(f"Allowed attempts: {assignment.allowed_attempts}")
    if assignment.attachment_names:
        parts.append(f"Submitted files: {', '.join(assignment.attachment_names)}")
    if assignment.canvas_rubric_summary:
        parts.append(f"\nExisting Canvas rubric (use as basis):\n{assignment.canvas_rubric_summary}")
    if assignment.file_contents:
        for fc in assignment.file_contents:
            parts.append(f"\nAttached file — {fc.name}:\n{fc.text[:5000]}")
    parts.append(f"\nAssignment description:\n{assignment.description}")
    user_msg = "\n".join(parts)
    resp = model.chat(messages=[
        {"role": "system", "content": RUBRIC_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    from lib.json_repair import parse_llm_json
    return Rubric.model_validate(parse_llm_json(raw, model))
