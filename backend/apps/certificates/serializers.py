from rest_framework import serializers
from .models import Certificate

class CertificateSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    pdf_file = serializers.FileField(source="file", read_only=True)
    issued_at = serializers.DateTimeField(source="created_at", read_only=True)
    issued_for = serializers.CharField(source="title", read_only=True)
    score = serializers.SerializerMethodField()
    is_valid = serializers.BooleanField(default=True, read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "id",
            "certificate_id",
            "full_name",
            "email",
            "title",
            "issued_for",
            "score",
            "qr_code",
            "pdf_file",
            "verification_url",
            "issued_at",
            "is_valid",
            "created_at",
        ]

    def get_full_name(self, obj):
        profile = getattr(obj.user, "profile", None)
        if profile and getattr(profile, "bio", None):
            return profile.bio
        return obj.user.email.split('@')[0]

    def get_score(self, obj):
        return 100  # Default verified passing tier metric representation
    
class GenerateCertificateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200, required=True)
    issued_for = serializers.CharField(max_length=200, required=False, allow_blank=True)
    score = serializers.IntegerField(min_value=0, max_value=100, required=False, default=100)
