import sys
import traceback
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pipeline import run_research_pipeline
from concurrent.futures import ThreadPoolExecutor
import asyncio

app = FastAPI(title="Multi-Agent Research API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thread pool for running the blocking research pipeline
_executor = ThreadPoolExecutor(max_workers=4)

class ResearchRequest(BaseModel):
    topic: str

@app.get("/health")
async def health():
    """Health check endpoint to verify the backend is running."""
    return {"status": "ok", "message": "Backend is running"}

@app.post("/research")
async def research(req: ResearchRequest):
    """
    Run the multi-agent research pipeline.
    Executes the blocking pipeline in a thread pool to avoid blocking the event loop.
    """
    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(
            _executor, run_research_pipeline, req.topic
        )
        return result
    except Exception as e:
        error_detail = {
            "error": str(e),
            "traceback": traceback.format_exc(),
        }
        print("\n[ERROR] Research pipeline failed:", error_detail["traceback"])
        raise HTTPException(status_code=500, detail=error_detail["error"])