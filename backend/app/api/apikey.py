import secrets
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.database import SessionLocal, ApiKey, User
from app.api.auth import get_current_user
from app.config.admin import ADMIN_EMAIL, ADMIN_PIN

router = APIRouter(prefix="/api/key", tags=["api-keys"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CreateKeyResponse(BaseModel):
    key: str
    id: int


class ApiKeyInfo(BaseModel):
    id: int
    key: str
    revoked: bool
    created_at: str


def require_membership(user: User):
    if user.membership_active:
        return
    raise HTTPException(status_code=402, detail="API access requires an active membership.")


@router.post("/create", response_model=CreateKeyResponse)
def create_key(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    x_admin: str | None = Header(default=None, alias="X-Admin"),
    x_admin_email: str | None = Header(default=None, alias="X-Admin-Email"),
):
    # Admin bypass
    if not (x_admin == ADMIN_PIN and x_admin_email == ADMIN_EMAIL):
        require_membership(current_user)

    new_key = secrets.token_hex(32)

    api_key = ApiKey(
        user_id=current_user.id,
        key=new_key,
        revoked=False,
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)

    return CreateKeyResponse(key=new_key, id=api_key.id)


@router.get("/list", response_model=list[ApiKeyInfo])
def list_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    x_admin: str | None = Header(default=None, alias="X-Admin"),
    x_admin_email: str | None = Header(default=None, alias="X-Admin-Email"),
):
    if x_admin == ADMIN_PIN and x_admin_email == ADMIN_EMAIL:
        keys = db.query(ApiKey).all()
    else:
        require_membership(current_user)
        keys = db.query(ApiKey).filter(ApiKey.user_id == current_user.id).all()

    return [
        ApiKeyInfo(
            id=k.id,
            key=k.key,
            revoked=k.revoked,
            created_at=str(k.created_at),
        )
        for k in keys
    ]


@router.post("/revoke/{key_id}")
def revoke_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    x_admin: str | None = Header(default=None, alias="X-Admin"),
    x_admin_email: str | None = Header(default=None, alias="X-Admin-Email"),
):
    api_key = db.query(ApiKey).filter(ApiKey.id == key_id).first()
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")

    if not (x_admin == ADMIN_PIN and x_admin_email == ADMIN_EMAIL):
        if api_key.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not your API key")
        require_membership(current_user)

    api_key.revoked = True
    db.commit()

    return {"status": "revoked", "id": key_id}


@router.post("/regenerate/{key_id}", response_model=CreateKeyResponse)
def regenerate_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    x_admin: str | None = Header(default=None, alias="X-Admin"),
    x_admin_email: str | None = Header(default=None, alias="X-Admin-Email"),
):
    api_key = db.query(ApiKey).filter(ApiKey.id == key_id).first()
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")

    if not (x_admin == ADMIN_PIN and x_admin_email == ADMIN_EMAIL):
        if api_key.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not your API key")
        require_membership(current_user)

    api_key.revoked = True

    new_key = secrets.token_hex(32)
    new_api_key = ApiKey(
        user_id=api_key.user_id,
        key=new_key,
        revoked=False,
    )
    db.add(new_api_key)
    db.commit()
    db.refresh(new_api_key)

    return CreateKeyResponse(key=new_key, id=new_api_key.id)