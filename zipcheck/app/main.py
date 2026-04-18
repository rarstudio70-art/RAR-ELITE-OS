from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.gumroad_webhook import router as gumroad_router
from app.api.entitlements import router as entitlements_router
from app.api.chat_ai import router as chat_router

from app.middleware.access import access_middleware

app = FastAPI(
    title="RAR Elite OS Backend",
    version="1.0.0"
)

# Admin PIN for entitlement admin access
app.state.admin_pin = "1321"

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Access control middleware (entitlements + admin)
app.middleware("http")(access_middleware)

# Routers
app.include_router(gumroad_router)
app.include_router(entitlements_router)
app.include_router(chat_router)

@app.get("/health")
def health():
    return {"ok": True, "service": "rar-backend"}