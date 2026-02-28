import re
from typing import Iterable

from ibm_watsonx_ai.foundation_models import ModelInference

from lib.json_repair import parse_llm_json
from lib.prompts import MILESTONE_COVERAGE_VALIDATOR_SYSTEM
from models.assignment import AnalyzeRequest, Milestone, Milestones, RequirementItem, Requirements, Rubric


REQ_ID_PATTERN = re.compile(r"\bR\d+\b", re.IGNORECASE)


def extract_covered_requirement_ids(milestones: Milestones) -> set[str]:
    covered: set[str] = set()
    for m in milestones.milestones:
        text = f"{m.title} {m.description} {m.deliverable}"
        for match in REQ_ID_PATTERN.findall(text):
            covered.add(match.upper())
    return covered


def find_missing_requirement_ids(requirements: Requirements, milestones: Milestones) -> list[str]:
    covered = extract_covered_requirement_ids(milestones)
    missing: list[str] = []
    for req in requirements.requirements:
        req_id = req.id.upper().strip()
        if req_id and req_id not in covered:
            missing.append(req_id)
    return missing


def _reorder_milestones(milestones: Iterable[Milestone]) -> Milestones:
    ordered = list(milestones)
    for idx, m in enumerate(ordered, start=1):
        m.order = idx
    return Milestones(milestones=ordered)


def ensure_requirement_coverage(requirements: Requirements, milestones: Milestones) -> Milestones:
    missing_ids = find_missing_requirement_ids(requirements, milestones)
    if not missing_ids:
        return _reorder_milestones(milestones.milestones)

    by_id = {req.id.upper(): req for req in requirements.requirements}
    patched = list(milestones.milestones)
    for req_id in missing_ids:
        req = by_id.get(req_id)
        if not req:
            continue
        patched.append(Milestone(
            order=len(patched) + 1,
            title=f"Complete requirement {req.id}",
            description=f"Directly implement and verify this explicit assignment requirement: {req.text}. Covers: {req.id}",
            estimatedHours=1.0,
            deliverable=f"Completed requirement evidence for {req.id}",
        ))
    return _reorder_milestones(patched)


async def validate_milestones(
    assignment: AnalyzeRequest,
    requirements: Requirements,
    rubric: Rubric,
    milestones: Milestones,
    model: ModelInference,
) -> Milestones:
    user_msg = (
        f"Assignment: {assignment.name}\n"
        f"Due: {assignment.due_at or 'not specified'}\n\n"
        f"Requirements:\n{requirements.model_dump_json(indent=2)}\n\n"
        f"Rubric:\n{rubric.model_dump_json(indent=2)}\n\n"
        f"Draft milestones:\n{milestones.model_dump_json(indent=2)}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": MILESTONE_COVERAGE_VALIDATOR_SYSTEM},
        {"role": "user", "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"]
    parsed = parse_llm_json(raw, model)
    validated = Milestones.model_validate(parsed)
    return ensure_requirement_coverage(requirements, validated)
