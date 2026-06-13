from django.contrib.auth import get_user_model
from django.db import models

from apps.core.models import TimeStampedModel


User = get_user_model()


class Profile(TimeStampedModel):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("admin", "Admin"),
    ]

    EXPERIENCE_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="student",
    )

    full_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.URLField(blank=True)

    headline = models.CharField(
        max_length=255,
        blank=True,
        help_text="Example: Python Full Stack Developer",
    )

    bio = models.TextField(blank=True)
    location = models.CharField(max_length=150, blank=True)

    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)

    target_role = models.CharField(
        max_length=120,
        blank=True,
        help_text="Example: Python Developer, Data Analyst, Full Stack Developer",
    )

    skills = models.JSONField(
        default=list,
        blank=True,
        help_text="Example: ['Python', 'Django', 'React']",
    )

    experience_level = models.CharField(
        max_length=30,
        choices=EXPERIENCE_CHOICES,
        default="beginner",
    )

    total_points = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.full_name or self.user.username