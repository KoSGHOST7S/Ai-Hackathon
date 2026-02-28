import json
import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../../.env"))

from models.assignment import AnalyzeRequest, AnalyzeResponse
from workflow.pipeline import run_pipeline, stream_pipeline


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # add warm-up here if needed


app = FastAPI(title="Assignmint Agents", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    try:
        return await run_pipeline(req)
    except Exception as exc:
        logging.exception("Pipeline failed")
        raise HTTPException(status_code=502, detail=str(exc))


@app.post("/analyze/stream")
async def analyze_stream(req: AnalyzeRequest) -> StreamingResponse:
    async def event_generator():
        try:
            async for chunk in stream_pipeline(req):
                yield chunk
        except Exception as exc:
            logging.exception("Stream pipeline failed")
            yield f'event: error\ndata: {json.dumps({"error": str(exc)})}\n\n'

    return StreamingResponse(event_generator(), media_type="text/event-stream")
