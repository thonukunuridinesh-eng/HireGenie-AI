from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify

from apps.core.models import TimeStampedModel


User = get_user_model()


class CodingQuestion(TimeStampedModel):
    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default="easy",
    )

    category = models.CharField(max_length=100, default="Python")

    description = models.TextField()
    input_format = models.TextField(blank=True)
    output_format = models.TextField(blank=True)
    constraints = models.TextField(blank=True)

    sample_input = models.TextField(blank=True)
    sample_output = models.TextField(blank=True)

    tags = models.JSONField(default=list, blank=True)

    starter_code = models.TextField(blank=True)
    reference_solution = models.TextField(blank=True)

    # Added for compatibility with seed_data.py if it uses solution_code
    solution_code = models.TextField(blank=True)

    points = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["difficulty", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            while CodingQuestion.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class CodingSubmission(TimeStampedModel):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("wrong_answer", "Wrong Answer"),
        ("runtime_error", "Runtime Error"),
    ]

    LANGUAGE_CHOICES = [
        ("python", "Python"),
        ("javascript", "JavaScript"),
        ("java", "Java"),
        ("cpp", "C++"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="coding_submissions",
    )

    question = models.ForeignKey(
        CodingQuestion,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    language = models.CharField(
        max_length=30,
        choices=LANGUAGE_CHOICES,
        default="python",
    )

    code = models.TextField()

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="pending",
    )

    score = models.PositiveIntegerField(default=0)
    output = models.TextField(blank=True)
    runtime_ms = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.question.title}"


# Compatibility aliases
# These fix errors like:
# from apps.coding.models import Challenge
# from apps.coding.models import Submission

Challenge = CodingQuestion
Submission = CodingSubmission