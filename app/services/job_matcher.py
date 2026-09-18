import re


def normalize_skill(skill: str) -> str:
    """
    Convert skill into a comparable format.
    Example:
    'Machine Learning' -> 'machine learning'
    'Python ' -> 'python'
    """

    skill = skill.strip().lower()

    # Remove extra spaces
    skill = re.sub(r"\s+", " ", skill)

    return skill


def calculate_job_match(
    resume_skills: list[str],
    required_skills: list[str]
):
    """
    Compare resume skills with job required skills.
    """

    resume_normalized = {
        normalize_skill(skill): skill
        for skill in resume_skills
    }

    job_normalized = {
        normalize_skill(skill): skill
        for skill in required_skills
    }

    matched_skills = []
    missing_skills = []

    for normalized_skill, original_skill in job_normalized.items():

        if normalized_skill in resume_normalized:
            matched_skills.append(original_skill)
        else:
            missing_skills.append(original_skill)

    total_required = len(required_skills)

    if total_required == 0:
        match_score = 0

    else:
        match_score = (
            len(matched_skills) / total_required
        ) * 100

    return {
        "match_score": round(match_score, 2),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "total_required_skills": total_required,
        "matched_count": len(matched_skills),
        "missing_count": len(missing_skills)
    }