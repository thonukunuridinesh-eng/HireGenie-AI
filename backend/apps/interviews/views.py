from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.activities.models import ActivityLog
from apps.core.utils import error_response, success_response
from apps.interviews.models import InterviewQuestion, InterviewSession
from apps.interviews.serializers import (
    InterviewSessionSerializer,
    StartInterviewSerializer,
    SubmitAnswerSerializer,
)
from apps.interviews.services import evaluate_answer, generate_interview_questions


class InterviewSessionViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InterviewSession.objects.filter(user=self.request.user).order_by(
            "-created_at"
        )

    @action(detail=False, methods=["post"])
    def start(self, request):
        serializer = StartInterviewSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Invalid interview parameters.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        session = InterviewSession.objects.create(
            user=request.user,
            target_role=serializer.validated_data["target_role"],
            interview_type=serializer.validated_data["interview_type"],
            difficulty=serializer.validated_data["difficulty"],
            status="started",
        )

        questions = generate_interview_questions(
            target_role=session.target_role,
            interview_type=session.interview_type,
            difficulty=session.difficulty,
        )

        for question in questions:
            InterviewQuestion.objects.create(session=session, question=question)

        ActivityLog.objects.create(
            user=request.user,
            action="Mock interview started",
            description=f"{session.target_role} interview session started.",
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return success_response(
            message="Interview session initialized successfully.",
            data=InterviewSessionSerializer(session).data,
            status_code=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def submit_answer(self, request, pk=None):
        session = self.get_object()
        serializer = SubmitAnswerSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                message="Invalid answer content.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            question = session.questions.get(
                id=serializer.validated_data["question_id"]
            )
        except InterviewQuestion.DoesNotExist:
            return error_response(
                message="Question not found for this interview session.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        answer_text = serializer.validated_data["answer"].strip()

        result = evaluate_answer(
            question=question.question,
            answer=answer_text,
            target_role=session.target_role,
        )

        question.answer = answer_text
        question.ai_feedback = result["feedback"]
        question.score = result["score"]
        question.save(update_fields=["answer", "ai_feedback", "score", "updated_at"])

        answered_scores = list(
            session.questions.exclude(answer="").values_list("score", flat=True)
        )
        session.score = round(sum(answered_scores) / len(answered_scores))
        session.overall_feedback = result["feedback"]
        session.save(update_fields=["score", "overall_feedback", "updated_at"])

        ActivityLog.objects.create(
            user=request.user,
            action="Interview answer evaluated",
            description=f"Answer evaluated with score {result['score']}/100.",
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return success_response(
            message="Answer updated and scored successfully.",
            data=InterviewSessionSerializer(session).data,
        )

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        session = self.get_object()
        session.status = "completed"
        session.completed_at = timezone.now()

        feedback_details = session.overall_feedback or (
            "Complete more answers to receive detailed feedback."
        )

        if session.score >= 80:
            session.overall_feedback = (
                "Excellent performance. You are close to job-ready.\n\n"
                f"Details: {feedback_details}"
            )
        elif session.score >= 60:
            session.overall_feedback = (
                "Good progress. Focus on clearer project examples and technical depth.\n\n"
                f"Details: {feedback_details}"
            )
        else:
            session.overall_feedback = (
                "Keep practicing. Add specific examples, role keywords, and measurable impact.\n\n"
                f"Details: {feedback_details}"
            )

        session.save(
            update_fields=[
                "status",
                "completed_at",
                "overall_feedback",
                "updated_at",
            ]
        )

        ActivityLog.objects.create(
            user=request.user,
            action="Mock interview completed",
            description=f"Interview session final score: {session.score}/100.",
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return success_response(
            message="Interview session saved as completed.",
            data=InterviewSessionSerializer(session).data,
        )
