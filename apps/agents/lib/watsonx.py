import os
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.foundation_models.schema._api import TextChatParameters

# Default completion token budget. The WatsonX default of 1024 is too small for
# reasoning models (openai/gpt-oss-120b uses tokens for reasoning_content before
# writing actual content, and was exhausting the budget before producing output).
# Use max_completion_tokens (not max_tokens) — required for newer reasoning models.
_DEFAULT_PARAMS = TextChatParameters(max_completion_tokens=8192)


def get_model(model_id: str | None = None) -> ModelInference:
    credentials = Credentials(
        url=os.environ["WATSONX_URL"],
        api_key=os.environ["WATSONX_API_KEY"],
    )
    client = APIClient(credentials=credentials)
    return ModelInference(
        model_id=model_id or os.environ.get("GRANITE_MODEL", "openai/gpt-oss-120b"),
        api_client=client,
        project_id=os.environ["WATSONX_PROJECT_ID"],
        params=_DEFAULT_PARAMS,
    )
