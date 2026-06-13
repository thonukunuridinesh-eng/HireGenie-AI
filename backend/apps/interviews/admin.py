from django.contrib import admin

from apps.interviews.models import (
    InterviewMessage,
    InterviewQuestion,
    InterviewSession,
)


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "interview_type",
        "target_role",
        "difficulty",
        "score",
        "status",
        "created_at",
    )
    search_fields = ("user__email", "target_role")
    list_filter = ("interview_type", "difficulty", "status", "created_at")


@admin.register(InterviewQuestion)
class InterviewQuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "session", "score", "created_at")
    search_fields = ("question", "answer", "session__user__email")


@admin.register(InterviewMessage)
class InterviewMessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "session",
        "sender",
        "message_type",
        "score",
        "created_at",
    )
    search_fields = ("content", "session__user__email", "session__target_role")
    list_filter = ("sender", "message_type", "created_at")