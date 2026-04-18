import re

def simple_intent_and_score(text: str) -> tuple[str, int]:
    t = text.lower().strip()

    score = 35
    intent = "general"

    if any(x in t for x in ["price", "cost", "how much", "quote"]):
        intent = "pricing"
        score += 15
    if any(x in t for x in ["book", "schedule", "appointment", "call"]):
        intent = "booking"
        score += 20
    if any(x in t for x in ["ready", "today", "now", "pay", "deposit"]):
        intent = "buying_signal"
        score += 25
    if any(x in t for x in ["not sure", "think", "maybe later", "compare"]):
        intent = "hesitation"
        score -= 5
    if any(x in t for x in ["refund", "complain", "angry", "lawyer"]):
        intent = "complaint"
        score += 10

    if re.search(r"\b(asap|urgent|today|now)\b", t):
        score += 10

    score = max(0, min(100, score))
    return intent, score

def stage_from_score(score: int) -> str:
    if score >= 85:
        return "Hot"
    if score >= 65:
        return "Qualified"
    if score >= 45:
        return "New"
    return "Cold"
