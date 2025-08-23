from pydantic import BaseModel
from typing import Optional

class QueryRequest(BaseModel):
    user_id: str
    query: str

class QueryResponse(BaseModel):
    status: str
    response: str
    question: str
    step: str
    logs: list