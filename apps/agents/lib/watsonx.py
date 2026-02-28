import os
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference

# Default completion token budget. The WatsonX default of 1024 is too small for
# reasoning models (openai/gpt-oss-120b uses tokens for reasoning_content before
# writing actual content, and was exhausting the budget before producing output).
_DEFAULT_MAX_TOKENS = 8192


def get_model(model_id: str | None = None) -> ModelInference:
    credentials = Credentials(
        url=os.environ["WATSONX_URL"],
        api_key=os.environ["WATSONX_API_KEY"],
    )
    client = APIClient(credentials=credentials)
    model = ModelInference(
        model_id=model_id or os.environ.get("GRANITE_MODEL", "openai/gpt-oss-120b"),
        api_client=client,
        project_id=os.environ["WATSONX_PROJECT_ID"],
    )
    # Wrap chat() so all callers get a sane max_tokens default without requiring
    # every call site to pass params explicitly.
    _orig_chat = model.chat
    def _chat(messages, params=None, **kwargs):
        p = dict(params) if params else {}
        p.setdefault("max_tokens", _DEFAULT_MAX_TOKENS)
        return _orig_chat(messages=messages, params=p, **kwargs)
    model.chat = _chat  # type: ignore[method-assign]
    return model
