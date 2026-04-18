from fastapi import APIRouter, Header, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.database import SessionLocal, ApiKey, Entitlements, User

router = APIRouter(tags=["validation"])


class ValidateResponse(BaseModel):
    valid: bool
    user_id: int | None = None
    api_access: bool | None = None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/api/validate-key", response_model=ValidateResponse)
def validate_key(
    x_api_key: str = Header(None, alias="X-API-Key"),
    db: Session = Depends(get_db),
):
    if not x_api_key or len(x_api_key.strip()) < 10:
        raise HTTPException(status_code=401, detail="Invalid API key")

    api_key = (
        db.query(ApiKey)
        .filter(ApiKey.key == x_api_key.strip(), ApiKey.revoked == False)
        .first()
    )

    if not api_key:
        raise HTTPException(status_code=401, detail="API key not found or revoked")

    user = db.query(User).filter(User.id == api_key.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found for API key")

    ent = db.query(Entitlements).filter(Entitlements.user_id == user.id).first()
    if not ent or not ent.api_access:
        raise HTTPException(status_code=402, detail="API access requires payment")

    return ValidateResponse(valid=True, user_id=user.id, api_access=ent.api_access)