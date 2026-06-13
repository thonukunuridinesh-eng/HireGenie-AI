from rest_framework.routers import DefaultRouter
from apps.coding.views import CodingQuestionViewSet, CodingSubmissionViewSet

router = DefaultRouter()
router.register("coding/questions", CodingQuestionViewSet, basename="coding-questions")
router.register("coding/submissions", CodingSubmissionViewSet, basename="coding-submissions")

urlpatterns = router.urls
