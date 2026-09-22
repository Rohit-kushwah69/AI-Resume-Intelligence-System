import json

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Job, Resume, JobMatch
from ..schemas.job_schema import JobCreate
from ..services.final_matcher import calculate_final_match
from ..services.ai_analyzer import analyze_job_match_with_ai


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)


# ==========================================
# CREATE JOB
# ==========================================

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

        experience_required=(
            job_data.experience_required
        )
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

            "required_skills": (
                job_data.required_skills
            ),

            "experience_required": (
                job_data.experience_required
            )
        }
    }


# ==========================================
# GET ALL JOBS
# ==========================================

@router.get("/")
def get_jobs(
    db: Session = Depends(get_db)
):

    jobs = db.query(Job).all()

    result = []

    for job in jobs:

        try:
            required_skills = (
                json.loads(
                    job.required_skills
                )
                if job.required_skills
                else []
            )
        except json.JSONDecodeError:
            required_skills = [
                skill.strip()
                for skill in job.required_skills.split(",")
                if skill.strip()
            ]

        result.append({

            "id": job.id,

            "title": job.title,

            "company": job.company,

            "description": job.description,

            "required_skills": required_skills,

            "experience_required": (
                job.experience_required
            )
        })

    return result

# ==========================================
# GET TOTAL MATCH COUNT
# ==========================================

@router.get("/match/count")
def get_match_count(
    db: Session = Depends(get_db)
):
    total_matches = db.query(JobMatch).count()

    return {
        "total_matches": total_matches
    }


# ==========================================
# GET MATCH HISTORY
# IMPORTANT:
# Keep BEFORE /{job_id}
# ==========================================

@router.get(
    "/match/history/{resume_id}"
)
def get_match_history(
    resume_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------
    # Check Resume
    # --------------------------------------

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )


    # --------------------------------------
    # Get History
    # --------------------------------------

    matches = (
        db.query(JobMatch)
        .filter(
            JobMatch.resume_id == resume_id
        )
        .order_by(
            JobMatch.created_at.desc()
        )
        .all()
    )


    history = []


    for match in matches:

        # ----------------------------------
        # Find Job
        # ----------------------------------

        job = db.query(Job).filter(
            Job.id == match.job_id
        ).first()


        # ----------------------------------
        # Matched Skills
        # ----------------------------------

        try:

            matched_skills = (
                json.loads(
                    match.matched_skills
                )
                if match.matched_skills
                else []
            )

        except json.JSONDecodeError:

            matched_skills = []


        # ----------------------------------
        # Missing Skills
        # ----------------------------------

        try:

            missing_skills = (
                json.loads(
                    match.missing_skills
                )
                if match.missing_skills
                else []
            )

        except json.JSONDecodeError:

            missing_skills = []


        # ----------------------------------
        # AI Analysis
        # ----------------------------------

        try:

            ai_analysis = (
                json.loads(
                    match.ai_analysis
                )
                if match.ai_analysis
                else {}
            )

        except json.JSONDecodeError:

            ai_analysis = {}


        # ----------------------------------
        # Add History
        # ----------------------------------

        history.append({

            "match_id": match.id,

            "job_id": match.job_id,

            "job_title": (
                job.title
                if job
                else None
            ),

            "company": (
                job.company
                if job
                else None
            ),

            "resume_id": match.resume_id,

            "final_match_score": (
                match.final_match_score
            ),

            "exact_skill_score": (
                match.exact_skill_score
            ),

            "semantic_skill_score": (
                match.semantic_skill_score
            ),

            "experience_score": (
                match.experience_score
            ),

            "matched_skills": matched_skills,

            "missing_skills": missing_skills,

            "ai_analysis": ai_analysis,

            "created_at": match.created_at
        })


    # --------------------------------------
    # Final Response
    # --------------------------------------

    return {

        "resume_id": resume_id,

        "candidate_name": resume.name,

        "total_matches": len(history),

        "history": history
    }


# ==========================================
# RESUME ↔ JOB MATCHING
# ==========================================

@router.get(
    "/match/{job_id}/{resume_id}"
)
def match_resume_with_job(
    job_id: int,
    resume_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------
    # Find Job
    # --------------------------------------

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )


    # --------------------------------------
    # Find Resume
    # --------------------------------------

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )


    # --------------------------------------
    # Resume Skills
    # --------------------------------------

    try:

        resume_skills = (
            json.loads(
                resume.skills
            )
            if resume.skills
            else []
        )

    except json.JSONDecodeError:

        resume_skills = [
            skill.strip()
            for skill in resume.skills.split(",")
            if skill.strip()
        ]


    # --------------------------------------
    # Required Skills
    # --------------------------------------

    try:

        required_skills = (
            json.loads(
                job.required_skills
            )
            if job.required_skills
            else []
        )

    except json.JSONDecodeError:

        required_skills = [
            skill.strip()
            for skill in job.required_skills.split(",")
            if skill.strip()
        ]


    # --------------------------------------
    # Calculate Final Match
    # --------------------------------------

    result = calculate_final_match(

        resume_skills=resume_skills,

        required_skills=required_skills,

        resume_experience=(
            resume.experience or ""
        ),

        required_experience=(
            job.experience_required or ""
        )
    )


    # --------------------------------------
    # AI Match Analysis
    # --------------------------------------

    ai_analysis = analyze_job_match_with_ai(

        job_title=job.title,

        job_description=job.description,

        required_skills=required_skills,

        resume_skills=resume_skills,

        matched_skills=(
            result["matched_skills"]
        ),

        missing_skills=(
            result["missing_skills"]
        ),

        final_match_score=(
            result["final_match_score"]
        ),

        exact_skill_score=(
            result["exact_skill_score"]
        ),

        semantic_skill_score=(
            result["semantic_skill_score"]
        ),

        experience_score=(
            result["experience_score"]
        )
    )


    # --------------------------------------
    # Final Response
    # --------------------------------------

    return {

        "job_id": job.id,

        "resume_id": resume.id,

        "job_title": job.title,

        "candidate_name": resume.name,

        "final_match_score": (
            result["final_match_score"]
        ),

        "exact_skill_score": (
            result["exact_skill_score"]
        ),

        "semantic_skill_score": (
            result["semantic_skill_score"]
        ),

        "experience_score": (
            result["experience_score"]
        ),

        "matched_skills": (
            result["matched_skills"]
        ),

        "missing_skills": (
            result["missing_skills"]
        ),

        "ai_analysis": ai_analysis
    }


