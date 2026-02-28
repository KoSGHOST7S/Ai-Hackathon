"""Tests for lib/json_repair.py — no external services required."""
import asyncio
import json
import pytest

from lib.json_repair import extract_json, try_parse, parse_llm_json


# ---------------------------------------------------------------------------
# extract_json
# ---------------------------------------------------------------------------

def test_extract_json_plain():
    assert extract_json('{"a": 1}') == '{"a": 1}'


def test_extract_json_strips_markdown_fence():
    raw = "```json\n{\"a\": 1}\n```"
    assert extract_json(raw) == '{"a": 1}'


def test_extract_json_strips_fence_without_lang():
    raw = "```\n{\"a\": 1}\n```"
    assert extract_json(raw) == '{"a": 1}'


def test_extract_json_strips_whitespace():
    assert extract_json("  \n  [1,2,3]  \n  ") == "[1,2,3]"


# ---------------------------------------------------------------------------
# try_parse
# ---------------------------------------------------------------------------

def test_try_parse_valid_dict():
    assert try_parse('{"x": 42}') == {"x": 42}


def test_try_parse_valid_list():
    assert try_parse('[1, 2, 3]') == [1, 2, 3]


def test_try_parse_trailing_comma():
    result = try_parse('{"a": 1,}')
    assert result == {"a": 1}


def test_try_parse_invalid_returns_none():
    assert try_parse("not json at all !!!") is None


def test_try_parse_empty_string_returns_none():
    assert try_parse("") is None


# ---------------------------------------------------------------------------
# parse_llm_json (async)
# ---------------------------------------------------------------------------

def test_parse_llm_json_valid():
    result = asyncio.run(parse_llm_json('{"rubric": []}'))
    assert result == {"rubric": []}


def test_parse_llm_json_markdown_wrapped():
    raw = "```json\n{\"milestones\": []}\n```"
    result = asyncio.run(parse_llm_json(raw))
    assert result == {"milestones": []}


def test_parse_llm_json_trailing_comma():
    result = asyncio.run(parse_llm_json('{"a": 1,}'))
    assert result == {"a": 1}


def test_parse_llm_json_raises_without_model():
    with pytest.raises(json.JSONDecodeError):
        asyncio.run(parse_llm_json("totally broken {{{"))


def test_parse_llm_json_model_repair(monkeypatch):
    """When JSON is broken, parse_llm_json asks the model to repair it."""
    class FakeModel:
        async def achat(self, messages):
            return {"choices": [{"message": {"content": '{"fixed": true}'}}]}

    result = asyncio.run(parse_llm_json("broken json", model=FakeModel()))
    assert result == {"fixed": True}


def test_parse_llm_json_model_repair_fails_gracefully(monkeypatch):
    """If model repair also fails, JSONDecodeError is raised."""
    class BrokenModel:
        async def achat(self, **kwargs):
            raise RuntimeError("network error")

    with pytest.raises(json.JSONDecodeError):
        asyncio.run(parse_llm_json("broken json", model=BrokenModel()))
