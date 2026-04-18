from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.database import SessionLocal, User
from app.config.admin import ADMIN_PIN, ADMIN_EMAIL

router = APIRouter(prefix="/api/admin", tags=["admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class AdminSetMembershipRequest(BaseModel):
    email: str
    active: bool


@router.post("/set-membership")
def set_membership(
    req: AdminSetMembershipRequest,
    db: Session = Depends(get_db),
    x_admin: str | None = Header(default=None, alias="X-Admin"),
    x_admin_email: str | None = Header(default=None, alias="X-Admin-Email"),
):
    if not (x_admin == ADMIN_PIN and x_admin_email == ADMIN_EMAIL):
        raise HTTPException(status_code=403, detail="Admin PIN required")

    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.membership_active = req.active
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "status": "ok",
        "email": user.email,
        "membership_active": user.membership_active,
    }