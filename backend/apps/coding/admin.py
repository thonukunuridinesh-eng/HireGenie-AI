from django.contrib import admin

from apps.coding.models import CodingQuestion, CodingSubmission


@admin.register(CodingQuestion)
class CodingQuestionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "difficulty",
        "points",
        "is_active",
        "created_at",
    ]
    list_filter = [
        "difficulty",
        "is_active",
        "created_at",
    ]
    search_fields = [
        "title",
        "description",
        "tags",
    ]
    prepopulated_fields = {
        "slug": ("title",)
    }


@admin.register(CodingSubmission)
class CodingSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "question",
        "language",
        "status",
        "score",
        "runtime_ms",
        "created_at",
    ]
    list_filter = [
        "status",
        "language",
        "created_at",
    ]
    search_fields = [
        "user__email",
        "question__title",
        "code",
        "output",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
    ]