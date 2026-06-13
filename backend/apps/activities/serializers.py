from rest_framework import serializers
from .models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    module = serializers.CharField(source="action", read_only=True)
    metadata = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "user_email",
            "module",
            "action",
            "description",
            "ip_address",
            "user_agent",
            "metadata",
            "created_at",
        ]

    def get_metadata(self, obj):
        # Pack client browser agent and network origins into a safe mock metadata object
        return {
            "ip_address": obj.ip_address,
            "browser_agent": obj.user_agent[:60] if obj.user_agent else None
        }
