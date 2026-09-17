import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Job, Resume
from ..schemas.job_schema import JobCreate
from ..services.job_matcher import calculate_job_match


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


# =========================
# CREATE JOB
# =========================

@router.post("/")
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db)
):
    job = Job(
        title=job_data.title,
        company=job_data.company,
        description=job_data.description,
        required_skills=json.dumps(
            job_data.required_skills
        ),
        experience_required=job_data.experience_required
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return {
        "message": "Job created successfully",
        "job": {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "description": job.description,
            "required_skills": job_data.required_skills,
            "experience_required": job.experience_required
        }
    }


# =========================
# GET ALL JOBS
# =========================

@router.get("/")
def get_jobs(
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).all()

    result = []

    for job in jobs:
        result.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "description": job.description,
            "required_skills": json.loads(
                job.required_skills
            ) if job.required_skills else [],
            "experience_required": job.experience_required
        })

    return result


# =========================
# GET SINGLE JOB
# =========================

@router.get("/{job_id}")
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "required_skills": json.loads(
            job.required_skills
        ) if job.required_skills else [],
        "experience_required": job.experience_required
    }


# =========================
# RESUME ↔ JOB MATCHING
# =========================

@router.get("/match/{job_id}/{resume_id}")
def match_resume_with_job(
    job_id: int,
    resume_id: int,
    db: Session = Depends(get_db)
):
    # Find Job
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Find Resume
    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # Resume skills
    try:
        resume_skills = json.loads(
            resume.skills
        ) if resume.skills else []

    except json.JSONDecodeError:
        resume_skills = [
            skill.strip()
            for skill in resume.skills.split(",")
            if skill.strip()
        ]

    # Job required skills
    try:
        required_skills = json.loads(
            job.required_skills
        ) if job.required_skills else []

    except json.JSONDecodeError:
        required_skills = [
            skill.strip()
            for skill in job.required_skills.split(",")
            if skill.strip()
        ]

    # Calculate matching
    result = calculate_job_match(
        resume_skills,
        required_skills
    )

    return {
        "job_id": job.id,
        "resume_id": resume.id,
        "job_title": job.title,
        "candidate_name": resume.name,
        **result
    }