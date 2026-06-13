from rest_framework.routers import DefaultRouter
from apps.activities.views import ActivityLogViewSet

router = DefaultRouter()
router.register("activities", ActivityLogViewSet, basename="activities")

urlpatterns = router.urls
