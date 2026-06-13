from django.db import models
from django.contrib.auth import get_user_model
from apps.core.models import TimeStampedModel

User = get_user_model()

class AptitudeTest(TimeStampedModel):
    title = models.CharField(max_length=255)
    duration_minutes = models.IntegerField(default=30)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class AptitudeQuestion(models.Model):
    test = models.ForeignKey(AptitudeTest, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    question_text = models.TextField()
    category = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)
    marks = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.question_text[:50]

class AptitudeResult(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='aptitude_results')
    test = models.ForeignKey(AptitudeTest, on_delete=models.CASCADE, related_name='results')
    score = models.IntegerField()
    total_marks = models.IntegerField()
    correct_count = models.IntegerField(default=0)
    wrong_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.email} - {self.test.title} ({self.score})"
