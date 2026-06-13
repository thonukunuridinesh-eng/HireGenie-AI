import logging
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.core.permissions import IsAdminUserOrReadOnly
from apps.core.utils import error_response, success_response
from apps.jobs.models import Job, Application
from apps.jobs.serializers import JobSerializer, SavedJobSerializer
from apps.activities.models import ActivityLog

logger = logging.getLogger(__name__)

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated, IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True).order_by("-created_at")

        job_type = self.request.query_params.get("job_type")
        work_mode = self.request.query_params.get("work_mode")  # maps to location_type
        skill = self.request.query_params.get("skill")

        if job_type:
            queryset = queryset.filter(job_type=job_type)

        if work_mode:
            queryset = queryset.filter(location_type=work_mode)

        if skill:
            queryset = queryset.filter(requirements__icontains=skill)

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(detail=False, methods=["get"])
    def recommended(self, request):
        jobs = list(Job.objects.filter(is_active=True))

        profile = getattr(request.user, "profile", None)
        bio_text = getattr(profile, "bio", "") or ""
        user_keywords = [word.lower().strip() for word in bio_text.replace(",", " ").split() if len(word) > 2]

        def score_job(job):
            if not job.requirements:
                return 0
            required_skills = [skill.strip().lower() for skill in job.requirements.split(",") if skill.strip()]
            if not required_skills:
                return 0
            return len(set(user_keywords).intersection(required_skills))

        jobs.sort(key=score_job, reverse=True)

        serializer = JobSerializer(
            jobs[:10],
            many=True,
            context={"request": request},
        )

        return success_response(
            message="Recommended jobs loaded successfully.",
            data=serializer.data,
        )

class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter applications by candidate keyword match parameters
        return Application.objects.filter(candidate=self.request.user).order_by("-created_at")

    def create(self, request, *args, **kwargs):
        serializer = SavedJobSerializer(data=request.data, context={"request": request})

        if not serializer.is_valid():
            return error_response(
                message="Invalid job application tracking parameters.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        job_id = serializer.validated_data["job_id"]

        try:
            job = Job.objects.get(id=job_id, is_active=True)
        except Job.DoesNotExist:
            return error_response(
                message="Job matching specific identifier not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        # Map to Application model schema configurations
        saved_job, created = Application.objects.get_or_create(
            candidate=request.user,
            job=job,
            defaults={
                "status": serializer.validated_data.get("status", "applied"),
                "cover_letter": serializer.validated_data.get("cover_letter", ""),
            },
        )

        if not created:
            # Overwrite properties if already instantiated inside database logs
            saved_job.status = serializer.validated_data.get("status", saved_job.status)
            cover_letter_val = request.data.get("notes") or request.data.get("cover_letter")
            if cover_letter_val:
                saved_job.cover_letter = cover_letter_val
            saved_job.save()

        ActivityLog.objects.create(
            user=request.user,
            action="job_application_tracked",
            description=f"Tracked application for {job.title} at {job.company_name}",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return success_response(
            message="Job tracking data updated successfully.",
            data=SavedJobSerializer(saved_job).data,
            status_code=status.HTTP_201_CREATED,
        )
