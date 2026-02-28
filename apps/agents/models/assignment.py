from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    name: str
    description: str
    points_possible: float = 100.0
    submission_types: list[str] = []
    due_at: str | None = None


class RubricLevel(BaseModel):
    label: str
    points: int
    description: str


class RubricCriterion(BaseModel):
    name: str
    description: str
    weight: int
    levels: list[RubricLevel]


class Rubric(BaseModel):
    criteria: list[RubricCriterion]
    totalPoints: int


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
