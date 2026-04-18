from typing import Callable, Awaitable
from fastapi import Request, HTTPException

from models.entitlements_store import get_entitlement_for_user


class AccessLevel:
    ADMIN = "admin"
    USER = "user"
    NONE = "none"


async def access_middleware(request: Request, call_next: Callable[[Request], Awaitable]):
    request.state.access_level = AccessLevel.NONE
    request.state.entitlement = None

    admin_pin_header = request.headers.get("X-Admin-Pin")
    user_email = request.headers.get("X-User-Email")

    expected_admin_pin = getattr(request.app.state, "admin_pin", None)
    if expected_admin_pin and admin_pin_header == expected_admin_pin:
        request.state.access_level = AccessLevel.ADMIN
        return await call_next(request)

    if user_email:
        ent = get_entitlement_for_user(user_email)
        if ent:
            request.state.access_level = AccessLevel.USER
            request.state.entitlement = ent
            return await call_next(request)

    path = request.url.path
    if path.startswith("/gumroad/webhook") or path.startswith("/health"):
        return await call_next(request)

    raise HTTPException(
        status_code=401,
        detail="Unauthorized: missing or invalid access",
    )