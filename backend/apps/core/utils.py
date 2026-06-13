import os
import uuid

from django.utils.text import slugify
from rest_framework.response import Response


def success_response(message="Success", data=None, status_code=200):
    """
    Standard success API response.
    """

    return Response(
        {
            "success": True,
            "message": message,
            "data": data,
        },
        status=status_code,
    )


def error_response(message="Something went wrong", errors=None, status_code=400):
    """
    Standard error API response.
    """

    return Response(
        {
            "success": False,
            "message": message,
            "errors": errors,
        },
        status=status_code,
    )


def generate_unique_filename(instance, filename):
    """
    Generate unique safe file name for uploaded files.

    Example:
    resume.pdf -> resumes/resume-a7f92c1e.pdf
    """

    name, extension = os.path.splitext(filename)
    safe_name = slugify(name) or "file"
    unique_id = uuid.uuid4().hex[:8]

    # If model has upload_folder attribute, use it.
    folder = getattr(instance, "upload_folder", "")

    new_filename = f"{safe_name}-{unique_id}{extension.lower()}"

    if folder:
        return os.path.join(folder, new_filename)

    return new_filename


def log_activity(user=None, module="core", action="", description="", metadata=None):
    """
    Safely create activity log.

    Important:
    This function should never break the main API.
    """

    try:
        from apps.activities.models import ActivityLog

        ActivityLog.objects.create(
            user=user if user and user.is_authenticated else None,
            module=module,
            action=action,
            description=description,
            metadata=metadata or {},
        )

    except Exception:
        # Never break main app because activity log failed.
        pass