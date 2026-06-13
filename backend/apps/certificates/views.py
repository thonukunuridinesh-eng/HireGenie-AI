import uuid
import logging
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.certificates.models import Certificate
from apps.certificates.serializers import (
    CertificateSerializer,
    GenerateCertificateSerializer,
)
from apps.certificates.services import (
    generate_certificate_pdf,
    generate_certificate_qr,
)
from apps.core.utils import error_response, success_response
from apps.activities.models import ActivityLog

logger = logging.getLogger(__name__)

class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Sorting chronologically by core timestamp attribute field
        return Certificate.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=False, methods=["post"])
    def generate(self, request):
        serializer = GenerateCertificateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Invalid certificate generation parameters.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Generate a unique hash identity string to satisfy model constraints
        verification_hash = str(uuid.uuid4().hex[:12]).upper()

        # Instantiate matching fields mapping to your exact models.py definition
        certificate = Certificate.objects.create(
            user=request.user,
            title=serializer.validated_data["title"],
            certificate_id=f"HG-{verification_hash}"
        )

        # Trigger vector generation services wrappers
        certificate = generate_certificate_qr(certificate)
        certificate = generate_certificate_pdf(certificate)

        ActivityLog.objects.create(
            user=request.user,
            action="certificate_generated",
            description=f"Issued certificate tracking token: {certificate.certificate_id} for completion of '{certificate.title}'.",
            ip_address=request.META.get('REMOTE_ADDR')
        )

        return success_response(
            message="Verifiable credential generated and compiled successfully.",
            data=CertificateSerializer(certificate).data,
            status_code=status.HTTP_201_CREATED,
        )

class VerifyCertificateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, certificate_id):
        try:
            # Query strictly against existing structural database schema attributes
            certificate = Certificate.objects.get(certificate_id=certificate_id)
        except Certificate.DoesNotExist:
            return error_response(
                message="Certificate hash verification lookup failed. Invalid identifier reference.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return success_response(
            message="Certificate identity matched and verified successfully.",
            data=CertificateSerializer(certificate).data,
        )
