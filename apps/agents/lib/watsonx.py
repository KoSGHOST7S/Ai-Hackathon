import asyncio
import logging
import os
import time

from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.foundation_models.schema._api import TextChatParameters
from ibm_watsonx_ai.wml_client_error import ApiRequestFailure

logger = logging.getLogger(__name__)

# Default completion token budget. The WatsonX default of 1024 is too small for
# reasoning models (openai/gpt-oss-120b uses tokens for reasoning_content before
# writing actual content, and was exhausting the budget before producing output).
# Use max_completion_tokens (not max_tokens) — required for newer reasoning models.
_DEFAULT_PARAMS = TextChatParameters(max_completion_tokens=8192)

_MAX_RETRIES = 5
_BASE_DELAY = 2  # seconds

# Module-level singleton — creating APIClient involves auth and is expensive.
# Re-use across requests unless env vars change (restart required for changes).
_model_singleton: ModelInference | None = None
_model_id_cache: str | None = None


class _RetryModelInference:
    """Wraps ModelInference to retry on 429 rate-limit errors with exponential backoff.

    model.chat() is a synchronous/blocking call. To avoid blocking the asyncio event
    loop in FastAPI, all public methods dispatch through asyncio.to_thread().
    """

    def __init__(self, model: ModelInference):
        self._model = model

    def _chat_sync(self, **kwargs):
        """Synchronous chat with retry — intended to be called via asyncio.to_thread."""
        for attempt in range(_MAX_RETRIES):
            try:
                return self._model.chat(**kwargs)
            except ApiRequestFailure as exc:
                if "429" in str(exc) and attempt < _MAX_RETRIES - 1:
                    delay = _BASE_DELAY * (2 ** attempt)
                    logger.warning(
                        "Rate limited (429), retrying in %ds (attempt %d/%d)",
                        delay, attempt + 1, _MAX_RETRIES,
                    )
                    time.sleep(delay)
                else:
                    raise

    def chat(self, **kwargs):
        """Blocking chat — kept for backward-compat with sync callers.

        Async callers should use achat() to avoid blocking the event loop.
        """
        return self._chat_sync(**kwargs)

    async def achat(self, **kwargs):
        """Non-blocking async wrapper — runs model.chat in a thread pool."""
        return await asyncio.to_thread(self._chat_sync, **kwargs)

    def __getattr__(self, name):
        return getattr(self._model, name)


def get_model(model_id: str | None = None) -> "_RetryModelInference":
    global _model_singleton, _model_id_cache

    effective_id = model_id or os.environ.get("GRANITE_MODEL", "openai/gpt-oss-120b")

    # Return cached singleton when the model ID hasn't changed.
    if _model_singleton is not None and effective_id == _model_id_cache:
        return _model_singleton  # type: ignore[return-value]

    credentials = Credentials(
        url=os.environ["WATSONX_URL"],
        api_key=os.environ["WATSONX_API_KEY"],
    )
    client = APIClient(credentials=credentials)
    model = ModelInference(
        model_id=effective_id,
        api_client=client,
        project_id=os.environ["WATSONX_PROJECT_ID"],
        params=_DEFAULT_PARAMS,
    )
    wrapped = _RetryModelInference(model)
    _model_singleton = wrapped  # type: ignore[assignment]
    _model_id_cache = effective_id
    return wrapped  # type: ignore[return-value]
