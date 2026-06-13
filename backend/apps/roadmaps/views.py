import logging
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.core.utils import error_response, success_response
from apps.activities.models import ActivityLog
from apps.roadmaps.models import CareerRoadmap, Milestone, ActionItem
from apps.roadmaps.serializers import (
    CareerRoadmapSerializer,
    GenerateRoadmapSerializer,
)
from apps.roadmaps.services import generate_career_roadmap

logger = logging.getLogger(__name__)

class CareerRoadmapViewSet(viewsets.ModelViewSet):
    serializer_class = CareerRoadmapSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CareerRoadmap.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=False, methods=["post"])
    def generate(self, request):
        serializer = GenerateRoadmapSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Invalid roadmap parameters.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        career_goal = serializer.validated_data["career_goal"]
        exp_level = serializer.validated_data.get("experience_level", "beginner")

        # Deactivate old roadmaps so only this new generated plan remains active
        CareerRoadmap.objects.filter(user=request.user).update(is_active=False)

        # Trigger AI Generation loop service parameters
        ai_data = generate_career_roadmap(
            career_goal=career_goal,
            experience_level=exp_level,
        )

        # Save the master tracking head instance
        roadmap = CareerRoadmap.objects.create(
            user=request.user,
            career_goal=career_goal,
            estimated_months=4,
            is_active=True
        )

        # Parse weekly_learning_roadmap nested arrays safely into relational rows
        weekly_plan = ai_data.get("weekly_learning_roadmap", [])
        if weekly_plan:
            for idx, step in enumerate(weekly_plan, start=1):
                week_num = step.get("week", idx)
                focus_title = step.get("focus", f"Phase {week_num}")
                desc_summary = f"Focus timeline items: {focus_title}"

                # Create chronological milestone records
                milestone = Milestone.objects.create(
                    roadmap=roadmap,
                    order=week_num,
                    title=focus_title,
                    description=desc_summary,
                    is_completed=False
                )

                # Nest individual item actions as dependent nodes
                tasks = step.get("tasks", [])
                for t in tasks:
                    if t:
                        ActionItem.objects.create(
                            milestone=milestone,
                            task=str(t),
                            is_completed=False
                        )

        # Audit log creation rules matching systemic activity tracking schemas
        ActivityLog.objects.create(
            user=request.user,
            action="career_roadmap_generated",
            description=f"AI Roadmap generated successfully for target role: '{career_goal}'.",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return success_response(
            message="Career roadmap generated and compiled successfully.",
            data=CareerRoadmapSerializer(roadmap).data,
            status_code=status.HTTP_201_CREATED,
        )
