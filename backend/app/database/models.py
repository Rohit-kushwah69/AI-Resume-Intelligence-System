from sqlalchemy import Column, Integer, String, Text, DateTime, Float
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

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)

    resume_id = Column(Integer, nullable=False)
    job_id = Column(Integer, nullable=False)

    final_match_score = Column(Float, nullable=True)
    exact_skill_score = Column(Float, nullable=True)
    semantic_skill_score = Column(Float, nullable=True)
    experience_score = Column(Float, nullable=True)

    matched_skills = Column(Text, nullable=True)
    missing_skills = Column(Text, nullable=True)

    ai_analysis = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

# =========================
# ADMIN MODEL
# =========================

class Admin(Base):
    __tablename__ = "admins"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    password = Column(
        String(255),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )