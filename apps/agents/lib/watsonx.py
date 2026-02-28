import os
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference


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
    )
