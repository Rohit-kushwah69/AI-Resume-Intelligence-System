import re


# =========================================================
# TEXT CLEANING
# =========================================================

def clean_text(text: str):
    """
    Clean common PDF extraction artifacts.
    """

    if not text:
        return ""

    # Common PDF artifacts
    text = text.replace("/cde", "")
    text = text.replace("•", "")
    text = text.replace("▪", "")
    text = text.replace("●", "")

    # Fix hyphenated words split across lines
    text = re.sub(r"(\w)-\s+(\w)", r"\1\2", text)

    # Common PDF character spacing issues
    text = re.sub(r"\bP\s+AN\b", "PAN", text, flags=re.IGNORECASE)
    text = re.sub(r"\bT\s+echnology\b", "Technology", text, flags=re.IGNORECASE)
    text = re.sub(r"\bI\s+nformation\b", "Information", text, flags=re.IGNORECASE)
    text = re.sub(r"\bC\s+omputer\b", "Computer", text, flags=re.IGNORECASE)
    text = re.sub(r"\bE\s+ngineering\b", "Engineering", text, flags=re.IGNORECASE)

    # Normalize dash
    text = text.replace("–", "-")
    text = text.replace("—", "-")

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    return text.strip()


def clean_line(line: str):
    """
    Clean one line while preserving line structure.
    """

    if not line:
        return ""

    line = line.replace("/cde", "")
    line = line.replace("•", "")
    line = line.replace("▪", "")
    line = line.replace("●", "")

    line = line.replace("–", "-")
    line = line.replace("—", "-")

    # Fix common PDF artifacts
    line = re.sub(r"\bP\s+AN\b", "PAN", line, flags=re.IGNORECASE)
    line = re.sub(r"\bT\s+echnology\b", "Technology", line, flags=re.IGNORECASE)
    line = re.sub(r"\bI\s+nformation\b", "Information", line, flags=re.IGNORECASE)
    line = re.sub(r"\bC\s+omputer\b", "Computer", line, flags=re.IGNORECASE)
    line = re.sub(r"\bE\s+ngineering\b", "Engineering", line, flags=re.IGNORECASE)

    # Fix hyphenated words
    line = re.sub(r"(\w)-\s+(\w)", r"\1\2", line)

    # Extra spaces
    line = re.sub(r"\s+", " ", line)

    return line.strip()


# =========================================================
# EMAIL EXTRACTION
# =========================================================

def extract_email(text: str):

    text = clean_text(text)

    pattern = (
        r"\b[A-Za-z0-9._%+-]+"
        r"@[A-Za-z0-9.-]+"
        r"\.[A-Za-z]{2,}\b"
    )

    match = re.search(pattern, text)

    if not match:
        return None

    email = match.group(0).strip()

    # Remove accidental text attached after email
    email = re.split(
        r"(Phone|phone|Mobile|mobile|Tel|tel)",
        email
    )[0]

    return email.strip()


# =========================================================
# PHONE EXTRACTION
# =========================================================

def extract_phone(text: str):

    text = clean_text(text)

    patterns = [
        r"\+91[\s-]?[6-9]\d{9}\b",
        r"\b[6-9]\d{9}\b"
    ]

    for pattern in patterns:

        match = re.search(pattern, text)

        if match:
            return match.group(0).strip()

    return None


# =========================================================
# NAME EXTRACTION
# =========================================================

def extract_name(text: str):

    lines = [
        clean_line(line)
        for line in text.splitlines()
        if clean_line(line)
    ]

    if not lines:
        return None

    # Search first few lines for likely name
    for line in lines[:5]:

        # Skip lines containing email
        if "@" in line:
            continue

        # Skip lines containing phone
        if re.search(r"[6-9]\d{9}", line):
            continue

        # Skip common headings
        if detect_section(line):
            continue

        # Name should mostly contain alphabets
        if re.fullmatch(r"[A-Za-z .'-]{2,60}", line):

            return line.strip()

    return lines[0]


# =========================================================
# SKILLS EXTRACTION
# =========================================================

