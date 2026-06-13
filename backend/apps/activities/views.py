from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from apps.activities.models import ActivityLog
from apps.activities.serializers import ActivityLogSerializer

class ActivityLogViewSet(ReadOnlyModelViewSet):
    """
    API viewset providing an unmodifiable history log of actions 
    performed by the authenticated user.
    """
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ActivityLog.objects.filter(user=self.request.user).order_by("-created_at")
