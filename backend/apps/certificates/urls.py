from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.certificates.views import CertificateViewSet, VerifyCertificateView

router = DefaultRouter()
router.register("certificates", CertificateViewSet, basename="certificates")

urlpatterns = router.urls + [
    path(
        "certificates/verify/<str:certificate_id>/",
        VerifyCertificateView.as_view(),
        name="verify-certificate",
    ),
]
