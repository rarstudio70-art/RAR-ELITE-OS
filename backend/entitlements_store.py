# entitlements_store.py

ENTITLEMENTS = {}

def get_user_entitlements(email: str):
    return ENTITLEMENTS.get(email.lower(), {})

def set_entitlement(email: str, ai_name: str, active: bool):
    email = email.lower()
    if email not in ENTITLEMENTS:
        ENTITLEMENTS[email] = {}
    ENTITLEMENTS[email][ai_name] = active