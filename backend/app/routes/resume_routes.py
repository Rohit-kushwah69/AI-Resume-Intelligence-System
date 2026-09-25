import os
import shutil
import json

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Resume, JobMatch

from ..services.pdf_parser import extract_text_from_pdf
from ..services.resume_parser import parse_resume

from ..services.ai_analyzer import (
    analyze_resume_with_ai,
    analyze_resume_intelligence
)

from ..utils.security import get_current_admin


router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"]
)


UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==================================================
# UPLOAD RESUME
# ==================================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):

    # ==================================================
    # 1. CHECK PDF
    # ==================================================

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # ==================================================
    # 2. SAVE PDF
    # ==================================================

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # ==================================================
    # 3. EXTRACT TEXT
    # ==================================================

    resume_text = extract_text_from_pdf(
        file_path
    )

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF"
        )

    # ==================================================
    # 4. BASIC PARSER
    # ==================================================

    basic_data = parse_resume(
        resume_text
    )

    # ==================================================
    # 5. GEMINI RESUME PARSER
    # ==================================================

    try:

        ai_data = analyze_resume_with_ai(
            resume_text
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # ==================================================
    # 6. GEMINI RESUME INTELLIGENCE
    # ==================================================

    try:

        ai_analysis = analyze_resume_intelligence(
            resume_text
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "AI intelligence analysis failed: "
                f"{str(e)}"
            )
        )

    # ==================================================
    # 7. SAVE EVERYTHING INTO SQLITE
    # ==================================================

    resume = Resume(

        # ==================================================
        # ADMIN OWNERSHIP
        # ==================================================

        admin_id=int(current_admin["sub"]),

        # ==================================================
        # PERSONAL INFORMATION
        # ==================================================

        name=(
            ai_data.get("name")
            or basic_data.get("name")
        ),

        email=(
            ai_data.get("email")
            or basic_data.get("email")
        ),

        phone=(
            ai_data.get("phone")
            or basic_data.get("phone")
        ),

        # ==================================================
        # RESUME INFORMATION
        # ==================================================

        education=json.dumps(
            ai_data.get("education")
            or basic_data.get("education")
            or []
        ),

        skills=json.dumps(
            ai_data.get("skills")
            or basic_data.get("skills")
            or []
        ),

        experience=json.dumps(
            ai_data.get("experience")
            or basic_data.get("experience")
            or []
        ),

        projects=json.dumps(
            ai_data.get("projects")
            or basic_data.get("projects")
            or []
        ),

        certifications=json.dumps(
            ai_data.get("certifications")
            or []
        ),

        # ==================================================
        # AI RESUME INTELLIGENCE
        # ==================================================

        resume_score=ai_analysis.get(
            "resume_score"
        ),

        ai_summary=ai_analysis.get(
            "summary"
        ),

        ai_strengths=json.dumps(
            ai_analysis.get(
                "strengths",
                []
            )
        ),

        ai_weaknesses=json.dumps(
            ai_analysis.get(
                "weaknesses",
                []
            )
        ),

        ai_missing_skills=json.dumps(
            ai_analysis.get(
                "missing_skills",
                []
            )
        ),

        ai_suggestions=json.dumps(
            ai_analysis.get(
                "suggestions",
                []
            )
        ),

        # ==================================================
        # ORIGINAL RESUME
        # ==================================================

        resume_text=resume_text,

        file_name=file.filename,

        file_path=file_path
    )

    # ==================================================
    # 8. SAVE TO DATABASE
    # ==================================================

    db.add(resume)

    db.commit()

    db.refresh(resume)

    # ==================================================
    # 9. RESPONSE
    # ==================================================

    return {

        "message": (
            "Resume uploaded and analyzed successfully"
        ),

        "resume_id": resume.id,

        "admin_id": resume.admin_id,

        "parsed_data": ai_data,

        "ai_analysis": ai_analysis
    }


# ==================================================
# GET ALL RESUMES
# ==================================================

