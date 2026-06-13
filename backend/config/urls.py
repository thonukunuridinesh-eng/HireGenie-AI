from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),

    # Core APIs
    path("api/", include("apps.core.urls")),

    # Auth APIs
    path("api/auth/", include("apps.accounts.urls")),

    # Feature APIs
    path("api/", include("apps.resumes.urls")),
    path("api/", include("apps.interviews.urls")),
    path("api/", include("apps.coding.urls")),
    path("api/", include("apps.aptitude.urls")),
    path("api/", include("apps.roadmaps.urls")),
    path("api/", include("apps.jobs.urls")),
    path("api/", include("apps.certificates.urls")),
    path("api/", include("apps.activities.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)