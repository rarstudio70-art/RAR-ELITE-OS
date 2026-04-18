from fastapi import APIRouter, HTTPException

from app.models.rainmaker import RainmakerMessageIn, RainmakerMessageOut
from app.services.scoring import simple_intent_and_score, stage_from_score
from app.services.llm import call_rainmaker

router = APIRouter()

@router.post("/rainmaker/message", response_model=RainmakerMessageOut)
def rainmaker_message(payload: RainmakerMessageIn):
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="message is required")

    intent, score = simple_intent_and_score(payload.message)
    stage = stage_from_score(score)

    data = call_rainmaker(
        message=payload.message,
        mode=payload.mode,
        intent=intent,
        score=score,
        stage=stage,
    )

    return RainmakerMessageOut(**data)
