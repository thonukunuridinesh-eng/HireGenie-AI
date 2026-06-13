import logging
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.core.utils import error_response, success_response
from apps.activities.models import ActivityLog
from apps.interviews.models import InterviewSession, InterviewMessage
from apps.interviews.serializers import (
    InterviewSessionSerializer,
    StartInterviewSerializer,
    SubmitAnswerSerializer,
)
from apps.interviews.services import evaluate_answer, generate_interview_questions

logger = logging.getLogger(__name__)

class InterviewSessionViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InterviewSession.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=False, methods=["post"])
    def start(self, request):
        serializer = StartInterviewSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Invalid interview parameters.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Create master session using exact model attributes
        session = InterviewSession.objects.create(
            user=request.user,
            job_title=serializer.validated_data["job_title"],
            job_description=serializer.validated_data["job_description"],
            resume_id=serializer.validated_data["resume_id"],
            status="active",
        )

        # Pull AI questions from your service layer wrapper
        questions = generate_interview_questions(
            target_role=session.job_title,
            interview_type=serializer.validated_data["interview_type"],
            difficulty=serializer.validated_data["difficulty"],
        )

        # Store generated questions chronologically as system context prompts
        for q in questions:
            InterviewMessage.objects.create(
                session=session,
                sender="system",
                message_text=f"Question: {q}"
            )

        # Audit track using the active ActivityLog setup
        ActivityLog.objects.create(
            user=request.user,
            action="mock_interview_started",
            description=f"Session for {session.job_title} started.",
            ip_address=request.META.get('REMOTE_ADDR')
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

        answer_text = serializer.validated_data["answer"]

        # Log candidate input
        InterviewMessage.objects.create(
            session=session,
            sender="candidate",
            message_text=answer_text
        )

        # Find the latest unanswered question prompt string inside the message log
        last_question = session.messages.filter(sender="system").last()
        question_text = last_question.message_text.replace("Question: ", "") if last_question else "General interview inquiry"

        # Evaluate performance heuristics
        result = evaluate_answer(
            question=question_text,
            answer=answer_text,
            target_role=session.job_title,
        )

        # Append evaluation details back into the tracking loop
        InterviewMessage.objects.create(
            session=session,
            sender="ai",
            message_text=f"Feedback: {result['feedback']}"
        )

        # Adjust session stats incrementally
        session.overall_score = result["score"]
        session.feedback = result["feedback"]
        session.save(update_fields=["overall_score", "feedback"])

        ActivityLog.objects.create(
            user=request.user,
            action="interview_answer_evaluated",
            description=f"Answer evaluated with score {result['score']}/100.",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return success_response(
            message="Answer updated and scored successfully.",
            data=InterviewSessionSerializer(session).data,
        )

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        session = self.get_object()
        session.status = "completed"
        
        if not session.overall_score:
            session.overall_score = 0
            
        if session.overall_score >= 80:
            session.feedback = f"Excellent performance. You are completely job-ready!\n\nDetails: {session.feedback}"
        elif session.overall_score >= 60:
            session.feedback = f"Good progress. Focus on refining architectural details.\n\nDetails: {session.feedback}"
        else:
            session.feedback = f"Needs more review. Go over fundamental core items.\n\nDetails: {session.feedback}"
            
        session.save(update_fields=["status", "feedback"])

        ActivityLog.objects.create(
            user=request.user,
            action="mock_interview_completed",
            description=f"Interview session final score: {session.overall_score}/100.",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return success_response(
            message="Interview session saved as completed.",
            data=InterviewSessionSerializer(session).data,
        )
