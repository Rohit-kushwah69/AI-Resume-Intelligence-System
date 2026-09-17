import os
import shutil

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Resume
from ..services.pdf_parser import extract_text_from_pdf
from ..services.resume_parser import parse_resume
from ..services.ai_analyzer import analyze_resume_with_ai


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

    # 3. Extract text from PDF
    resume_text = extract_text_from_pdf(file_path)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF"
        )

    # 4. Basic parser
    basic_data = parse_resume(resume_text)

    # 5. Gemini AI parser
    try:
        ai_data = analyze_resume_with_ai(resume_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # 6. Save AI data into SQLite
    resume = Resume(
        name=ai_data.get("name") or basic_data.get("name"),
        email=ai_data.get("email") or basic_data.get("email"),
        phone=ai_data.get("phone") or basic_data.get("phone"),

        education=str(
            ai_data.get("education")
            or basic_data.get("education")
            or ""
        ),

        skills=str(
            ai_data.get("skills")
            or basic_data.get("skills")
            or ""
        ),

        experience=str(
            ai_data.get("experience")
            or basic_data.get("experience")
            or ""
        ),

        projects=str(
            ai_data.get("projects")
            or basic_data.get("projects")
            or ""
        ),

        resume_text=resume_text,
        file_name=file.filename,
        file_path=file_path
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    # 7. Return response
    return {
        "message": "Resume uploaded and analyzed successfully",

        "resume_id": resume.id,

        "parsed_data": ai_data
    }


# --------------------------------------------------
# Get All Resumes
# --------------------------------------------------

@router.get("/")
def get_resumes(db: Session = Depends(get_db)):

    resumes = db.query(Resume).all()

    return resumes


# --------------------------------------------------
# Create Resume Manually
# --------------------------------------------------

@router.post("/")
def create_resume(
    resume_data: dict,
    db: Session = Depends(get_db)
):

    resume = Resume(**resume_data)

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume