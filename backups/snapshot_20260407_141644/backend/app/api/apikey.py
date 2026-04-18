from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.database import SessionLocal
from app.models.apikey import ApiKey, generate_api_key

router = APIRouter(prefix="/api/key", tags=["API Keys"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def validate_api_key(x_api_key: str = Header(None), db: Session = Depends(get_db)):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="Missing API key")

    api_key = db.query(ApiKey).filter(
        ApiKey.key == x_api_key,
        ApiKey.active == True,
        ApiKey.revoked == False
    ).first()

    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

    api_key.usage_count += 1
    api_key.last_used = datetime.utcnow()
    db.add(api_key)
    db.commit()

    return api_key

@router.post("/create")
def create_api_key(owner_email: str, db: Session = Depends(get_db)):
    existing = db.query(ApiKey).filter(
        ApiKey.owner_email == owner_email,
        ApiKey.active == True,
        ApiKey.revoked == False
    ).first()

    if existing:
        return {"api_key": existing.key}

    new_key = generate_api_key()
    api_key = ApiKey(
        key=new_key,
        owner_email=owner_email
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)

    return {"api_key": api_key.key}

@router.get("/info")
def get_key_info(owner_email: str, db: Session = Depends(get_db)):
    api_key = db.query(ApiKey).filter(
        ApiKey.owner_email == owner_email,
        ApiKey.active == True,
        ApiKey.revoked == False
    ).first()

    if not api_key:
        raise HTTPException(status_code=404, detail="No active key found")

    return {
        "api_key": api_key.key,
        "usage_count": api_key.usage_count,
        "last_used": api_key.last_used,
        "created_at": api_key.created_at,
    }

@router.post("/regenerate")
def regenerate_key(owner_email: str, db: Session = Depends(get_db)):
    api_key = db.query(ApiKey).filter(
        ApiKey.owner_email == owner_email,
        ApiKey.active == True,
        ApiKey.revoked == False
    ).first()

    if not api_key:
        raise HTTPException(status_code=404, detail="No active key found")

    new_key = generate_api_key()
    api_key.key = new_key
    api_key.usage_count = 0
    api_key.last_used = None
    db.add(api_key)
    db.commit()
    db.refresh(api_key)

    return {"api_key": api_key.key}

@router.post("/revoke")
def revoke_key(owner_email: str, db: Session = Depends(get_db)):
    api_key = db.query(ApiKey).filter(
        ApiKey.owner_email == owner_email,
        ApiKey.active == True,
        ApiKey.revoked == False
    ).first()

    if not api_key:
        raise HTTPException(status_code=404, detail="No active key found")

    api_key.revoked = True
    api_key.active = False
    db.add(api_key)
    db.commit()

    return {"detail": "API key revoked"}
