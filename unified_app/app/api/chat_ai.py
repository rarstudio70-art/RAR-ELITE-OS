import os
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, Request, status
import openai

from models.entitlements_store import get_entitlement_for_user

router = APIRouter(prefix="/chat", tags=["chat"])

openai.api_key = os.getenv("OPENAI_API_KEY", "")


@router.post("/")
async def chat(request: Request, body: Dict[str, Any]):
    if not openai.api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI API key not configured",
        )

    email = request.headers.get("X-User-Email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-User-Email header",
        )

    ent = get_entitlement_for_user(email)
    if not ent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No entitlement for this user",
        )

    message = body.get("message")
    if not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'message' in body",
        )

    try:
        completion = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are RAR Elite OS assistant."},
                {"role": "user", "content": message},
            ],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Upstream AI error: {e}",
        )

    reply = completion.choices[0].message["content"]
    return {"reply": reply}