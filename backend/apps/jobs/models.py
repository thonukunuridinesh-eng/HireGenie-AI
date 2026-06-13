from django.contrib.auth import get_user_model
from django.db import models

from apps.core.models import TimeStampedModel


User = get_user_model()


class Job(TimeStampedModel):
    WORK_MODE_CHOICES = [
        ("remote", "Remote"),
        ("hybrid", "Hybrid"),
        ("onsite", "On-site"),
    ]

    JOB_TYPE_CHOICES = [
        ("internship", "Internship"),
        ("full_time", "Full Time"),
        ("part_time", "Part Time"),
        ("contract", "Contract"),
    ]

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=150)

    location = models.CharField(max_length=150, blank=True)

    work_mode = models.CharField(
        max_length=20,
        choices=WORK_MODE_CHOICES,
        default="remote",
    )

    job_type = models.CharField(
        max_length=20,
        choices=JOB_TYPE_CHOICES,
        default="internship",
    )

    required_skills = models.JSONField(default=list, blank=True)

    description = models.TextField()
    salary_range = models.CharField(max_length=100, blank=True)

    apply_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} at {self.company}"


class SavedJob(TimeStampedModel):
    STATUS_CHOICES = [
        ("saved", "Saved"),
        ("applied", "Applied"),
        ("interview", "Interview"),
        ("rejected", "Rejected"),
        ("selected", "Selected"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="saved_jobs",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="saved_by_users",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="saved",
    )

    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ["user", "job"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.job.title}"


class Application(TimeStampedModel):
    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("reviewed", "Reviewed"),
        ("shortlisted", "Shortlisted"),
        ("interview", "Interview"),
        ("rejected", "Rejected"),
        ("selected", "Selected"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="job_applications",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    resume = models.FileField(
        upload_to="job_applications/resumes/",
        blank=True,
        null=True,
    )

    cover_letter = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="applied",
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "job"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} applied for {self.job.title}"