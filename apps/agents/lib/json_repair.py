import json
import logging
import re

from ibm_watsonx_ai.foundation_models import ModelInference

logger = logging.getLogger(__name__)

REPAIR_PROMPT = "The following JSON is malformed. Fix it so it parses correctly. Return ONLY the corrected JSON, nothing else."


def extract_json(raw: str) -> str:
    """Strip markdown fences and whitespace from LLM output."""
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1].lstrip()
        if raw.startswith("json"):
            raw = raw[4:]
    return raw.strip()


def try_parse(raw: str) -> dict | list | None:
    """Attempt basic repairs before falling back to None."""
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # Try fixing common LLM issues: trailing commas, unescaped newlines in strings
    cleaned = re.sub(r",\s*([}\]])", r"\1", raw)  # trailing commas
    cleaned = re.sub(r'(?<!\\)\n', r'\\n', cleaned)  # unescaped newlines in strings
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


async def parse_llm_json(raw_response: str, model: ModelInference | None = None) -> dict | list:
    """Parse LLM JSON output with extraction, repair, and optional model retry."""
    raw = extract_json(raw_response)

    result = try_parse(raw)
    if result is not None:
        return result

    if model is not None:
        logger.warning("JSON parse failed, requesting model repair")
        try:
            resp = await model.achat(messages=[
                {"role": "system", "content": REPAIR_PROMPT},
                {"role": "user", "content": raw},
            ])
            repaired = extract_json(resp["choices"][0]["message"]["content"])
            return json.loads(repaired)
        except Exception:
            logger.exception("Model JSON repair also failed")

    raise json.JSONDecodeError("Failed to parse LLM JSON after repair attempts", raw, 0)
