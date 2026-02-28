from pydantic import BaseModel
from models.assignment import FileContent, Rubric


class ReviewRequest(BaseModel):
    assignment_name: str
    assignment_description: str
    rubric: Rubric
    submission_text: str = ""
    submission_files: list[FileContent] = []


class CriterionScore(BaseModel):
    criterionName: str
    level: str
    points: int
    maxPoints: int
    feedback: str


class ReviewResponse(BaseModel):
    scores: list[CriterionScore]
    totalScore: int
    totalPossible: int
    strengths: list[str]
    improvements: list[str]
    nextSteps: list[str]
