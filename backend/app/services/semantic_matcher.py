from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def calculate_semantic_match(
    resume_skills: list[str],
    required_skills: list[str],
    threshold: float = 0.55
):
    """
    Calculate semantic similarity between
    resume skills and job required skills.
    """

    if not required_skills:
        return {
            "semantic_score": 0.0,
            "matched_skills": [],
            "missing_skills": []
        }

    if not resume_skills:
        return {
            "semantic_score": 0.0,
            "matched_skills": [],
            "missing_skills": required_skills
        }

    # Create embeddings
    resume_embeddings = model.encode(
        resume_skills
    )

    job_embeddings = model.encode(
        required_skills
    )

    # Calculate similarity matrix
    similarity_matrix = cosine_similarity(
        job_embeddings,
        resume_embeddings
    )

    matched_skills = []
    missing_skills = []

    similarity_scores = []

    for job_index, job_skill in enumerate(
        required_skills
    ):

        # Convert NumPy values to Python float
        best_score = float(
            max(similarity_matrix[job_index])
        )

        similarity_scores.append(best_score)

        if best_score >= threshold:
            matched_skills.append(job_skill)
        else:
            missing_skills.append(job_skill)

    # Calculate semantic score
    semantic_score = (
        sum(similarity_scores)
        / len(similarity_scores)
    ) * 100

    return {
        "semantic_score": float(
            round(semantic_score, 2)
        ),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }