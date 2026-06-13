from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.core.models import TimeStampedModel


User = get_user_model()


class InterviewSession(TimeStampedModel):
    TYPE_CHOICES = [
        ("hr", "HR Interview"),
        ("technical", "Technical Interview"),
        ("mixed", "Mixed Interview"),
    ]

    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    STATUS_CHOICES = [
        ("started", "Started"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="interview_sessions",
    )

    interview_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default="mixed",
    )

    target_role = models.CharField(max_length=120)

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default="medium",
    )

    score = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="started",
    )

    overall_feedback = models.TextField(blank=True)

    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.target_role} Interview"


class InterviewQuestion(TimeStampedModel):
    session = models.ForeignKey(
        InterviewSession,
        on_delete=models.CASCADE,
        related_name="questions",
    )

    question = models.TextField()
    answer = models.TextField(blank=True)
    ai_feedback = models.TextField(blank=True)

    score = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Question for {self.session.target_role}"


class InterviewMessage(TimeStampedModel):
    SENDER_CHOICES = [
        ("ai", "AI"),
        ("user", "User"),
        ("system", "System"),
    ]

    MESSAGE_TYPE_CHOICES = [
        ("question", "Question"),
        ("answer", "Answer"),
        ("feedback", "Feedback"),
        ("note", "Note"),
    ]

    session = models.ForeignKey(
        InterviewSession,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.CharField(
        max_length=20,
        choices=SENDER_CHOICES,
        default="ai",
    )

    message_type = models.CharField(
        max_length=30,
        choices=MESSAGE_TYPE_CHOICES,
        default="question",
    )

    content = models.TextField()

    ai_feedback = models.TextField(blank=True)

    score = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.session.target_role} - {self.sender} - {self.message_type}"