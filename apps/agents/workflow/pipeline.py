import json
from collections.abc import AsyncGenerator

from models.assignment import AnalyzeRequest, AnalyzeResponse
from agents.rubric_generator import generate_rubric
from agents.rubric_validator import validate_rubric
from agents.milestone_generator import generate_milestones
from lib.watsonx import get_model


async def run_pipeline(assignment: AnalyzeRequest) -> AnalyzeResponse:
    model = get_model()  # one client, reused across all 3 agents
    rubric = await generate_rubric(assignment, model)
    rubric = await validate_rubric(assignment, rubric, model)
    milestones = await generate_milestones(assignment, rubric, model)
    return AnalyzeResponse(rubric=rubric, milestones=milestones)


async def stream_pipeline(assignment: AnalyzeRequest) -> AsyncGenerator[str, None]:
    """Yield SSE-formatted strings as each pipeline step starts."""
    model = get_model()

    yield f'event: progress\ndata: {json.dumps({"step": 0, "label": "Generating rubric\u2026"})}\n\n'
    rubric = await generate_rubric(assignment, model)

    yield f'event: progress\ndata: {json.dumps({"step": 1, "label": "Validating rubric\u2026"})}\n\n'
    rubric = await validate_rubric(assignment, rubric, model)

    yield f'event: progress\ndata: {json.dumps({"step": 2, "label": "Building milestones\u2026"})}\n\n'
    milestones = await generate_milestones(assignment, rubric, model)

    response = AnalyzeResponse(rubric=rubric, milestones=milestones)
    yield f'event: done\ndata: {response.model_dump_json()}\n\n'
