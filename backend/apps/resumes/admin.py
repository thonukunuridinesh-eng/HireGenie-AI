from django.contrib import admin

from apps.resumes.models import ATSReport, Resume, ResumeSection


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "title",
        "status",
        "ai_score",
        "created_at",
    ]
    list_filter = [
        "status",
        "created_at",
    ]
    search_fields = [
        "user__email",
        "title",
        "raw_text",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
    ]


@admin.register(ResumeSection)
class ResumeSectionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "resume",
        "section_type",
    ]
    list_filter = [
        "section_type",
    ]
    search_fields = [
        "resume__user__email",
        "section_type",
    ]


@admin.register(ATSReport)
class ATSReportAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "resume",
        "ats_score",
        "created_at",
    ]
    list_filter = [
        "ats_score",
        "created_at",
    ]
    search_fields = [
        "resume__user__email",
        "resume__title",
        "summary",
        "suggestions",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
    ]