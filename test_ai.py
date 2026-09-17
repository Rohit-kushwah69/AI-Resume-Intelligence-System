from app.services.ai_analyzer import analyze_resume_with_ai


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


result = analyze_resume_with_ai(resume_text)

print(result)