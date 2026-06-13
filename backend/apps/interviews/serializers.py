from rest_framework import serializers
from .models import InterviewSession, InterviewMessage

class InterviewMessageSerializer(serializers.ModelSerializer):
    sender_display = serializers.CharField(source='get_sender_display', read_only=True)

    class Meta:
        model = InterviewMessage
        fields = [
            "id",
            "sender",
            "sender_display",
            "message_text",
            "latency_ms",
            "created_at",
        ]
        read_only_fields = ["id", "sender_display", "created_at"]

class InterviewSessionSerializer(serializers.ModelSerializer):
    messages = InterviewMessageSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "user",
            "user_email",
            "resume",
            "job_title",
            "job_description",
            "status",
            "status_display",
            "overall_score",
            "feedback",
            "metrics",
            "messages",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "status", "overall_score", "feedback", "metrics", "created_at", "updated_at"]

class StartInterviewSerializer(serializers.Serializer):
    job_title = serializers.CharField(max_length=255, required=True)
    job_description = serializers.CharField(required=False, allow_blank=True, default="")
    resume_id = serializers.IntegerField(required=False, allow_null=True, default=None)
    difficulty = serializers.ChoiceField(choices=['easy', 'medium', 'hard'], default='medium')
    interview_type = serializers.ChoiceField(choices=['technical', 'hr', 'mixed'], default='mixed')

class SubmitAnswerSerializer(serializers.Serializer):
    answer = serializers.CharField(required=True)
