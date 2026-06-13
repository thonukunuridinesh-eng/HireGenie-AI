from django.db import models


class TimeStampedModel(models.Model):
    """
    Common abstract model.

    Every important table will automatically get:
    - created_at
    - updated_at
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True