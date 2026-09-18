from app.services.resume_parser import parse_resume


text = """
Rohit Singh

Email: rohit@gmail.com
Phone: 9876543210

EDUCATION

B.Tech Information Technology
Maharana Pratap College of Technology

SKILLS

Python
SQL
Machine Learning
Deep Learning
FastAPI
React
MongoDB

EXPERIENCE

Data Science Intern
Worked on machine learning projects.

PROJECTS

AI Chatbot with RAG
Built an AI chatbot using FastAPI and RAG.
"""


result = parse_resume(text)

print("\nResume Analysis\n")
print("Name:", result["name"])
print("Email:", result["email"])
print("Phone:", result["phone"])
print("Skills:", result["skills"])
print("Education:", result["education"])
print("Experience:", result["experience"])
print("Projects:", result["projects"])