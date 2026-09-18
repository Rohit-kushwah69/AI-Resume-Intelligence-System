from app.services.ai_analyzer import (
    analyze_resume_with_ai,
    analyze_resume_intelligence
)


# --------------------------------------------------
# Sample Resume Text
# --------------------------------------------------

resume_text = """
Rohit Singh

Email: rk6109744@gmail.com
Phone: +91 7447022913

Education:
Bachelor of Technology in Information Technology

Skills:
Python, SQL, Machine Learning, Deep Learning,
FastAPI, LangChain, RAG, FAISS

Experience:
PN Infosys, Gwalior
MERN Full Stack Developer Intern
March 2024 - September 2025

Developed and deployed full-stack web applications
using MongoDB, Express.js, React.js and Node.js.

Projects:

Customer Churn Prediction using Machine Learning

Built an end-to-end ML model to predict customer churn.

PAN Card AI Detection OCR

Developed PAN Card detection and OCR system
using YOLO, EasyOCR, Python and Streamlit.

GenAI Assistant - RAG Based PDF Chatbot

Developed a PDF-based GenAI Assistant using
RAG, LangChain, Gemini and ChromaDB.
"""


# --------------------------------------------------
# Test 1: Resume Parsing
# --------------------------------------------------

print("\n========== RESUME PARSING ==========\n")

parsed_data = analyze_resume_with_ai(resume_text)

print(parsed_data)


# --------------------------------------------------
# Test 2: Resume Intelligence Analysis
# --------------------------------------------------

print("\n========== RESUME INTELLIGENCE ==========\n")

analysis = analyze_resume_intelligence(resume_text)

print(analysis)