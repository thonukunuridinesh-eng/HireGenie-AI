from django.contrib import admin

from apps.certificates.models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "certificate_id",
        "user",
        "title",
        "issued_for",
        "score",
        "is_valid",
        "issued_at",
    ]
    list_filter = ["is_valid", "issued_at"]
    search_fields = [
        "certificate_id",
        "user__email",
        "title",
        "issued_for",
    ]
    readonly_fields = ["certificate_id", "issued_at"]