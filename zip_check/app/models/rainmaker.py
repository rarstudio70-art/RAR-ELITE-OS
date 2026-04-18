from pydantic import BaseModel, Field

class RainmakerMessageIn(BaseModel):
    workspace_id: str = Field(default="default")
    lead_id: str = Field(default="demo")
    mode: str = Field(default="Discovery")
    message: str

class RainmakerMessageOut(BaseModel):
    reply: str
    intent: str
    stage: str
    score: int
    next_action: str
    escalate: bool
