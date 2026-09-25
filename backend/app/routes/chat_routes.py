from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Resume, Chat, Message
from ..schemas.chat_schema import ChatRequest, ChatResponse
from ..services.rag_service import (
    create_vector_store,
    ask_resume_question
)
from ..utils.security import get_current_admin


router = APIRouter(
    prefix="/api/chat",
    tags=["Resume Chat"]
)


# ============================================================
# CHAT WITH RESUME
# ============================================================

@router.post(
    "/resume/{resume_id}",
    response_model=ChatResponse
)
def chat_with_resume(
    resume_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):

    # --------------------------------------------------------
    # 1. Get Current Admin
    # --------------------------------------------------------

    try:
        admin_id = int(current_admin["sub"])
    except (KeyError, TypeError, ValueError):

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    # --------------------------------------------------------
    # 2. Check Resume Exists
    # --------------------------------------------------------

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume does not exist"
        )

    # --------------------------------------------------------
    # 3. Check Resume Ownership
    # --------------------------------------------------------

    if resume.admin_id != admin_id:

        raise HTTPException(
            status_code=403,
            detail="You do not have access to this resume"
        )

    # --------------------------------------------------------
    # 4. Check Resume Text
    # --------------------------------------------------------

    if not resume.resume_text:

        raise HTTPException(
            status_code=400,
            detail="Resume text is not available"
        )

    # --------------------------------------------------------
    # 5. Validate Question
    # --------------------------------------------------------

    question = request.question.strip()

    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    # --------------------------------------------------------
    # 6. Get Existing Chat OR Create New Chat
    # --------------------------------------------------------

    chat = None

    if request.chat_id is not None:

        chat = db.query(Chat).filter(
            Chat.id == request.chat_id,
            Chat.admin_id == admin_id,
            Chat.resume_id == resume_id
        ).first()

        if not chat:

            raise HTTPException(
                status_code=404,
                detail="Chat not found"
            )

    else:

        chat = Chat(
            admin_id=admin_id,
            resume_id=resume_id,
            title=question[:100]
        )

        db.add(chat)
        db.commit()
        db.refresh(chat)

    # --------------------------------------------------------
    # 7. Save User Message
    # --------------------------------------------------------

    user_message = Message(
        chat_id=chat.id,
        role="user",
        content=question
    )

    db.add(user_message)
    db.commit()

    # --------------------------------------------------------
    # 8. Create Vector Store
    # --------------------------------------------------------

    try:

        vector_store = create_vector_store(
            resume.resume_text
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create vector store: {str(e)}"
        )

    # --------------------------------------------------------
    # 9. Ask Question Using RAG
    # --------------------------------------------------------

    try:

        answer = ask_resume_question(
            vector_store=vector_store,
            question=question,
            k=4
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate AI response: {str(e)}"
        )

    # --------------------------------------------------------
    # 10. Save AI Message
    # --------------------------------------------------------

    ai_message = Message(
        chat_id=chat.id,
        role="assistant",
        content=answer
    )

    db.add(ai_message)
    db.commit()

    # --------------------------------------------------------
    # 11. Return Response
    # --------------------------------------------------------

    return {
        "chat_id": chat.id,
        "answer": answer
    }


# ============================================================
# GET ALL CHATS
# ============================================================

@router.get("/chats")
def get_all_chats(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):

    # --------------------------------------------------------
    # Current Admin
    # --------------------------------------------------------

    try:
        admin_id = int(current_admin["sub"])
    except (KeyError, TypeError, ValueError):

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    # --------------------------------------------------------
    # Get Chats
    # --------------------------------------------------------

    chats = db.query(Chat).filter(
        Chat.admin_id == admin_id
    ).order_by(
        Chat.created_at.desc()
    ).all()

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return [
        {
            "id": chat.id,
            "resume_id": chat.resume_id,
            "title": chat.title,
            "created_at": chat.created_at
        }
        for chat in chats
    ]


# ============================================================
# GET CHAT MESSAGES
# ============================================================

@router.get("/chats/{chat_id}")
def get_chat_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):

    # --------------------------------------------------------
    # Current Admin
    # --------------------------------------------------------

    try:
        admin_id = int(current_admin["sub"])
    except (KeyError, TypeError, ValueError):

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    # --------------------------------------------------------
    # Check Chat Ownership
    # --------------------------------------------------------

    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.admin_id == admin_id
    ).first()

    if not chat:

        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    # --------------------------------------------------------
    # Get Messages
    # --------------------------------------------------------

    messages = db.query(Message).filter(
        Message.chat_id == chat_id
    ).order_by(
        Message.created_at.asc()
    ).all()

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "chat_id": chat.id,
        "resume_id": chat.resume_id,
        "title": chat.title,

        "messages": [
            {
                "id": message.id,
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at
            }
            for message in messages
        ]
    }