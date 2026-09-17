import os
import json

from dotenv import load_dotenv
from google import genai


# Load environment variables
load_dotenv()


# Get API key
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in .env"
    )


# Gemini client
client = genai.Client(
    api_key=API_KEY
)


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

    # Current Gemini Interactions API
    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        generation_config={
            "thinking_level": "low"
        }
    )

    response_text = interaction.output_text.strip()

    # Remove accidental Markdown code fences
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

        return json.loads(response_text)

    except json.JSONDecodeError:

        return {
            "error": "AI returned invalid JSON",
            "raw_response": response_text
        }


def analyze_resume_intelligence(resume_text: str):
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

    return json.loads(interaction.output_text)