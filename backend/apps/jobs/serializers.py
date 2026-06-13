from rest_framework import serializers

from apps.jobs.models import Application, Job, SavedJob


class JobSerializer(serializers.ModelSerializer):
    match_score = serializers.SerializerMethodField()
    required_skills = serializers.SerializerMethodField()
    apply_url = serializers.SerializerMethodField()
    work_mode_display = serializers.CharField(
        source="get_work_mode_display",
        read_only=True,
    )
    job_type_display = serializers.CharField(
        source="get_job_type_display",
        read_only=True,
    )

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company",
            "location",
            "work_mode",
            "work_mode_display",
            "job_type",
            "job_type_display",
            "required_skills",
            "description",
            "salary_range",
            "apply_url",
            "is_active",
            "match_score",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_required_skills(self, obj):
        skills = obj.required_skills

        if isinstance(skills, list):
            return skills

        if isinstance(skills, str):
            return [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

        return []

    def get_apply_url(self, obj):
        if obj.apply_url:
            return obj.apply_url

        return f"/api/jobs/{obj.id}/apply/"

    def get_match_score(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return 0

        profile = getattr(request.user, "profile", None)
        bio_text = getattr(profile, "bio", "") or ""

        user_keywords = [
            word.lower().strip()
            for word in bio_text.replace(",", " ").split()
            if len(word.strip()) > 2
        ]

        required_skills = [
            skill.lower().strip()
            for skill in self.get_required_skills(obj)
            if skill
        ]

        if not required_skills:
            return 0

        matched = set(user_keywords).intersection(required_skills)

        if not matched:
            return 25

        return min(
            100,
            int((len(matched) / len(required_skills)) * 100) + 25,
        )


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.filter(is_active=True),
        source="job",
        write_only=True,
    )

    class Meta:
        model = SavedJob
        fields = [
            "id",
            "job",
            "job_id",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "job", "created_at", "updated_at"]

    def create(self, validated_data):
        request = self.context.get("request")

        return SavedJob.objects.create(
            user=request.user,
            **validated_data,
        )


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.filter(is_active=True),
        source="job",
        write_only=True,
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "job_id",
            "resume",
            "cover_letter",
            "status",
            "applied_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "job",
            "status",
            "applied_at",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        request = self.context.get("request")

        return Application.objects.create(
            user=request.user,
            status="applied",
            **validated_data,
        )