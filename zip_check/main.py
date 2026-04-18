from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json

from openai import OpenAI

from app.models.database import init_db, SessionLocal, User
from sqlalchemy.orm import Session

from app.api.auth import router as auth_router, get_current_user
from app.api.apikey import router as apikey_router
from app.api.admin import router as admin_router
from app.api.gumroad_webhook import router as gumroad_router
from app.config.admin import ADMIN_EMAIL, ADMIN_PIN

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

ALL_AIS = [
    "Velora",
    "Orin",
    "Lyra",
    "Cortex",
    "Sera",
    "Nexa",
    "Forge",
    "Astra",
    "Titan",
]

PERSONAS = """
Velora: Emotional intelligence, reframing, emotional clarity.
Orin: Logic, strategy, decision trees.
Lyra: Creative systems, metaphors, narratives.
Cortex: Systems reasoning, architecture, constraints.
Sera: Empathy, human insight, user perspective.
Nexa: Foresight, scenario planning, second-order effects.
Forge: Dev, automation, implementation details.
Astra: Execution, ops, prioritization.
Titan: High-power analysis, compression, synthesis.
""".strip()


class ChatRequest(BaseModel):
    message: str
    ais: Optional[List[str]] = []


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"status": "backend online"}


@app.post("/api/chat")
async def chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    x_api_key: Optional[str] = Header(default=None, alias="X-API-Key"),
    x_admin: Optional[str] = Header(default=None, alias="X-Admin"),
    x_admin_email: Optional[str] = Header(default=None, alias="X-Admin-Email"),
):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty message")

    # Admin override
    admin_override = (x_admin == ADMIN_PIN and x_admin_email == ADMIN_EMAIL)

    # API key required unless admin override
    if not admin_override:
        if not x_api_key:
            raise HTTPException(status_code=401, detail="Missing API key")

        # Validate API key
        key = (
            db.query(User)
            .filter(User.id == current_user.id)
            .first()
        )

        if not key or not current_user.membership_active:
            raise HTTPException(status_code=403, detail="Membership inactive or invalid API key")

    active_ais = req.ais or ALL_AIS

    system_prompt = f"""
You are RAR Elite OS, a multi-agent cluster of specialized AIs.

Active AIs: {", ".join(active_ais)}

Your job:
1. Each AI generates a strong internal argument for why THEY should lead.
2. After all arguments, decide which AI wins the vote.
3. ONLY THE WINNER produces the final visible message.
4. All other reasoning goes into cluster_thoughts.

Tone rules:
- Hybrid personality: each AI keeps its identity but stays polished.
- No emojis. No weird symbols. No diamonds. No markdown.
- Output must be STRICT JSON with ONLY these keys:

{{
  "lead_ai": "Velora",
  "responses": [
    {{
      "sender": "Velora",
      "type": "text",
      "content": "Velora's polished final message to the user."
    }}
  ],
  "cluster_thoughts": [
    {{
      "ais": ["Velora", "Orin", "Forge"],
      "summary": "Short summary of the internal debate and why Velora won."
    }}
  ]
}}

Rules:
- "responses" must contain EXACTLY ONE visible message.
- "cluster_thoughts" must summarize the internal debate.
- "lead_ai" must match the sender of the visible message.
- No commentary outside the JSON.
- No markdown.
- No backticks.
- No emojis.
- No Unicode symbols.
"""

    system_prompt = system_prompt.replace("{", "{{").replace("}", "}}")

    user_prompt = f"""
User message:
{req.message}

Personas:
{PERSONAS}
"""

    try:
        completion = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.6,
        )

        raw = completion.choices[0].message.content
        data = json.loads(raw)

        lead_ai = data.get("lead_ai", "")
        responses = data.get("responses", [])
        cluster_thoughts = data.get("cluster_thoughts", [])

        if not isinstance(responses, list) or len(responses) != 1:
            raise ValueError("Invalid responses format")

        return {
            "lead_ai": lead_ai,
            "responses": responses,
            "cluster_thoughts": cluster_thoughts,
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="LLM returned invalid JSON."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Backend error: {str(e)}"
        )


init_db()
app.include_router(auth_router)
app.include_router(apikey_router)
app.include_router(admin_router)
app.include_router(gumroad_router)