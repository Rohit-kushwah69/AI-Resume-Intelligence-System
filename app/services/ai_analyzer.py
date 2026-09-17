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