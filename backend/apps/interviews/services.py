import json
import logging
from apps.core.ai import AIService

logger = logging.getLogger(__name__)

def generate_interview_questions(target_role, interview_type, difficulty):
    fallback_questions = [
        f"Tell me about yourself and why you want to become a {target_role}.",
        f"What are the important skills required for a {target_role}?",
        "Explain one project you built and the problem it solves.",
        "What challenges did you face in your project and how did you solve them?",
        "Why should we hire you for this role?",
    ]

    prompt = f"""
    Generate 5 interview questions for a student.

    Target Role: {target_role}
    Interview Type: {interview_type}
    Difficulty: {difficulty}

    Return only JSON matching this exact map:
    {{
      "questions": [
        "question 1",
        "question 2",
        "question 3",
        "question 4",
        "question 5"
      ]
    }}
    """

    try:
        ai = AIService()
        response_text = ai.generate_with_gemini(prompt)
        if not response_text and ai.openai_client:
            response_text = ai.generate_with_openai(prompt)

        if response_text:
            if response_text.startswith("`json"):
                response_text = response_text.replace("`json", "", 1).replace("`", "", 1).strip()
            elif response_text.startswith("`"):
                response_text = response_text.replace("`", "", 2).strip()
            
            data = json.loads(response_text)
            return data.get("questions", fallback_questions)
    except Exception as e:
        logger.error(f"Failed to generate AI questions: {str(e)}")
        
    return fallback_questions

def evaluate_answer(question, answer, target_role):
    # Rule-based programmatic heuristic score calculation
    answer_length = len(answer.split())
    score = 40

    if answer_length >= 30:
        score += 20
    if answer_length >= 60:
        score += 15

    role_words = target_role.lower().split()
    answer_lower = answer.lower()

    if any(word in answer_lower for word in role_words):
        score += 10
    if any(word in answer_lower for word in ["project", "built", "developed", "learned"]):
        score += 10

    score = min(score, 100)

    prompt = f"""
    You are an AI interview evaluator.

    Target Role: {target_role}

    Question:
    {question}

    Student Answer:
    {answer}

    Give short useful feedback:
    - Strengths
    - Improvements
    - Better sample answer direction

    Also mention a score out of 100.
    """

    fallback = (
        f"Score: {score}/100\n"
        "Good attempt. Improve your answer by adding specific project examples, "
        "technical keywords, and measurable achievements."
    )

    try:
        ai = AIService()
        feedback = ai.generate_with_gemini(prompt)
        if not feedback and ai.openai_client:
            feedback = ai.generate_with_openai(prompt)
        
        if feedback:
            return {"score": score, "feedback": feedback.strip()}
    except Exception as e:
        logger.error(f"Failed to evaluate AI answer: {str(e)}")

    return {"score": score, "feedback": fallback}
