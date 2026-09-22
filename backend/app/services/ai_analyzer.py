import os
import json
from typing import Any

from dotenv import load_dotenv
from groq import Groq


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# GROQ CONFIGURATION
# =========================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY not found in .env"
    )


# Current Groq production model
MODEL = "openai/gpt-oss-120b"


# =========================================================
# GROQ CLIENT
# =========================================================

client = Groq(
    api_key=GROQ_API_KEY
)


# =========================================================
# HELPER FUNCTION
# =========================================================

def _call_groq(
    system_prompt: str,
    user_prompt: str,
    json_schema: dict[str, Any],
) -> dict[str, Any]:

    try:

        response = client.chat.completions.create(

            model=MODEL,

            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],

            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "resume_analysis",
                    "strict": True,
                    "schema": json_schema,
                },
            },

            temperature=0.1,

            max_completion_tokens=4000,
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError(
                "Groq returned empty response"
            )

        return json.loads(content)

    except Exception as e:

        print("=" * 70)
        print("GROQ API ERROR")
        print("=" * 70)
        print(str(e))
        print("=" * 70)

        raise


# =========================================================
# RESUME PARSER
# =========================================================

def analyze_resume_with_ai(
    resume_text: str
):

    system_prompt = """
You are an AI Resume Parser.

Your task is to extract structured information
from the provided resume.

Important rules:

1. Return ONLY valid JSON.
2. Do not return Markdown.
3. Do not return explanations.
4. Do not invent information.
5. If information is missing, use null or an empty array.
6. Preserve information exactly when possible.
7. Extract only information actually present in the resume.
"""

    user_prompt = f"""
Analyze the following resume.

Extract:

1. name
2. email
3. phone
4. education
5. skills
6. experience
7. projects
8. certifications

Education fields:

- degree
- field
- institution
- year

Experience fields:

- company
- role
- location
- duration
- responsibilities

Project fields:

- name
- technologies
- description

Resume:

{resume_text}
"""

    schema = {

        "type": "object",

        "additionalProperties": False,

        "properties": {

            "name": {
                "type": ["string", "null"]
            },

            "email": {
                "type": ["string", "null"]
            },

            "phone": {
                "type": ["string", "null"]
            },

            "education": {

                "type": "array",

                "items": {

                    "type": "object",

                    "additionalProperties": False,

                    "properties": {

                        "degree": {
                            "type": ["string", "null"]
                        },

                        "field": {
                            "type": ["string", "null"]
                        },

                        "institution": {
                            "type": ["string", "null"]
                        },

                        "year": {
                            "type": ["string", "null"]
                        },
                    },

                    "required": [
                        "degree",
                        "field",
                        "institution",
                        "year",
                    ],
                },
            },

            "skills": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },

            "experience": {

                "type": "array",

                "items": {

                    "type": "object",

                    "additionalProperties": False,

                    "properties": {

                        "company": {
                            "type": ["string", "null"]
                        },

                        "role": {
                            "type": ["string", "null"]
                        },

                        "location": {
                            "type": ["string", "null"]
                        },

                        "duration": {
                            "type": ["string", "null"]
                        },

                        "responsibilities": {

                            "type": "array",

                            "items": {
                                "type": "string"
                            },
                        },
                    },

                    "required": [
                        "company",
                        "role",
                        "location",
                        "duration",
                        "responsibilities",
                    ],
                },
            },

            "projects": {

                "type": "array",

                "items": {

                    "type": "object",

                    "additionalProperties": False,

                    "properties": {

                        "name": {
                            "type": ["string", "null"]
                        },

                        "technologies": {

                            "type": "array",

                            "items": {
                                "type": "string"
                            },
                        },

                        "description": {
                            "type": ["string", "null"]
                        },
                    },

                    "required": [
                        "name",
                        "technologies",
                        "description",
                    ],
                },
            },

            "certifications": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },
        },

        "required": [
            "name",
            "email",
            "phone",
            "education",
            "skills",
            "experience",
            "projects",
            "certifications",
        ],
    }

    return _call_groq(
        system_prompt,
        user_prompt,
        schema,
    )


# =========================================================
# RESUME INTELLIGENCE ANALYSIS
# =========================================================

def analyze_resume_intelligence(
    resume_text: str
):

    system_prompt = """
You are an expert AI Resume Analyzer.

Analyze the resume objectively.

Evaluate:

1. Overall resume quality
2. Technical skills
3. Experience
4. Projects
5. Education
6. Resume structure
7. Job readiness

Important rules:

1. Return ONLY valid JSON.
2. Do not use Markdown.
3. Do not invent experience.
4. Do not invent skills.
5. Resume score must be between 0 and 100.
6. Strengths must be based on the actual resume.
7. Weaknesses must be realistic and evidence-based.
8. Missing skills should be useful skills that appear relevant
   based on the candidate's existing profile.
9. Suggestions must be practical.
10. Keep the analysis concise.
"""

    user_prompt = f"""
Analyze the following resume.

Return:

- resume_score
- summary
- strengths
- weaknesses
- missing_skills
- suggestions

Resume:

{resume_text}
"""

    schema = {

        "type": "object",

        "additionalProperties": False,

        "properties": {

            "resume_score": {

                "type": "integer",

                "minimum": 0,

                "maximum": 100,
            },

            "summary": {

                "type": "string"
            },

            "strengths": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },

            "weaknesses": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },

            "missing_skills": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },

            "suggestions": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },
        },

        "required": [
            "resume_score",
            "summary",
            "strengths",
            "weaknesses",
            "missing_skills",
            "suggestions",
        ],
    }

    return _call_groq(
        system_prompt,
        user_prompt,
        schema,
    )


# =========================================================
# AI JOB MATCH EXPLANATION
# =========================================================

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

    experience_score: float,

):

    system_prompt = """
You are an expert AI Job Matching Analyst.

Analyze how well a candidate's resume matches
a particular job.

Important rules:

1. Return ONLY valid JSON.
2. Do not use Markdown.
3. Do not invent candidate skills.
4. Do not invent candidate experience.
5. Do not change the provided scores.
6. Do not recalculate the scores.
7. Strengths must use only demonstrated matching skills.
8. Skill gaps should focus on missing required skills.
9. Experience analysis should explain the provided experience score.
10. Suggestions must be practical.
11. Keep the response concise.
"""

    user_prompt = f"""
Analyze the candidate's resume match against the job.

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
"""

    schema = {

        "type": "object",

        "additionalProperties": False,

        "properties": {

            "match_summary": {

                "type": "string"
            },

            "strengths": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },

            "skill_gaps": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },

            "experience_analysis": {

                "type": "string"
            },

            "improvement_suggestions": {

                "type": "array",

                "items": {
                    "type": "string"
                },
            },
        },

        "required": [
            "match_summary",
            "strengths",
            "skill_gaps",
            "experience_analysis",
            "improvement_suggestions",
        ],
    }

    try:

        return _call_groq(
            system_prompt,
            user_prompt,
            schema,
        )

    except Exception as e:

        print(
            f"Groq AI analysis unavailable: {e}"
        )

        # =================================================
        # FALLBACK RESPONSE
        # =================================================

        if final_match_score >= 80:

            match_level = "Strong"

        elif final_match_score >= 60:

            match_level = "Moderate"

        else:

            match_level = "Low"


        # =================================================
        # EXPERIENCE ANALYSIS
        # =================================================

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
                "does not sufficiently match "
                "the required experience."
            )


        # =================================================
        # SUGGESTIONS
        # =================================================

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


        # =================================================
        # FALLBACK RESPONSE
        # =================================================

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
                f"{semantic_skill_score}%",
            ],

            "skill_gaps": missing_skills,

            "experience_analysis":
                experience_analysis,

            "improvement_suggestions":
                suggestions,
        }