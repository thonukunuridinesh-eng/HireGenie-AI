from django.db import models
from django.contrib.auth import get_user_model
from apps.core.models import TimeStampedModel
from apps.core.utils import generate_unique_filename

User = get_user_model()


class Resume(TimeStampedModel):
    STATUS_CHOICES = (
        ("uploaded", "Uploaded"),
        ("parsing", "Parsing"),
        ("parsed", "Parsed"),
        ("failed", "Failed"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="resumes"
    )
    title = models.CharField(max_length=255, blank=True, null=True)
    target_role = models.CharField(max_length=120, blank=True, default="")
    file = models.FileField(upload_to=generate_unique_filename)
    raw_text = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="uploaded"
    )
    ai_score = models.IntegerField(blank=True, null=True)
    ai_feedback = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.title or 'Untitled Resume'}"


class ResumeSection(models.Model):
    SECTION_TYPES = (
        ("education", "Education"),
        ("experience", "Work Experience"),
        ("skills", "Skills"),
        ("projects", "Projects"),
        ("certifications", "Certifications"),
    )

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="sections"
    )
    section_type = models.CharField(max_length=50, choices=SECTION_TYPES)
    content = models.JSONField(
        help_text="Structured JSON data for this section"
    )

    def __str__(self):
        return f"{self.resume.id} - {self.get_section_type_display()}"


class ATSReport(TimeStampedModel):
    resume = models.OneToOneField(
        Resume,
        on_delete=models.CASCADE,
        related_name="ats_report"
    )

    ats_score = models.IntegerField(default=0)
    extracted_skills = models.JSONField(default=list, blank=True)
    missing_keywords = models.JSONField(default=list, blank=True)
    matched_keywords = models.JSONField(default=list, blank=True)
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    suggestions = models.TextField(blank=True, null=True)
    summary = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"ATS Report - {self.resume.user.email} - {self.ats_score}%"
