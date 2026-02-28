import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../../.env"))

from models.assignment import AnalyzeRequest, AnalyzeResponse
from workflow.pipeline import run_pipeline


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # add warm-up here if needed


app = FastAPI(title="Assignmint Agents", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    return await run_pipeline(req)
