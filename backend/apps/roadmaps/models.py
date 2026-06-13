from django.db import models
from django.contrib.auth import get_user_model
from apps.core.models import TimeStampedModel

User = get_user_model()

class CareerRoadmap(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roadmaps')
    career_goal = models.CharField(max_length=255, help_text="e.g., Full Stack Engineer, Data Scientist")
    estimated_months = models.IntegerField(default=6)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.email} - {self.career_goal}"

class Milestone(models.Model):
    roadmap = models.ForeignKey(CareerRoadmap, on_delete=models.CASCADE, related_name='milestones')
    order = models.IntegerField(default=1)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class ActionItem(models.Model):
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE, related_name='action_items')
    task = models.CharField(max_length=255)
    resource_url = models.URLField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.task
