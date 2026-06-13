from rest_framework import serializers
from .models import Challenge, Submission

class CodingQuestionSerializer(serializers.ModelSerializer):
    # Mapping to your master Challenge model schema
    slug = serializers.CharField(source='id', read_only=True)
    starter_code = serializers.CharField(default="", read_only=True)
    is_active = serializers.BooleanField(default=True, read_only=True)
    tags = serializers.ListField(child=serializers.CharField(), default=list, read_only=True)
    input_format = serializers.CharField(source='constraints', read_only=True)
    output_format = serializers.CharField(source='constraints', read_only=True)

    class Meta:
        model = Challenge
        fields = [
            "id",
            "title",
            "slug",
            "difficulty",
            "description",
            "input_format",
            "output_format",
            "constraints",
            "sample_input",
            "sample_output",
            "tags",
            "starter_code",
            "points",
            "is_active",
            "created_at",
        ]

class CodingSubmissionSerializer(serializers.ModelSerializer):
    # Mapping to your master Submission model schema
    question = serializers.PrimaryKeyRelatedField(source='challenge', queryset=Challenge.objects.all())
    question_title = serializers.CharField(source="challenge.title", read_only=True)
    score = serializers.IntegerField(source='runtime_ms', read_only=True)
    output = serializers.CharField(source='error_message', read_only=True)

    class Meta:
        model = Submission
        fields = [
            "id",
            "question",
            "question_title",
            "language",
            "code",
            "status",
            "score",
            "output",
            "runtime_ms",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "score",
            "output",
            "runtime_ms",
            "created_at",
        ]

class LeaderboardProfileSerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    full_name = serializers.CharField()
    email = serializers.EmailField()
    total_points = serializers.IntegerField()
    target_role = serializers.CharField()
