from pydantic import BaseModel
from typing import List, Optional


class JobCreate(BaseModel):
    title: str
    company: Optional[str] = None
    description: str
    required_skills: List[str] = []
    experience_required: Optional[str] = None


class JobResponse(BaseModel):
    id: int
    title: str
    company: Optional[str]
    description: str
    required_skills: List[str]
    experience_required: Optional[str]

    class Config:
        from_attributes = True