from ibm_watsonx_ai.foundation_models import ModelInference
from models.review import ReviewRequest
from lib.prompts import SCORER_SYSTEM
from lib.json_repair import parse_llm_json


async def score_submission(request: ReviewRequest, model: ModelInference) -> dict:
    submission = request.submission_text
    if request.submission_files:
        for f in request.submission_files:
            submission += f"\n\n--- {f.name} ---\n{f.text[:5000]}"

    user_msg = (
        f"Assignment: {request.assignment_name}\n\n"
        f"Description:\n{request.assignment_description}\n\n"
        f"Rubric:\n{request.rubric.model_dump_json(indent=2)}\n\n"
        f"Student submission:\n{submission}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": SCORER_SYSTEM},
        {"role": "user", "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    return parse_llm_json(raw, model)
