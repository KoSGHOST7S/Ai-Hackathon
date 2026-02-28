import json
import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.env"))

from lib.file_parser import parse_file
from models.assignment import AnalyzeRequest, AnalyzeResponse
from models.chat import ChatRequest
from models.review import ReviewRequest, ReviewResponse
from workflow.pipeline import run_pipeline, stream_pipeline
from workflow.review_pipeline import run_review, stream_review


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # add warm-up here if needed


app = FastAPI(title="Assignmint Agents", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/parse-file")
async def parse_file_endpoint(file: UploadFile = File(...)) -> dict:
    content = await file.read()
    text = parse_file(content, file.filename or "unknown")
    if text is None:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.filename}")
    return {"name": file.filename, "text": text[:10000]}


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


@app.post("/review", response_model=ReviewResponse)
async def review(req: ReviewRequest) -> ReviewResponse:
    try:
        return await run_review(req)
    except Exception as exc:
        logging.exception("Review pipeline failed")
        raise HTTPException(status_code=502, detail=str(exc))


@app.post("/review/stream")
async def review_stream(req: ReviewRequest) -> StreamingResponse:
    async def event_generator():
        try:
            async for chunk in stream_review(req):
                yield chunk
        except Exception as exc:
            logging.exception("Stream review failed")
            yield f'event: error\ndata: {json.dumps({"error": str(exc)})}\n\n'
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    async def generate():
        try:
            from lib.watsonx import get_model
            model = get_model()
            messages = [
                {"role": "system", "content": req.system_context},
                *[{"role": m.role, "content": m.content} for m in req.messages],
            ]
            resp = model.chat(messages=messages)
            content = resp["choices"][0]["message"]["content"]
            yield f'event: done\ndata: {json.dumps({"content": content})}\n\n'
        except Exception as exc:
            logging.exception("Chat failed")
            yield f'event: error\ndata: {json.dumps({"error": str(exc)})}\n\n'

    return StreamingResponse(generate(), media_type="text/event-stream")
