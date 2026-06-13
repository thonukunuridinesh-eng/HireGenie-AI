from rest_framework.routers import DefaultRouter
from apps.roadmaps.views import CareerRoadmapViewSet

router = DefaultRouter()
router.register("roadmaps", CareerRoadmapViewSet, basename="roadmaps")

urlpatterns = router.urls
