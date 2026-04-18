from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session

from app.models.database import SessionLocal, ApiKey, Entitlements, User

ADMIN_PIN = "1321"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class APIKeyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # -----------------------------
        # PUBLIC / UNPROTECTED PATHS
        # -----------------------------
        if path in {"/", "/docs", "/openapi.json", "/redoc", "/health"}:
            return await call_next(request)

        # Auth + key management + validation stay public
        if (
            path.startswith("/api/auth")
            or path.startswith("/api/key")
            or path.startswith("/api/validate-key")
        ):
            return await call_next(request)

        # -----------------------------
        # ADMIN BYPASS
        # -----------------------------
        admin_header = request.headers.get("X-Admin")
        if admin_header == ADMIN_PIN:
            return await call_next(request)

        # -----------------------------
        # PROTECTED ENDPOINTS
        # -----------------------------
        if path.startswith("/api"):
            api_key = request.headers.get("X-API-Key")
            if not api_key:
                raise HTTPException(status_code=401, detail="Missing API key")

            # DB validation
            db: Session = SessionLocal()
            try:
                key_obj = (
                    db.query(ApiKey)
                    .filter(ApiKey.key == api_key.strip(), ApiKey.revoked == False)
                    .first()
                )
                if not key_obj:
                    raise HTTPException(
                        status_code=401, detail="API key not found or revoked"
                    )

                user = db.query(User).filter(User.id == key_obj.user_id).first()
                if not user:
                    raise HTTPException(
                        status_code=401, detail="User not found for API key"
                    )

                ent = (
                    db.query(Entitlements)
                    .filter(Entitlements.user_id == user.id)
                    .first()
                )
                if not ent or not ent.api_access:
                    raise HTTPException(
                        status_code=402, detail="API access requires payment"
                    )
            finally:
                db.close()

            return await call_next(request)

        # Fallback: anything else just passes through
        return await call_next(request)