from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from .database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=True)

    email = Column(String(150), nullable=True)

    phone = Column(String(20), nullable=True)

    education = Column(Text, nullable=True)

    skills = Column(Text, nullable=True)

    experience = Column(Text, nullable=True)

    projects = Column(Text, nullable=True)

    resume_text = Column(Text, nullable=True)

    file_name = Column(String(255), nullable=True)

    file_path = Column(String(500), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )