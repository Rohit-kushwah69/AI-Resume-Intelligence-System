from sqlalchemy import Column, Integer, String, Text, DateTime

from datetime import datetime

from .database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    # Personal Information
    name = Column(String(100), nullable=True)
    email = Column(String(150), nullable=True)
    phone = Column(String(20), nullable=True)

    # Resume Information
    education = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)

    # AI Resume Intelligence
    resume_score = Column(Integer, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_strengths = Column(Text, nullable=True)
    ai_weaknesses = Column(Text, nullable=True)
    ai_missing_skills = Column(Text, nullable=True)
    ai_suggestions = Column(Text, nullable=True)

    # Original Resume
    resume_text = Column(Text, nullable=True)
    file_name = Column(String(255), nullable=True)
    file_path = Column(String(500), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # Existing models ke neeche

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    company = Column(String(200), nullable=True)

    description = Column(Text, nullable=False)

    required_skills = Column(Text, nullable=True)

    experience_required = Column(String(100), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )