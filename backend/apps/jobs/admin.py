from django.contrib import admin

from apps.jobs.models import Application, Job, SavedJob


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "company",
        "location",
        "work_mode",
        "job_type",
        "is_active",
        "created_at",
    ]
    list_filter = ["work_mode", "job_type", "is_active", "created_at"]
    search_fields = ["title", "company", "location"]


@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "job",
        "status",
        "created_at",
    ]
    list_filter = ["status", "created_at"]
    search_fields = ["user__email", "job__title", "job__company"]


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "job",
        "status",
        "applied_at",
        "created_at",
    ]
    list_filter = ["status", "applied_at", "created_at"]
    search_fields = [
        "user__email",
        "job__title",
        "job__company",
        "cover_letter",
    ]
    readonly_fields = ["applied_at", "created_at", "updated_at"]