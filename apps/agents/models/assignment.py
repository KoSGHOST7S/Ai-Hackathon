from pydantic import BaseModel


class FileContent(BaseModel):
    name: str
    text: str


class RequirementItem(BaseModel):
    id: str
    text: str
    source: str = "assignment"


class Requirements(BaseModel):
    requirements: list[RequirementItem]


class AnalyzeRequest(BaseModel):
    name: str
    description: str
    points_possible: float = 100.0
    submission_types: list[str] = []
    due_at: str | None = None
    grading_type: str = "points"
    allowed_attempts: int | None = None
    attachment_names: list[str] = []
    # Field names are camelCase to match LLM JSON output directly (no alias needed)
    canvas_rubric_summary: str | None = None  # existing Canvas rubric as plain text, if any
    file_contents: list[FileContent] = []


class RubricLevel(BaseModel):
    label: str
    points: float
    description: str


class RubricCriterion(BaseModel):
    name: str
    description: str
    weight: float
    levels: list[RubricLevel]


class Rubric(BaseModel):
    criteria: list[RubricCriterion]
    totalPoints: float


class Milestone(BaseModel):
    order: int
    title: str
    description: str
    estimatedHours: float
    deliverable: str


class Milestones(BaseModel):
    milestones: list[Milestone]


class AnalyzeResponse(BaseModel):
    rubric: Rubric
    milestones: Milestones
