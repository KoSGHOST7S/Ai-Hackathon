import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.review import ReviewResponse
from lib.prompts import REVIEW_VALIDATOR_SYSTEM
from lib.json_repair import parse_llm_json


async def validate_review(combined: dict, model: ModelInference) -> ReviewResponse:
    user_msg = f"Complete review to validate:\n{json.dumps(combined, indent=2)}"
    resp = model.chat(messages=[
        {"role": "system", "content": REVIEW_VALIDATOR_SYSTEM},
        {"role": "user", "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    try:
        parsed = parse_llm_json(raw, model)
        return ReviewResponse.model_validate(parsed)
    except Exception:
        return ReviewResponse.model_validate(combined)
