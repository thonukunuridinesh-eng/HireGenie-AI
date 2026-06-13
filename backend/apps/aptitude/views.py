import logging
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.aptitude.models import AptitudeQuestion, AptitudeResult, AptitudeTest
from apps.aptitude.serializers import (
    AptitudeQuestionAdminSerializer,
    AptitudeResultSerializer,
    AptitudeTestSerializer,
    SubmitAptitudeTestSerializer,
)
from apps.core.permissions import IsAdminUserOrReadOnly
from apps.core.utils import error_response, success_response
from apps.activities.models import ActivityLog

logger = logging.getLogger(__name__)

class AptitudeQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = AptitudeQuestionAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def get_queryset(self):
        # Sorting by id instead of missing created_at field
        return AptitudeQuestion.objects.all().order_by("-id")

class AptitudeTestViewSet(viewsets.ModelViewSet):
    serializer_class = AptitudeTestSerializer
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def get_queryset(self):
        return AptitudeTest.objects.filter(is_active=True).order_by("-created_at")

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        test = self.get_object()
        serializer = SubmitAptitudeTestSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                message="Invalid test submission data.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        answers = serializer.validated_data["answers"]
        time_taken = serializer.validated_data.get("time_taken_seconds", 0)

        score = 0
        total_marks = 0
        correct_count = 0
        wrong_count = 0

        # Grading verification loop
        for question in test.questions.all():
            total_marks += question.marks
            selected_option = answers.get(str(question.id))

            # Normalize checks against option character keys (A, B, C, D)
            if selected_option and str(selected_option).strip().upper() == str(question.correct_option).strip().upper():
                score += question.marks
                correct_count += 1
            else:
                wrong_count += 1

        # Calculate passing metrics (e.g. score matches passing boundary)
        achieved_percentage = int((score / total_marks) * 100) if total_marks > 0 else 0
        passing_score_required = getattr(test, 'passing_score', 50)
        passed_evaluation = achieved_percentage >= passing_score_required

        # Save exam results tracking layout directly
        result = AptitudeResult.objects.create(
            user=request.user,
            test=test,
            score=achieved_percentage,
            total_marks=total_marks,
            correct_count=correct_count,
            wrong_count=wrong_count,
            time_taken_seconds=time_taken,
            is_passed=passed_evaluation
        )

        ActivityLog.objects.create(
            user=request.user,
            action="aptitude_test_submitted",
            description=f"Test '{test.title}' completed with score: {achieved_percentage}%",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return success_response(
            message="Aptitude assessment submitted and evaluated successfully.",
            data=AptitudeResultSerializer(result).data,
            status_code=status.HTTP_201_CREATED,
        )

class AptitudeResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AptitudeResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AptitudeResult.objects.filter(user=self.request.user).order_by("-created_at")
