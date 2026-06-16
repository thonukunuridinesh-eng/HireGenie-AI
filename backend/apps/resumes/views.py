from django.http import HttpResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated

from apps.core.utils import error_response, log_activity, success_response
from apps.resumes.models import ATSReport, Resume
from apps.resumes.serializers import ResumeSerializer, ResumeUploadSerializer
from apps.resumes.services import (
    calculate_ats_score,
    extract_pdf_text,
    generate_ats_pdf_bytes,
    get_ai_resume_suggestions,
)


class ResumeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by("-created_at")

    def get_serializer_class(self):
        if self.action == "create":
            return ResumeUploadSerializer
        return ResumeSerializer

    def perform_create(self, serializer):
        resume = serializer.save(user=self.request.user, status="uploaded")

        log_activity(
            user=self.request.user,
            module="resume",
            action="Resume uploaded",
            description=f"{resume.title} uploaded successfully.",
            metadata={"resume_id": resume.id},
        )

    @action(detail=True, methods=["post"])
    def analyze(self, request, pk=None):
        resume = self.get_object()

        resume.status = "parsing"
        resume.save(update_fields=["status"])

        try:
            extracted_text = extract_pdf_text(resume.file.path)
            resume.raw_text = extracted_text

            ats_data = calculate_ats_score(
                resume_text=extracted_text,
                target_role=resume.target_role,
            )

            suggestions = get_ai_resume_suggestions(
                resume_text=extracted_text,
                target_role=resume.target_role,
                ats_data=ats_data,
            )

            report, _ = ATSReport.objects.update_or_create(
                resume=resume,
                defaults={
                    "ats_score": ats_data["score"],
                    "extracted_skills": ats_data["matched_keywords"],
                    "matched_keywords": ats_data["matched_keywords"],
                    "missing_keywords": ats_data["missing_keywords"],
                    "strengths": ats_data["strengths"],
                    "weaknesses": ats_data["weaknesses"],
                    "suggestions": suggestions,
                    "summary": f"Resume scored {ats_data['score']} out of 100.",
                },
            )

            resume.ai_score = ats_data["score"]
            resume.ai_feedback = suggestions
            resume.status = "parsed"
            resume.save(
                update_fields=[
                    "raw_text",
                    "ai_score",
                    "ai_feedback",
                    "status",
                    "updated_at",
                ]
            )
        except Exception as exc:
            resume.status = "failed"
            resume.save(update_fields=["status", "updated_at"])
            return error_response(
                message="Resume analysis failed.",
                errors={"detail": str(exc)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        log_activity(
            user=request.user,
            module="resume",
            action="Resume analyzed",
            description=f"ATS score generated: {report.ats_score}/100",
            metadata={"resume_id": resume.id, "score": report.ats_score},
        )

        return success_response(
            message="Resume analyzed successfully.",
            data=ResumeSerializer(resume).data,
            status_code=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"])
    def download_report(self, request, pk=None):
        resume = self.get_object()

        if not hasattr(resume, "ats_report"):
            return HttpResponse(
                "ATS report not found. Analyze resume first.",
                status=404,
            )

        pdf_bytes = generate_ats_pdf_bytes(resume.ats_report)

        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="{resume.title}-ats-report.pdf"'
        )

        return response
