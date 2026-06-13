from rest_framework import serializers
from .models import CareerRoadmap, Milestone, ActionItem

class ActionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionItem
        fields = ['id', 'task', 'resource_url', 'is_completed']

class MilestoneSerializer(serializers.ModelSerializer):
    action_items = ActionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Milestone
        fields = ['id', 'order', 'title', 'description', 'is_completed', 'action_items']

class CareerRoadmapSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    # Mapping old JSON names as dynamic placeholders or metadata options if needed
    ai_summary = serializers.SerializerMethodField()

    class Meta:
        model = CareerRoadmap
        fields = [
            "id",
            "user",
            "user_email",
            "career_goal",
            "estimated_months",
            "is_active",
            "milestones",
            "ai_summary",
            "created_at",
        ]
        read_only_fields = ['user', 'is_active', 'created_at']

    def get_ai_summary(self, obj):
        return f"Personalised path toward achieving your goal as a {obj.career_goal}."

class GenerateRoadmapSerializer(serializers.Serializer):
    career_goal = serializers.CharField(max_length=150, required=True)
    experience_level = serializers.ChoiceField(choices=['beginner', 'intermediate', 'advanced'], default='beginner')
