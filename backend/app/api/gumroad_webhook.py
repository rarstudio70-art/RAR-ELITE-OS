from fastapi import APIRouter, Request, HTTPException
from sqlalchemy.orm import Session
from app.models.database import SessionLocal, User
import uuid

router = APIRouter(prefix="/gumroad", tags=["gumroad"])


@router.post("/webhook")
async def gumroad_webhook(request: Request):
    payload = await request.form()

    email = payload.get("email")
    product_name = payload.get("product_name")
    sale = payload.get("sale") == "true"
    refunded = payload.get("refunded") == "true"

    if not email or not product_name:
        raise HTTPException(status_code=400, detail="Missing email or product_name")

    db: Session = SessionLocal()
    try:
        # Find existing user
        user = db.query(User).filter(User.email == email).first()

        # Auto-create user if not found
        if not user:
            user = User(
                email=email,
                password_hash=str(uuid.uuid4()),  # random placeholder password
                membership_active=False,
            )
            db.add(user)
            db.flush()  # ensures user.id is available

        # Apply purchase or refund
        if sale:
            user.membership_active = True

        if refunded:
            user.membership_active = False

        db.add(user)
        db.commit()

        return {"status": "ok", "email": email, "product": product_name}

    finally:
        db.close()