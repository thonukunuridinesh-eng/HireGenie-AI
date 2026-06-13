import uuid

from django.contrib.auth import get_user_model
from django.db import models

from apps.core.models import TimeStampedModel


User = get_user_model()


class Certificate(TimeStampedModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="certificates",
    )

    title = models.CharField(max_length=200)

    certificate_id = models.CharField(
        max_length=100,
        unique=True,
        editable=False,
    )

    issued_for = models.CharField(
        max_length=200,
        help_text="Example: Python Aptitude Test, Mock Interview Completion",
    )

    score = models.PositiveIntegerField(default=0)

    qr_code = models.ImageField(
        upload_to="qr_codes/",
        blank=True,
        null=True,
    )

    pdf_file = models.FileField(
        upload_to="certificates/",
        blank=True,
        null=True,
    )

    verification_url = models.URLField(blank=True)

    issued_at = models.DateTimeField(auto_now_add=True)
    is_valid = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.certificate_id:
            self.certificate_id = f"HG-{uuid.uuid4().hex[:10].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.user.email}"