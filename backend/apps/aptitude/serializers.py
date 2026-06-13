from rest_framework import serializers
from .models import AptitudeTest, AptitudeQuestion, AptitudeResult

class AptitudeQuestionPublicSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = AptitudeQuestion
        fields = [
            "id",
            "category",
            "difficulty",
            "question_text",
            "options",
            "marks",
        ]

    def get_options(self, obj):
        # Format the explicit database column strings into a structured array list
        return [
            {"key": "A", "text": getattr(obj, 'option_a', '')},
            {"key": "B", "text": getattr(obj, 'option_b', '')},
            {"key": "C", "text": getattr(obj, 'option_c', '')},
            {"key": "D", "text": getattr(obj, 'option_d', '')},
        ]

class AptitudeQuestionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = AptitudeQuestion
        fields = "__all__"

class AptitudeTestSerializer(serializers.ModelSerializer):
    questions = AptitudeQuestionPublicSerializer(many=True, read_only=True)
    description = serializers.CharField(default="Comprehensive Aptitude Assessment", read_only=True)

    class Meta:
        model = AptitudeTest
        fields = [
            "id",
            "title",
            "description",
            "duration_minutes",
            "questions",
            "is_active",
            "created_at",
        ]

class AptitudeResultSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True)
    submitted_answers = serializers.JSONField(default=dict, read_only=True)
    completed_at = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = AptitudeResult
        fields = [
            "id",
            "test",
            "test_title",
            "score",
            "total_marks",
            "correct_count",
            "wrong_count",
            "submitted_answers",
            "completed_at",
            "created_at",
        ]

class SubmitAptitudeTestSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.CharField(),
        help_text="Map of question IDs to your selected option key character. Example: {'1': 'A', '2': 'C'}",
    )
    time_taken_seconds = serializers.IntegerField(required=False, default=0)
