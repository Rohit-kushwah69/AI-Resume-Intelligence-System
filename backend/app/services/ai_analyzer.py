import os
import json

from dotenv import load_dotenv
from google import genai


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()


# ==========================================
# GEMINI API KEY
# ==========================================

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in .env"
    )


# ==========================================
# GEMINI CLIENT
# ==========================================

client = genai.Client(
    api_key=API_KEY
)


# ==========================================
# RESUME PARSER AI
# ==========================================

def analyze_resume_with_ai(resume_text: str):

    prompt = f"""
You are an AI Resume Parser.

Analyze the resume below and return ONLY valid JSON.

Do not use Markdown.
Do not add explanations.
Do not add ```json.

Extract the following information:

1. name
2. email
3. phone
4. education
5. skills
6. experience
7. projects
8. certifications

For education extract:
- degree
- field
- institution
- year

For experience extract:
- company
- role
- location
- duration
- responsibilities

For projects extract:
- name
- technologies
- description

If a field is not available, return null or an empty array.

Resume:

{resume_text}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        generation_config={
            "thinking_level": "low"
        }
    )

    response_text = interaction.output_text.strip()

    response_text = response_text.replace(
        "```json",
        ""
    )

    response_text = response_text.replace(
        "```",
        ""
    )

    response_text = response_text.strip()

    try:

        return json.loads(
            response_text
        )

    except json.JSONDecodeError:

        return {
            "error": "AI returned invalid JSON",
            "raw_response": response_text
        }


# ==========================================
# RESUME INTELLIGENCE ANALYSIS
# ==========================================

def analyze_resume_intelligence(
    resume_text: str
):

    prompt = f"""
You are an expert AI Resume Analyzer.

Analyze the following resume and return ONLY valid JSON.

Evaluate the resume based on:

1. Overall resume quality
2. Technical skills
3. Experience
4. Projects
5. Education
6. Resume structure
7. Job readiness

Return this exact JSON structure:

{{
    "resume_score": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "missing_skills": [],
    "suggestions": []
}}

Rules:

- resume_score must be between 0 and 100.
- strengths must contain specific strengths found in the resume.
- weaknesses must contain actual areas that can be improved.
- missing_skills should contain useful skills that appear to be missing based on the candidate's existing profile.
- suggestions should be practical and actionable.
- Do not invent experience or skills.
- Keep the analysis concise.
- Return ONLY JSON.
- Do not use Markdown.
- Do not use ```json.

Resume:

{resume_text}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": {
                "type": "object",

                "properties": {

                    "resume_score": {
                        "type": "integer"
                    },

                    "summary": {
                        "type": "string"
                    },

                    "strengths": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },

                    "weaknesses": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },

                    "missing_skills": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },

                    "suggestions": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                },

                "required": [
                    "resume_score",
                    "summary",
                    "strengths",
                    "weaknesses",
                    "missing_skills",
                    "suggestions"
                ]
            }
        }
    )

    return json.loads(
        interaction.output_text
    )


# ==========================================
# AI JOB MATCH EXPLANATION
# ==========================================

def analyze_job_match_with_ai(
    job_title: str,
    job_description: str,
    required_skills: list[str],
    resume_skills: list[str],
    matched_skills: list[str],
    missing_skills: list[str],
    final_match_score: float,
    exact_skill_score: float,
    semantic_skill_score: float,
    experience_score: float
):

    prompt = f"""
You are an expert AI Job Matching Analyst.

Analyze the candidate's resume match against the job.

Return ONLY valid JSON.

Do not use Markdown.
Do not add ```json.
Do not invent skills, experience, or qualifications.

JOB TITLE:
{job_title}

JOB DESCRIPTION:
{job_description}

REQUIRED SKILLS:
{required_skills}

CANDIDATE SKILLS:
{resume_skills}

MATCHED SKILLS:
{matched_skills}

MISSING SKILLS:
{missing_skills}

FINAL MATCH SCORE:
{final_match_score}

EXACT SKILL SCORE:
{exact_skill_score}

SEMANTIC SKILL SCORE:
{semantic_skill_score}

EXPERIENCE SCORE:
{experience_score}

Return this exact JSON structure:

{{
    "match_summary": "",
    "strengths": [],
    "skill_gaps": [],
    "experience_analysis": "",
    "improvement_suggestions": []
}}

Rules:

- match_summary should briefly explain the overall match.
- strengths should mention only demonstrated matching strengths.
- skill_gaps should focus on missing required skills.
- experience_analysis should explain the experience score.
- improvement_suggestions should be practical.
- Do not change or recalculate the provided scores.
- Do not invent candidate experience.
- Keep the response concise.
- Return ONLY JSON.
"""

    # ==========================================
    # TRY GEMINI AI
    # ==========================================

    try:

        interaction = client.interactions.create(
            model="gemini-3.6-flash",
            input=prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": {
                    "type": "object",

                    "properties": {

                        "match_summary": {
                            "type": "string"
                        },

                        "strengths": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },

                        "skill_gaps": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },

                        "experience_analysis": {
                            "type": "string"
                        },

                        "improvement_suggestions": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    },

                    "required": [
                        "match_summary",
                        "strengths",
                        "skill_gaps",
                        "experience_analysis",
                        "improvement_suggestions"
                    ]
                }
            }
        )

        return json.loads(
            interaction.output_text
        )

    # ==========================================
    # FALLBACK
    # ==========================================

    except Exception as e:

        print(
            f"Gemini AI analysis unavailable: {e}"
        )

        # -------------------------------
        # Match Level
        # -------------------------------

        if final_match_score >= 80:

            match_level = "Strong"

        elif final_match_score >= 60:

            match_level = "Moderate"

        else:

            match_level = "Low"


        # -------------------------------
        # Experience Analysis
        # -------------------------------

        if experience_score >= 100:

            experience_analysis = (
                "The candidate meets the required "
                "experience level."
            )

        elif experience_score >= 50:

            experience_analysis = (
                "The candidate partially matches "
                "the required experience level."
            )

        else:

            experience_analysis = (
                "The available resume information "
                "does not sufficiently match the "
                "required experience."
            )


        # -------------------------------
        # Suggestions
        # -------------------------------

        suggestions = []


        if missing_skills:

            suggestions.append(
                "Develop or strengthen: "
                + ", ".join(missing_skills)
            )


        if experience_score < 100:

            suggestions.append(
                "Highlight relevant experience "
                "more clearly in the resume."
            )


        if not suggestions:

            suggestions.append(
                "Continue strengthening relevant "
                "skills and project experience."
            )


        # -------------------------------
        # Fallback Response
        # -------------------------------

        return {

            "match_summary": (
                f"{match_level} match based on "
                f"the calculated skill and "
                f"experience scores."
            ),

            "strengths": [

                "Matched skills: "
                + ", ".join(matched_skills),

                f"Exact skill match score: "
                f"{exact_skill_score}%",

                f"Semantic skill match score: "
                f"{semantic_skill_score}%"

            ],

            "skill_gaps": missing_skills,

            "experience_analysis": (
                experience_analysis
            ),

            "improvement_suggestions": (
                suggestions
            )
        }