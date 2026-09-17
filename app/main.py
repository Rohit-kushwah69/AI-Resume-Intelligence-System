from fastapi import FastAPI

from .database.database import Base, engine
from .database import models
from .routes.resume_routes import router as resume_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Resume Intelligence System"
)


app.include_router(resume_router)


@app.get("/")
def home():
    return {
        "message": "AI Resume Intelligence System API is running"
    }