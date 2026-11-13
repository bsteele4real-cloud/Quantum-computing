import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm import MissingGitHubTokenError, call_llm
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Local pages the lesson actually serves. Override with CORS_ORIGINS
# (comma-separated). A "*" entry never enables credentials.
DEFAULT_CORS_ORIGINS = (
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
)


def resolve_cors(environ=None):
    """Return (origins, allow_credentials) safe for browser CORS."""
    source = os.environ if environ is None else environ
    raw = source.get("CORS_ORIGINS", ",".join(DEFAULT_CORS_ORIGINS))
    origins = [part.strip() for part in raw.split(",") if part.strip()]
    if not origins:
        origins = list(DEFAULT_CORS_ORIGINS)
    if "*" in origins:
        return ["*"], False
    flag = source.get("CORS_ALLOW_CREDENTIALS", "").strip().lower()
    allow_credentials = flag in {"1", "true", "yes", "on"}
    return origins, allow_credentials


# Create FastAPI application
app = FastAPI(
    title="AI Chat API",
    description="A high-performance API for AI-powered chat applications",
    version="1.0.0"
)

allowed_origins, allow_credentials = resolve_cors()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class HealthResponse(BaseModel):
    status: str
    service: str

@app.get("/")
async def index():
    """Root endpoint for API status."""
    return {
        "status": "ok",
        "message": "Welcome to the Chat Project API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint. Does not need GITHUB_TOKEN."""
    return HealthResponse(status="healthy", service="ai-chat-api")

@app.get("/test")
async def test():
    """Simple test endpoint."""
    return {"result": "Test successful"}

@app.post("/hello", response_model=ChatResponse)
async def hello(chat_message: ChatMessage):
    """
    Chat endpoint.
    Expects JSON: { "message": "your message" }
    Returns: { "response": "LLM response" }
    """
    try:
        message = chat_message.message.strip()
        if not message:
            logger.warning("Empty message provided in request.")
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        logger.info("Received message of length %s", len(message))
        response = call_llm(message, "You are a helpful assistant.")
        logger.info("LLM response generated successfully")
        return ChatResponse(response=response)

    except HTTPException:
        raise
    except MissingGitHubTokenError as exc:
        logger.error("Chat request missing GITHUB_TOKEN")
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as e:
        logger.error("Error in /hello endpoint: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error") from e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=True)
