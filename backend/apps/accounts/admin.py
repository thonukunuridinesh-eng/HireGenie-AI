from django.contrib import admin

from apps.accounts.models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "full_name",
        "role",
        "target_role",
        "experience_level",
        "total_points",
        "created_at",
    ]
    list_filter = ["role", "experience_level", "created_at"]
    search_fields = ["user__username", "user__email", "full_name", "target_role"]