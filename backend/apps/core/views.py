from django.db.models import Avg
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.aptitude.models import AptitudeResult
from apps.coding.models import CodingSubmission
from apps.core.utils import success_response
from apps.interviews.models import InterviewSession
from apps.jobs.models import Job, SavedJob
from apps.resumes.models import ATSReport, Resume


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return success_response(
            message="HireGenie AI backend is running successfully.",
            data={
                "project": "HireGenie AI",
                "status": "healthy",
                "version": "1.0.0",
            },
        )


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        latest_ats_report = (
            ATSReport.objects.filter(resume__user=user)
            .order_by("-created_at")
            .first()
        )

        avg_interview_score = (
            InterviewSession.objects.filter(user=user, status="completed")
            .aggregate(avg=Avg("score"))
            .get("avg")
            or 0
        )

        avg_aptitude_score = (
            AptitudeResult.objects.filter(user=user)
            .aggregate(avg=Avg("score"))
            .get("avg")
            or 0
        )

        solved_questions = (
            CodingSubmission.objects.filter(user=user, status="accepted")
            .values("question")
            .distinct()
            .count()
        )

        # Safe recent activities
        recent_activities = []
        activity_manager = getattr(user, "activity_logs", None)

        if activity_manager:
            recent_activities = [
                {
                    "module": activity.module,
                    "action": activity.action,
                    "description": activity.description,
                    "created_at": activity.created_at,
                }
                for activity in activity_manager.order_by("-created_at")[:8]
            ]

        # Safe profile points
        profile_points = 0
        try:
            profile_points = getattr(user.profile, "total_points", 0)
        except ObjectDoesNotExist:
            profile_points = 0
        except AttributeError:
            profile_points = 0

        recommended_jobs = Job.objects.filter(is_active=True).order_by("-created_at")[:5]

        data = {
            # Fixed: your ATSReport model has ats_score, not score
            "ats_score": latest_ats_report.ats_score if latest_ats_report else 0,

            "interview_performance": round(avg_interview_score, 2),
            "coding_progress": solved_questions,
            "aptitude_score": round(avg_aptitude_score, 2),
            "uploaded_resumes": Resume.objects.filter(user=user).count(),
            "saved_jobs": SavedJob.objects.filter(user=user).count(),
            "profile_points": profile_points,

            "recent_activities": recent_activities,

            "recommended_jobs": [
                {
                    "id": job.id,
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "work_mode": job.work_mode,
                    "job_type": job.job_type,
                    "required_skills": job.required_skills,
                }
                for job in recommended_jobs
            ],

            "skill_growth": [
                {"month": "Jan", "score": 20},
                {"month": "Feb", "score": 35},
                {"month": "Mar", "score": 45},
                {"month": "Apr", "score": 60},
                {"month": "May", "score": 76},
                {"month": "Jun", "score": 88},
            ],
        }

        return success_response(
            message="Dashboard stats loaded successfully.",
            data=data,
        )