@router.get("/")
def get_resumes(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):

    admin_id = int(current_admin["sub"])

    resumes = db.query(Resume).filter(
        Resume.admin_id == admin_id
    ).all()

    result = []

    for resume in resumes:

        result.append({

            "id": resume.id,

            "admin_id": resume.admin_id,

            "name": resume.name,

            "email": resume.email,

            "phone": resume.phone,

            # ==================================================
            # RESUME DATA
            # ==================================================

            "education": (
                json.loads(resume.education)
                if resume.education
                else []
            ),

            "skills": (
                json.loads(resume.skills)
                if resume.skills
                else []
            ),

            "experience": (
                json.loads(resume.experience)
                if resume.experience
                else []
            ),

            "projects": (
                json.loads(resume.projects)
                if resume.projects
                else []
            ),

            "certifications": (
                json.loads(resume.certifications)
                if resume.certifications
                else []
            ),

            # ==================================================
            # AI INTELLIGENCE
            # ==================================================

            "ai_analysis": {

                "resume_score": resume.resume_score,

                "summary": resume.ai_summary,

                "strengths": (
                    json.loads(resume.ai_strengths)
                    if resume.ai_strengths
                    else []
                ),

                "weaknesses": (
                    json.loads(resume.ai_weaknesses)
                    if resume.ai_weaknesses
                    else []
                ),

                "missing_skills": (
                    json.loads(
                        resume.ai_missing_skills
                    )
                    if resume.ai_missing_skills
                    else []
                ),

                "suggestions": (
                    json.loads(
                        resume.ai_suggestions
                    )
                    if resume.ai_suggestions
                    else []
                )
            },

            # ==================================================
            # FILE
            # ==================================================

            "file_name": resume.file_name,

            "file_path": resume.file_path,

            "created_at": resume.created_at
        })

    return result


# ==================================================
# GET SINGLE RESUME
# ==================================================

@router.get("/{resume_id}")
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):

    admin_id = int(current_admin["sub"])

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.admin_id == admin_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return {

        "id": resume.id,

        "admin_id": resume.admin_id,

        "name": resume.name,

        "email": resume.email,

        "phone": resume.phone,

        # ==================================================
        # RESUME DATA
        # ==================================================

        "education": (
            json.loads(resume.education)
            if resume.education
            else []
        ),

        "skills": (
            json.loads(resume.skills)
            if resume.skills
            else []
        ),

        "experience": (
            json.loads(resume.experience)
            if resume.experience
            else []
        ),

        "projects": (
            json.loads(resume.projects)
            if resume.projects
            else []
        ),

        "certifications": (
            json.loads(resume.certifications)
            if resume.certifications
            else []
        ),

        # ==================================================
        # AI INTELLIGENCE
        # ==================================================

        "ai_analysis": {

            "resume_score": resume.resume_score,

            "summary": resume.ai_summary,

            "strengths": (
                json.loads(resume.ai_strengths)
                if resume.ai_strengths
                else []
            ),

            "weaknesses": (
                json.loads(resume.ai_weaknesses)
                if resume.ai_weaknesses
                else []
            ),

            "missing_skills": (
                json.loads(
                    resume.ai_missing_skills
                )
                if resume.ai_missing_skills
                else []
            ),

            "suggestions": (
                json.loads(
                    resume.ai_suggestions
                )
                if resume.ai_suggestions
                else []
            )
        },

        # ==================================================
        # ORIGINAL RESUME
        # ==================================================

        "resume_text": resume.resume_text,

        "file_name": resume.file_name,

        "file_path": resume.file_path,

        "created_at": resume.created_at
    }


# ==================================================
# DELETE RESUME
# ==================================================

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):

    admin_id = int(current_admin["sub"])

    # ==================================================
    # FIND RESUME
    # ==================================================

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.admin_id == admin_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # ==================================================
    # DELETE RELATED JOB MATCHES
    # ==================================================

    db.query(JobMatch).filter(
        JobMatch.resume_id == resume_id
    ).delete(
        synchronize_session=False
    )

    # ==================================================
    # DELETE RESUME
    # ==================================================

    db.delete(resume)

    db.commit()

    return {

        "message": "Resume deleted successfully",

        "resume_id": resume_id
    }