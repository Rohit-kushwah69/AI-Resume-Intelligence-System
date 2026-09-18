from .job_matcher import calculate_job_match
from .semantic_matcher import calculate_semantic_match


def calculate_final_match(
    resume_skills: list[str],
    required_skills: list[str],
    resume_experience: str = "",
    required_experience: str = ""
):
    # --------------------------------
    # 1. Exact Skill Matching
    # --------------------------------

    exact_result = calculate_job_match(
        resume_skills,
        required_skills
    )

    exact_score = float(
        exact_result["match_score"]
    )

    # --------------------------------
    # 2. Semantic Matching
    # --------------------------------

    semantic_result = calculate_semantic_match(
        resume_skills,
        required_skills
    )

    semantic_score = float(
        semantic_result["semantic_score"]
    )

    # --------------------------------
    # 3. Experience Matching
    # --------------------------------

    experience_score = float(
        calculate_experience_match(
            resume_experience,
            required_experience
        )
    )

    # --------------------------------
    # 4. Final Score
    # --------------------------------

    final_score = (
        exact_score * 0.50
        + semantic_score * 0.30
        + experience_score * 0.20
    )

    return {
        "final_match_score": float(
            round(final_score, 2)
        ),

        "exact_skill_score": float(
            round(exact_score, 2)
        ),

        "semantic_skill_score": float(
            round(semantic_score, 2)
        ),

        "experience_score": float(
            round(experience_score, 2)
        ),

        "matched_skills": exact_result[
            "matched_skills"
        ],

        "missing_skills": exact_result[
            "missing_skills"
        ]
    }


def calculate_experience_match(
    resume_experience: str,
    required_experience: str
):
    """
    Basic experience matching.
    """

    if not required_experience:
        return 100.0

    if not resume_experience:
        return 0.0

    resume_text = resume_experience.lower()
    required_text = required_experience.lower()

    import re

    resume_years = re.findall(
        r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?)",
        resume_text
    )

    required_years = re.findall(
        r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?)",
        required_text
    )

    if not resume_years or not required_years:
        return 50.0

    resume_years = max(
        float(year)
        for year in resume_years
    )

    required_years = min(
        float(year)
        for year in required_years
    )

    if resume_years >= required_years:
        return 100.0

    if resume_years >= required_years * 0.5:
        return 50.0

    return 0.0