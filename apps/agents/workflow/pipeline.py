import asyncio
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
    model = get_model()  # singleton — reused across all steps
    # extract_requirements and generate_rubric are independent; run in parallel
    requirements, rubric = await asyncio.gather(
        extract_requirements(assignment, model),
        generate_rubric(assignment, model),
    )
    rubric = await validate_rubric(assignment, rubric, model)
    milestones = await generate_milestones(assignment, requirements, rubric, model)
    milestones = await validate_milestones(assignment, requirements, rubric, milestones, model)
    return AnalyzeResponse(rubric=rubric, milestones=milestones)


async def stream_pipeline(assignment: AnalyzeRequest) -> AsyncGenerator[str, None]:
    """Yield SSE-formatted strings as each pipeline step completes."""
    model = get_model()

    # Steps 0 and 1 are independent — kick them off together
    yield f'event: progress\ndata: {json.dumps({"step": 0, "label": "Extracting requirements \u0026 generating rubric\u2026"})}\n\n'
    requirements, rubric = await asyncio.gather(
        extract_requirements(assignment, model),
        generate_rubric(assignment, model),
    )

    yield f'event: progress\ndata: {json.dumps({"step": 1, "label": "Validating rubric\u2026"})}\n\n'
    rubric = await validate_rubric(assignment, rubric, model)

    yield f'event: progress\ndata: {json.dumps({"step": 2, "label": "Building milestones\u2026"})}\n\n'
    milestones = await generate_milestones(assignment, requirements, rubric, model)

    yield f'event: progress\ndata: {json.dumps({"step": 3, "label": "Validating milestone coverage\u2026"})}\n\n'
    milestones = await validate_milestones(assignment, requirements, rubric, milestones, model)

    response = AnalyzeResponse(rubric=rubric, milestones=milestones)
    yield f'event: done\ndata: {response.model_dump_json()}\n\n'