def extract_skills(text: str):

    text = clean_text(text)

    skills_list = [

        "Python",
        "SQL",
        "SQL Server",

        "Java",
        "JavaScript",
        "TypeScript",

        "React",
        "React.js",
        "Node.js",
        "Express.js",

        "MongoDB",

        "Machine Learning",
        "Deep Learning",

        "TensorFlow",
        "PyTorch",

        "Pandas",
        "NumPy",
        "Scikit-learn",

        "Statistics",
        "Data Analysis",
        "Data Cleaning",
        "EDA",
        "Feature Engineering",
        "Model Evaluation",

        "Power BI",
        "Excel",

        "NLP",
        "OpenCV",

        "FastAPI",

        "LangChain",
        "LangGraph",

        "LLM",
        "LLMs",

        "RAG",

        "FAISS",
        "Pinecone",
        "ChromaDB",

        "Docker",

        "Git",
        "GitHub",

        "Streamlit",
        "Matplotlib",

        "EasyOCR",
        "YOLO",

        "OCR"
    ]

    found_skills = []

    text_lower = text.lower()

    for skill in skills_list:

        pattern = (
            r"(?<!\w)"
            + re.escape(skill.lower())
            + r"(?!\w)"
        )

        if re.search(pattern, text_lower):

            if skill not in found_skills:
                found_skills.append(skill)

    return found_skills


# =========================================================
# EDUCATION EXTRACTION
# =========================================================

def extract_education(text: str):

    text = clean_text(text)

    education_patterns = [

        r"\bB\.?\s*Tech\b(?:\s+in\s+[A-Za-z ]+)?",

        r"\bB\.?\s*E\b(?:\s+in\s+[A-Za-z ]+)?",

        r"\bM\.?\s*Tech\b(?:\s+in\s+[A-Za-z ]+)?",

        r"\bM\.?\s*E\b(?:\s+in\s+[A-Za-z ]+)?",

        r"\bBCA\b",

        r"\bMCA\b",

        r"\bMBA\b",

        r"\bB\.?\s*Sc\b(?:\s+in\s+[A-Za-z ]+)?",

        r"\bM\.?\s*Sc\b(?:\s+in\s+[A-Za-z ]+)?",

        r"\bBachelor\s+of\s+[A-Za-z ]+",

        r"\bMaster\s+of\s+[A-Za-z ]+",

        r"\bPh\.?\s*D\b"
    ]

    found_education = []

    for pattern in education_patterns:

        matches = re.findall(
            pattern,
            text,
            re.IGNORECASE
        )

        for match in matches:

            education = clean_line(match)

            if not education:
                continue

            # Remove duplicate spaces
            education = re.sub(
                r"\s+",
                " ",
                education
            )

            # Avoid duplicates
            if education.lower() not in [
                x.lower() for x in found_education
            ]:
                found_education.append(education)

    return found_education


# =========================================================
# SECTION ALIASES
# =========================================================

SECTION_ALIASES = {

    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "work history",
        "employment history",
        "internship",
        "internships"
    ],

    "projects": [
        "projects",
        "personal projects",
        "academic projects",
        "key projects",
        "major projects"
    ],

    "skills": [
        "skills",
        "technical skills",
        "technical skill",
        "core skills",
        "key skills",
        "skills & tools",
        "technical skills & tools"
    ],

    "education": [
        "education",
        "educational background",
        "academic background",
        "qualifications"
    ],

    "certifications": [
        "certifications",
        "certificates",
        "courses"
    ],

    "summary": [
        "summary",
        "professional summary",
        "profile",
        "profile summary",
        "objective",
        "career objective"
    ]
}


# =========================================================
# HEADING NORMALIZATION
# =========================================================

def normalize_heading(line: str):

    line = clean_line(line)

    line = line.replace(":", "")

    line = re.sub(
        r"\s+",
        " ",
        line
    )

    return line.lower().strip()


# =========================================================
# SECTION DETECTION
# =========================================================

def detect_section(line: str):

    normalized = normalize_heading(line)

    for section, aliases in SECTION_ALIASES.items():

        for alias in aliases:

            if normalized == alias.lower():

                return section

    return None


# =========================================================
# SECTION EXTRACTION
# =========================================================

def extract_section(text: str, target_section: str):

    lines = text.splitlines()

    section_text = []

    capturing = False

    for line in lines:

        clean = clean_line(line)

        if not clean:
            continue

        detected_section = detect_section(clean)

        # Start target section
        if detected_section == target_section:

            capturing = True
            continue

        # Stop at next known section
        if capturing and detected_section is not None:

            break

        if capturing:

            section_text.append(clean)

    return section_text


# =========================================================
# EXPERIENCE EXTRACTION
# =========================================================

def extract_experience(text: str):

    experience = extract_section(
        text,
        "experience"
    )

    return experience


# =========================================================
# PROJECT EXTRACTION
# =========================================================

def extract_projects(text: str):

    projects = extract_section(
        text,
        "projects"
    )

    return projects


# =========================================================
# COMPLETE RESUME PARSER
# =========================================================

def parse_resume(text: str):

    return {

        "name": extract_name(text),

        "email": extract_email(text),

        "phone": extract_phone(text),

        "skills": extract_skills(text),

        "education": extract_education(text),

        "experience": extract_experience(text),

        "projects": extract_projects(text)
    }

