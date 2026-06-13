from rest_framework.routers import DefaultRouter
from apps.interviews.views import InterviewSessionViewSet

router = DefaultRouter()
router.register("interviews", InterviewSessionViewSet, basename="interviews")

urlpatterns = router.urls
