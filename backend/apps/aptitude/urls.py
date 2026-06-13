from rest_framework.routers import DefaultRouter
from apps.aptitude.views import (
    AptitudeQuestionViewSet,
    AptitudeResultViewSet,
    AptitudeTestViewSet,
)

router = DefaultRouter()
router.register("aptitude/questions", AptitudeQuestionViewSet, basename="aptitude-questions")
router.register("aptitude/tests", AptitudeTestViewSet, basename="aptitude-tests")
router.register("aptitude/results", AptitudeResultViewSet, basename="aptitude-results")

urlpatterns = router.urls