# ==========================================
# SAVE JOB MATCH HISTORY
# ==========================================

@router.post(
    "/match/save/{job_id}/{resume_id}"
)
def save_job_match(
    job_id: int,
    resume_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------
    # Check Duplicate Match
    # --------------------------------------

    existing_match = db.query(JobMatch).filter(
        JobMatch.job_id == job_id,
        JobMatch.resume_id == resume_id
    ).first()

    if existing_match:

        raise HTTPException(
            status_code=400,
            detail="This job match is already saved in history"
        )
    

    # --------------------------------------
    # Find Job
    # --------------------------------------

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )


    # --------------------------------------
    # Find Resume
    # --------------------------------------

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )


    # --------------------------------------
    # Resume Skills
    # --------------------------------------

    try:

        resume_skills = (
            json.loads(
                resume.skills
            )
            if resume.skills
            else []
        )

    except json.JSONDecodeError:

        resume_skills = [
            skill.strip()
            for skill in resume.skills.split(",")
            if skill.strip()
        ]


    # --------------------------------------
    # Required Skills
    # --------------------------------------

    try:

        required_skills = (
            json.loads(
                job.required_skills
            )
            if job.required_skills
            else []
        )

    except json.JSONDecodeError:

        required_skills = [
            skill.strip()
            for skill in job.required_skills.split(",")
            if skill.strip()
        ]


    # --------------------------------------
    # Calculate Match
    # --------------------------------------

    result = calculate_final_match(

        resume_skills=resume_skills,

        required_skills=required_skills,

        resume_experience=(
            resume.experience or ""
        ),

        required_experience=(
            job.experience_required or ""
        )
    )


    # --------------------------------------
    # AI Analysis
    # --------------------------------------

    ai_analysis = analyze_job_match_with_ai(

        job_title=job.title,

        job_description=job.description,

        required_skills=required_skills,

        resume_skills=resume_skills,

        matched_skills=(
            result["matched_skills"]
        ),

        missing_skills=(
            result["missing_skills"]
        ),

        final_match_score=(
            result["final_match_score"]
        ),

        exact_skill_score=(
            result["exact_skill_score"]
        ),

        semantic_skill_score=(
            result["semantic_skill_score"]
        ),

        experience_score=(
            result["experience_score"]
        )
    )


    # --------------------------------------
    # Create JobMatch
    # --------------------------------------

    job_match = JobMatch(

        resume_id=resume.id,

        job_id=job.id,

        final_match_score=(
            result["final_match_score"]
        ),

        exact_skill_score=(
            result["exact_skill_score"]
        ),

        semantic_skill_score=(
            result["semantic_skill_score"]
        ),

        experience_score=(
            result["experience_score"]
        ),

        matched_skills=json.dumps(
            result["matched_skills"]
        ),

        missing_skills=json.dumps(
            result["missing_skills"]
        ),

        ai_analysis=json.dumps(
            ai_analysis
        )
    )


    # --------------------------------------
    # Save Database
    # --------------------------------------

    db.add(job_match)

    db.commit()

    db.refresh(job_match)


    # --------------------------------------
    # Response
    # --------------------------------------

    return {

        "message": (
            "Job match saved successfully"
        ),

        "match_id": job_match.id,

        "job_id": job.id,

        "resume_id": resume.id,

        "final_match_score": (
            job_match.final_match_score
        ),

        "matched_skills": (
            result["matched_skills"]
        ),

        "missing_skills": (
            result["missing_skills"]
        ),

        "ai_analysis": ai_analysis
    }


# ==========================================
# GET SINGLE JOB
# IMPORTANT: KEEP THIS LAST
# ==========================================

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


    try:

        required_skills = (
            json.loads(
                job.required_skills
            )
            if job.required_skills
            else []
        )

    except json.JSONDecodeError:

        required_skills = [
            skill.strip()
            for skill in job.required_skills.split(",")
            if skill.strip()
        ]


    return {

        "id": job.id,

        "title": job.title,

        "company": job.company,

        "description": job.description,

        "required_skills": required_skills,

        "experience_required": (
            job.experience_required
        )
    }

# ==========================================
# DELETE JOB
# ==========================================

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
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

    # Delete related match history
    db.query(JobMatch).filter(
        JobMatch.job_id == job_id
    ).delete(
        synchronize_session=False
    )

    # Delete Job
    db.delete(job)

    db.commit()

    return {
        "message": "Job deleted successfully",
        "job_id": job_id
    }