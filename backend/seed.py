from app.database.database import SessionLocal
from app.database.models import Resume


def seed_resumes():
    db = SessionLocal()

    sample_resumes = [
        Resume(
            name="Aman Sharma",
            email="aman@example.com",
            phone="9876543210",
            education="B.Tech Computer Science",
            skills="Python, SQL, Machine Learning, Pandas, NumPy",
            experience="Data Science Intern",
            projects="Customer Churn Prediction, Sales Prediction",
            resume_text="Computer Science graduate with experience in Python, SQL and Machine Learning."
        ),

        Resume(
            name="Priya Verma",
            email="priya@example.com",
            phone="9876543211",
            education="B.Tech Information Technology",
            skills="Python, SQL, Power BI, Excel, Statistics",
            experience="Data Analyst Intern",
            projects="Sales Dashboard, Customer Analysis",
            resume_text="IT graduate skilled in data analysis, SQL, Power BI and statistics."
        ),

        Resume(
            name="Rahul Kumar",
            email="rahul@example.com",
            phone="9876543212",
            education="B.Tech Computer Science",
            skills="Java, Python, React, Node.js, MongoDB",
            experience="MERN Stack Developer",
            projects="E-commerce Website, Event Booking System",
            resume_text="Full Stack Developer experienced in React, Node.js, MongoDB and Python."
        ),

        Resume(
            name="Neha Singh",
            email="neha@example.com",
            phone="9876543213",
            education="B.Tech Information Technology",
            skills="Python, Deep Learning, TensorFlow, NLP, OpenCV",
            experience="Machine Learning Intern",
            projects="Image Classification, NLP Sentiment Analysis",
            resume_text="Machine Learning enthusiast with experience in Deep Learning, NLP and Computer Vision."
        ),

        Resume(
            name="Vikas Patel",
            email="vikas@example.com",
            phone="9876543214",
            education="B.Tech Artificial Intelligence",
            skills="Python, Machine Learning, RAG, LangChain, FastAPI, FAISS",
            experience="AI Intern",
            projects="AI Chatbot with RAG, Resume Analyzer",
            resume_text="AI graduate experienced in Generative AI, RAG, LangChain and FastAPI."
        )
    ]

    db.add_all(sample_resumes)
    db.commit()

    print("Sample resumes inserted successfully!")

    db.close()


if __name__ == "__main__":
    seed_resumes()