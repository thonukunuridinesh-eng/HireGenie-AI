from django.contrib import admin
from .models import AptitudeTest, AptitudeQuestion, AptitudeResult

@admin.register(AptitudeQuestion)
class AptitudeQuestionAdmin(admin.ModelAdmin):
    list_display = ["id", "test", "category", "difficulty", "marks", "is_active", "created_at"] if hasattr(AptitudeQuestion, 'created_at') else ["id", "test", "category", "difficulty", "marks", "is_active"]
    list_filter = ["category", "difficulty", "is_active"]
    search_fields = ["question_text"]

@admin.register(AptitudeTest)
class AptitudeTestAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "duration_minutes", "is_active", "created_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["title"]

@admin.register(AptitudeResult)
class AptitudeResultAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "test", "score", "total_marks", "correct_count", "wrong_count", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__email", "test__title"]
