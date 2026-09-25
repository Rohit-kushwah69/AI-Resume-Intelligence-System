from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    chat_id: int | None = None


class ChatResponse(BaseModel):
    chat_id: int
    answer: str