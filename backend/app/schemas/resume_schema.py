from pydantic import BaseModel
from typing import Optional


class ResumeCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    projects: Optional[str] = None
    resume_text: Optional[str] = None


class ResumeResponse(ResumeCreate):
    id: int

    class Config:
        from_attributes = True