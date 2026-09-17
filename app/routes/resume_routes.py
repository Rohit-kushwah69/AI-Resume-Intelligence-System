import os
import shutil
import json

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Resume
from ..services.pdf_parser import extract_text_from_pdf
from ..services.resume_parser import parse_resume
from ..services.ai_analyzer import (
    analyze_resume_with_ai,
    analyze_resume_intelligence
)


router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"]
)


UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# --------------------------------------------------
# Upload Resume
# --------------------------------------------------

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # 1. Check PDF
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # 2. Save PDF
    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 3. Extract text
    resume_text = extract_text_from_pdf(file_path)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF"
        )

    # 4. Basic parser
    basic_data = parse_resume(resume_text)

    # 5. Gemini Resume Parser
    try:

        ai_data = analyze_resume_with_ai(
            resume_text
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # 6. Gemini Resume Intelligence
    try:

        ai_analysis = analyze_resume_intelligence(
            resume_text
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI intelligence analysis failed: {str(e)}"
        )

    # 7. Save everything into SQLite
    resume = Resume(

        # -----------------------------
        # Personal Information
        # -----------------------------

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

        # -----------------------------
        # Resume Information
        # -----------------------------

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

        # -----------------------------
        # AI Resume Intelligence
        # -----------------------------

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

        # -----------------------------
        # Original Resume
        # -----------------------------

        resume_text=resume_text,

        file_name=file.filename,

        file_path=file_path
    )

    # 8. Save to database
    db.add(resume)

    db.commit()

    db.refresh(resume)

    # 9. Response
    return {

        "message": "Resume uploaded and analyzed successfully",

        "resume_id": resume.id,

        "parsed_data": ai_data,

        "ai_analysis": ai_analysis
    }


# --------------------------------------------------
# Get All Resumes
# --------------------------------------------------

@router.get("/")
def get_resumes(
    db: Session = Depends(get_db)
):

    resumes = db.query(Resume).all()

    result = []

    for resume in resumes:

        result.append({

            "id": resume.id,

            "name": resume.name,

            "email": resume.email,

            "phone": resume.phone,

            # Resume Data
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

            # AI Intelligence
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
                    json.loads(resume.ai_missing_skills)
                    if resume.ai_missing_skills
                    else []
                ),

                "suggestions": (
                    json.loads(resume.ai_suggestions)
                    if resume.ai_suggestions
                    else []
                )
            },

            # File
            "file_name": resume.file_name,

            "file_path": resume.file_path,

            "created_at": resume.created_at
        })

    return result


# --------------------------------------------------
# Get Single Resume
# --------------------------------------------------

@router.get("/{resume_id}")
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return {

        "id": resume.id,

        "name": resume.name,

        "email": resume.email,

        "phone": resume.phone,

        # Resume Data
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

        # AI Intelligence
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
                json.loads(resume.ai_missing_skills)
                if resume.ai_missing_skills
                else []
            ),

            "suggestions": (
                json.loads(resume.ai_suggestions)
                if resume.ai_suggestions
                else []
            )
        },

        # Original Resume
        "resume_text": resume.resume_text,

        "file_name": resume.file_name,

        "file_path": resume.file_path,

        "created_at": resume.created_at
    }