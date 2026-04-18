from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os

from app.api.rainmaker import router as rainmaker_router

# Load backend/.env explicitly (works with uvicorn reload subprocess on Windows)
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path, override=True)

# DEBUG (prints True/False only, not your key)
print("ENV LOADED:", bool(os.getenv("OPENAI_API_KEY")))

app = FastAPI(title="RAR Elite OS Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rainmaker_router, prefix="/api")

@app.get("/health")
def health():
    return {"ok": True, "service": "rar-backend"}
