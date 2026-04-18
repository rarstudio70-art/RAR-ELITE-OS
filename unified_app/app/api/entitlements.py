from fastapi import APIRouter, HTTPException, Request
from app.models.entitlements_store import get_entitlement, entitlements

router = APIRouter(prefix="/entitlements", tags=["entitlements"])

@router.get("/me")
async def my_entitlements(request: Request):
    email = request.headers.get("X-User-Email")
    if not email:
        raise HTTPException(status_code=401, detail="Missing X-User-Email header")

    ent = get_entitlement(email)
    if not ent:
        raise HTTPException(status_code=404, detail="No entitlement found")

    return ent


@router.get("/all")
async def all_entitlements(request: Request):
    admin_pin = request.headers.get("X-Admin")
    if admin_pin != request.app.state.admin_pin:
        raise HTTPException(status_code=403, detail="Invalid admin PIN")

    return entitlements