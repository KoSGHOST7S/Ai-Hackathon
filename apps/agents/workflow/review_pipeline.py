import json
from collections.abc import AsyncGenerator

from models.review import ReviewRequest, ReviewResponse
from agents.scorer import score_submission
from agents.feedback_writer import write_feedback
from agents.review_validator import validate_review
from lib.watsonx import get_model


async def run_review(request: ReviewRequest) -> ReviewResponse:
    model = get_model()
    scores = await score_submission(request, model)
    feedback = await write_feedback(request, scores, model)
    combined = {**scores, **feedback}
    return await validate_review(combined, model)


async def stream_review(request: ReviewRequest) -> AsyncGenerator[str, None]:
    model = get_model()

    yield f'event: progress\ndata: {json.dumps({"step": 0, "label": "Scoring submission…"})}\n\n'
    scores = await score_submission(request, model)

    yield f'event: progress\ndata: {json.dumps({"step": 1, "label": "Writing feedback…"})}\n\n'
    feedback = await write_feedback(request, scores, model)

    yield f'event: progress\ndata: {json.dumps({"step": 2, "label": "Validating review…"})}\n\n'
    combined = {**scores, **feedback}
    result = await validate_review(combined, model)

    yield f'event: done\ndata: {result.model_dump_json()}\n\n'
