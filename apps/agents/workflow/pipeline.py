import json
from collections.abc import AsyncGenerator

from models.assignment import AnalyzeRequest, AnalyzeResponse
from agents.requirement_extractor import extract_requirements
from agents.rubric_generator import generate_rubric
from agents.rubric_validator import validate_rubric
from agents.milestone_generator import generate_milestones
from agents.milestone_validator import validate_milestones
from lib.watsonx import get_model


async def run_pipeline(assignment: AnalyzeRequest) -> AnalyzeResponse:
    model = get_model()  # one client reused across all steps
    requirements = await extract_requirements(assignment, model)
    rubric = await generate_rubric(assignment, model)
    rubric = await validate_rubric(assignment, rubric, model)
    milestones = await generate_milestones(assignment, requirements, rubric, model)
    milestones = await validate_milestones(assignment, requirements, rubric, milestones, model)
    return AnalyzeResponse(rubric=rubric, milestones=milestones)


async def stream_pipeline(assignment: AnalyzeRequest) -> AsyncGenerator[str, None]:
    """Yield SSE-formatted strings as each pipeline step starts."""
    model = get_model()

    yield f'event: progress\ndata: {json.dumps({"step": 0, "label": "Extracting explicit requirements\u2026"})}\n\n'
    requirements = await extract_requirements(assignment, model)

    yield f'event: progress\ndata: {json.dumps({"step": 1, "label": "Generating rubric\u2026"})}\n\n'
    rubric = await generate_rubric(assignment, model)

    yield f'event: progress\ndata: {json.dumps({"step": 2, "label": "Validating rubric\u2026"})}\n\n'
    rubric = await validate_rubric(assignment, rubric, model)

    yield f'event: progress\ndata: {json.dumps({"step": 3, "label": "Building requirement-based milestones\u2026"})}\n\n'
    milestones = await generate_milestones(assignment, requirements, rubric, model)

    yield f'event: progress\ndata: {json.dumps({"step": 4, "label": "Validating milestone coverage\u2026"})}\n\n'
    milestones = await validate_milestones(assignment, requirements, rubric, milestones, model)

    response = AnalyzeResponse(rubric=rubric, milestones=milestones)
    yield f'event: done\ndata: {response.model_dump_json()}\n\n'
