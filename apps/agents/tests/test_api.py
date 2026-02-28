"""FastAPI endpoint tests — no real WatsonX or Canvas credentials required."""
import asyncio
import io
import json
from unittest.mock import AsyncMock, patch, MagicMock

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


# ---------------------------------------------------------------------------
# GET /health
# ---------------------------------------------------------------------------

def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# POST /parse-file
# ---------------------------------------------------------------------------

def test_parse_file_no_file_returns_422():
    """Missing file field → 422 Unprocessable Entity from FastAPI validation."""
    resp = client.post("/parse-file")
    assert resp.status_code == 422


def test_parse_file_unsupported_type_returns_400():
    resp = client.post(
        "/parse-file",
        files={"file": ("notes.txt", b"hello world", "text/plain")},
    )
    assert resp.status_code == 400
    assert "Unsupported" in resp.json()["detail"]


def test_parse_file_pdf_parsed(monkeypatch):
    """A valid (minimal) PDF should be parsed and returned."""
    monkeypatch.setattr("main.parse_file", lambda content, filename: "extracted text")

    minimal_pdf = b"%PDF-1.4 fake"
    resp = client.post(
        "/parse-file",
        files={"file": ("doc.pdf", minimal_pdf, "application/pdf")},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "doc.pdf"
    assert data["text"] == "extracted text"


# ---------------------------------------------------------------------------
# POST /analyze
# ---------------------------------------------------------------------------

def _fake_pipeline_result():
    from models.assignment import (
        AnalyzeResponse, Rubric, RubricCriterion, RubricLevel, Milestones, Milestone,
    )
    rubric = Rubric(
        criteria=[
            RubricCriterion(
                name="Quality",
                description="Overall quality",
                weight=100,
                levels=[RubricLevel(label="Excellent", points=100, description="Perfect")],
            )
        ],
        totalPoints=100,
    )
    milestones = Milestones(milestones=[
        Milestone(order=1, title="Draft", description="Write draft", estimatedHours=2, deliverable="Draft doc"),
    ])
    return AnalyzeResponse(rubric=rubric, milestones=milestones)


def test_analyze_missing_fields_returns_422():
    resp = client.post("/analyze", json={})
    assert resp.status_code == 422


def test_analyze_returns_result(monkeypatch):
    result = _fake_pipeline_result()
    monkeypatch.setattr("main.run_pipeline", AsyncMock(return_value=result))

    resp = client.post("/analyze", json={
        "name": "Test Assignment",
        "description": "Write a 5-page essay on climate change.",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "rubric" in data
    assert "milestones" in data


# ---------------------------------------------------------------------------
# POST /review
# ---------------------------------------------------------------------------

def test_review_missing_fields_returns_422():
    resp = client.post("/review", json={})
    assert resp.status_code == 422


def test_review_returns_result(monkeypatch):
    from models.review import ReviewResponse, CriterionScore
    mock_result = ReviewResponse(
        scores=[CriterionScore(
            criterionName="Quality", level="Excellent",
            points=90, maxPoints=100, feedback="Great work",
        )],
        totalScore=90, totalPossible=100,
        strengths=["Clear thesis"], improvements=["Add citations"], nextSteps=["Revise"],
    )
    monkeypatch.setattr("main.run_review", AsyncMock(return_value=mock_result))

    resp = client.post("/review", json={
        "assignment_name": "Essay",
        "assignment_description": "Write an essay.",
        "rubric": {
            "criteria": [{
                "name": "Quality",
                "description": "Overall quality",
                "weight": 100,
                "levels": [{"label": "Excellent", "points": 100, "description": "Perfect"}],
            }],
            "totalPoints": 100,
        },
        "submission_text": "This is my essay about climate change.",
        "submission_files": [],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["totalScore"] == 90
    assert data["totalPossible"] == 100
