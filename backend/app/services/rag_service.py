import os

from dotenv import load_dotenv

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_huggingface import (
    HuggingFaceEmbeddings
)

from langchain_community.vectorstores import FAISS

from langchain_groq import ChatGroq

from langchain_core.prompts import ChatPromptTemplate


load_dotenv()


# ==================================================
# EMBEDDING MODEL
# ==================================================

EMBEDDING_MODEL = (
    "sentence-transformers/all-MiniLM-L6-v2"
)

embeddings = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL
)


# ==================================================
# LLM
# ==================================================

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0
)


# ==================================================
# TEXT CHUNKING
# ==================================================

def create_chunks(
    text: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 150
):

    if not text or not text.strip():
        return []

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )

    chunks = text_splitter.split_text(text)

    return [
        chunk.strip()
        for chunk in chunks
        if chunk.strip()
    ]


# ==================================================
# CREATE VECTOR STORE
# ==================================================

def create_vector_store(text: str):

    chunks = create_chunks(text)

    if not chunks:
        raise ValueError(
            "No text available for vector store"
        )

    vector_store = FAISS.from_texts(
        chunks,
        embedding=embeddings
    )

    return vector_store


# ==================================================
# SEARCH RELEVANT CHUNKS
# ==================================================

def search_resume(
    vector_store,
    question: str,
    k: int = 4
):

    if not question.strip():
        return []

    documents = vector_store.similarity_search(
        question,
        k=k
    )

    return documents


# ==================================================
# ASK QUESTION
# ==================================================

def ask_resume_question(
    vector_store,
    question: str,
    k: int = 4
):

    documents = search_resume(
        vector_store,
        question,
        k=k
    )

    if not documents:
        return (
            "I could not find relevant information "
            "in the resume."
        )

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an AI Resume Assistant.

Answer the user's question using ONLY
the provided resume context.

Do not invent information.

If the answer is not available in the
resume context, clearly say that the
information is not available in the resume.

Resume Context:
{context}
"""
            ),
            (
                "human",
                "{question}"
            )
        ]
    )

    chain = prompt | llm

    response = chain.invoke(
        {
            "context": context,
            "question": question
        }
    )

    return response.content

def ask_resume_by_id(
    resume_id: int,
    question: str,
    db,
    k: int = 4
):
    """
    Ask a question about a specific resume.
    """

    from ..database.models import Resume

    # --------------------------------------
    # Find Resume
    # --------------------------------------

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise ValueError(
            "Resume not found"
        )

    # --------------------------------------
    # Check Resume Text
    # --------------------------------------

    if not resume.resume_text:
        raise ValueError(
            "Resume text is not available"
        )

    # --------------------------------------
    # Create Vector Store
    # --------------------------------------

    vector_store = create_vector_store(
        resume.resume_text
    )

    # --------------------------------------
    # Ask Question
    # --------------------------------------

    answer = ask_resume_question(
        vector_store=vector_store,
        question=question,
        k=k
    )

    return answer