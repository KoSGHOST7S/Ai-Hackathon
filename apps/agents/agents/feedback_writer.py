import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.review import ReviewRequest
from lib.prompts import FEEDBACK_SYSTEM
from lib.json_repair import parse_llm_json


async def write_feedback(request: ReviewRequest, scores: dict, model: ModelInference) -> dict:
    submission = request.submission_text
    if request.submission_files:
        for f in request.submission_files:
            submission += f"\n\n--- {f.name} ---\n{f.text[:5000]}"

    user_msg = (
        f"Assignment: {request.assignment_name}\n\n"
        f"Scored rubric:\n{json.dumps(scores, indent=2)}\n\n"
        f"Student submission:\n{submission}"
    )
    resp = await model.achat(messages=[
        {"role": "system", "content": FEEDBACK_SYSTEM},
        {"role": "user", "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    return await parse_llm_json(raw, model)
