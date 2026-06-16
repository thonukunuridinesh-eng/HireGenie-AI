from rest_framework import serializers

from apps.interviews.models import InterviewQuestion, InterviewSession


class InterviewQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewQuestion
        fields = [
            "id",
            "question",
            "answer",
            "ai_feedback",
            "score",
            "created_at",
        ]
        read_only_fields = ["id", "ai_feedback", "score", "created_at"]


class InterviewSessionSerializer(serializers.ModelSerializer):
    questions = InterviewQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "interview_type",
            "target_role",
            "difficulty",
            "score",
            "status",
            "overall_feedback",
            "questions",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "score",
            "status",
            "overall_feedback",
            "questions",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]


class StartInterviewSerializer(serializers.Serializer):
    target_role = serializers.CharField(max_length=120)
    difficulty = serializers.ChoiceField(
        choices=["easy", "medium", "hard"],
        default="medium",
    )
    interview_type = serializers.ChoiceField(
        choices=["technical", "hr", "mixed"],
        default="mixed",
    )


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer = serializers.CharField(required=True)
