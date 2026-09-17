from fastapi import FastAPI

from .database.database import Base, engine
from .database import models

from .routes.resume_routes import router as resume_router
from .routes.job_router import router as job_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="AI Resume Intelligence System"
)


# Include routers
app.include_router(resume_router)
app.include_router(job_router)


@app.get("/")
def home():
    return {
        "message": "AI Resume Intelligence System API is running"
    }