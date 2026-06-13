from rest_framework import serializers

from apps.resumes.models import ATSReport, Resume


class ATSReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ATSReport
        fields = [
            "id",
            "score",
            "matched_keywords",
            "missing_keywords",
            "strengths",
            "weaknesses",
            "suggestions",
            "ai_summary",
            "created_at",
        ]


class ResumeSerializer(serializers.ModelSerializer):
    ats_report = ATSReportSerializer(read_only=True)

    class Meta:
        model = Resume
        fields = [
            "id",
            "title",
            "pdf_file",
            "extracted_text",
            "parsed_skills",
            "target_role",
            "status",
            "ats_report",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "extracted_text",
            "parsed_skills",
            "status",
            "ats_report",
            "created_at",
            "updated_at",
        ]


class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ["title", "pdf_file", "target_role"]

    def validate_pdf_file(self, value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Only PDF files are allowed.")

        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("PDF size must be less than 5 MB.")

        return value