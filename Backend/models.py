from pydantic import BaseModel
from typing import Optional

class BotInteraction(BaseModel):
    user_id: str
    question: str
    response: str
    status: str
    step: str
