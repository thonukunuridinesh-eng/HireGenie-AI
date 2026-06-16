from rest_framework import serializers

from apps.resumes.models import ATSReport, Resume


class ATSReportSerializer(serializers.ModelSerializer):
    score = serializers.IntegerField(source="ats_score", read_only=True)
    ai_summary = serializers.CharField(source="summary", read_only=True)

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
    pdf_file = serializers.FileField(source="file", read_only=True)
    extracted_text = serializers.CharField(source="raw_text", read_only=True)
    parsed_skills = serializers.SerializerMethodField()
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
            "pdf_file",
            "extracted_text",
            "parsed_skills",
            "status",
            "ats_report",
            "created_at",
            "updated_at",
        ]

    def get_parsed_skills(self, obj):
        report = getattr(obj, "ats_report", None)
        return report.extracted_skills if report else []


class ResumeUploadSerializer(serializers.ModelSerializer):
    pdf_file = serializers.FileField(write_only=True)
    target_role = serializers.CharField(
        max_length=120,
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = Resume
        fields = ["title", "pdf_file", "target_role"]

    def validate_pdf_file(self, value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Only PDF files are allowed.")

        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("PDF size must be less than 5 MB.")

        return value

    def create(self, validated_data):
        pdf_file = validated_data.pop("pdf_file")
        return Resume.objects.create(file=pdf_file, **validated_data)
