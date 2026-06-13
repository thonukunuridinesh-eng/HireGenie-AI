from django.urls import path

from apps.core.views import DashboardStatsView, HealthCheckView


urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("dashboard/", DashboardStatsView.as_view(), name="dashboard-stats"),
]