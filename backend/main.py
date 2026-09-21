from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Multi-Agent AI Research API")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Multi-Agent AI Research API is running"}

@app.post("/research")
def research(request: ResearchRequest):
    """
    Exposes /research endpoint.
    Pipeline integration can be triggered here.
    """
    if not request.topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    return {
        "status": "pending",
        "topic": request.topic,
        "message": "Endpoint ready for pipeline execution"
    }
