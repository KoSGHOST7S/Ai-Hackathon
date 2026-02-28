"""
Assignmint agents service — IBM watsonx.ai multi-agent workflow.

Quick test:
    uv run python main.py
"""

from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
import os

WATSONX_API_KEY = os.getenv("WATSONX_API_KEY", "rfMPObfbIg9rSxDixvPkzaH8X_CtY7w0VzDM0M6DYajI")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID", "089dbbdc-61a7-4295-8c69-d455c403d6bf")
WATSONX_URL = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com/")
GRANITE_MODEL = os.getenv("GRANITE_MODEL", "ibm/granite-4-h-small")


def get_client() -> APIClient:
    return APIClient(credentials=Credentials(url=WATSONX_URL, api_key=WATSONX_API_KEY))


def get_model(client: APIClient, model_id: str = GRANITE_MODEL) -> ModelInference:
    return ModelInference(model_id=model_id, api_client=client, project_id=WATSONX_PROJECT_ID)


if __name__ == "__main__":
    client = get_client()
    print(f"watsonx client OK  (sdk {client.version})")

    model = get_model(client)
    resp = model.chat(messages=[
        {"role": "user", "content": "List 3 rubric criteria for a Python programming assignment. Be brief."}
    ])
    print("\n--- Granite response ---")
    print(resp["choices"][0]["message"]["content"])
t