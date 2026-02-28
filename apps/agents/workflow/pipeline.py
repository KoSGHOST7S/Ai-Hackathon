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
