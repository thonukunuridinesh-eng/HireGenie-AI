import logging
from io import BytesIO
import qrcode
from django.conf import settings
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas

logger = logging.getLogger(__name__)

def generate_certificate_qr(certificate):
    """
    Generates a verification QR code pointing toward the public validation URL.
    """
    # Safely grab the frontend link or fallback to a standard local link map
    frontend_domain = getattr(settings, "FRONTEND_URL", "http://localhost:3000").rstrip("/")
    verification_url = f"{frontend_domain}/verify-certificate/{certificate.certificate_id}"

    qr_image = qrcode.make(verification_url)

    buffer = BytesIO()
    qr_image.save(buffer, format="PNG")

    certificate.qr_code.save(
        f"{certificate.certificate_id}.png",
        ContentFile(buffer.getvalue()),
        save=False,
    )

    certificate.verification_url = verification_url
    certificate.save()
    return certificate

def generate_certificate_pdf(certificate):
    """
    Renders a landscape A4 vector certificate document containing candidate statistics.
    """
    try:
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=landscape(A4))
        width, height = landscape(A4)

        # Drawing Title block
        pdf.setFont("Helvetica-Bold", 30)
        pdf.drawCentredString(width / 2, height - 100, "Certificate of Achievement")

        pdf.setFont("Helvetica", 16)
        pdf.drawCentredString(width / 2, height - 150, "This certificate is proudly presented to")

        # Pull candidate info out of account details or fallback to profile strings
        profile = getattr(certificate.user, "profile", None)
        full_name = getattr(profile, "bio", certificate.user.email.split('@')[0]) or certificate.user.email.split('@')[0]
        pdf.setFont("Helvetica-Bold", 26)
        pdf.drawCentredString(width / 2, height - 205, str(full_name))

        pdf.setFont("Helvetica", 15)
        pdf.drawCentredString(width / 2, height - 255, "For successfully completing")

        # Map to 'title' attribute defined in your database model schema
        pdf.setFont("Helvetica-Bold", 20)
        pdf.drawCentredString(width / 2, height - 295, certificate.title)

        pdf.setFont("Helvetica", 14)
        pdf.drawCentredString(width / 2, height - 340, "Evaluation Level: Verified Performance")

        # Verification footprints at footer left
        pdf.setFont("Helvetica", 11)
        pdf.drawString(70, 80, f"Certificate ID: {certificate.certificate_id}")
        pdf.drawString(70, 60, f"Verification: {certificate.verification_url or 'Verified'}")

        # Signature markings at footer right
        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawRightString(width - 80, 80, "HireGenie AI")
        pdf.setFont("Helvetica", 11)
        pdf.drawRightString(width - 80, 60, "AI Career Assistant Platform")

        pdf.showPage()
        pdf.save()

        buffer.seek(0)

        # Map to 'file' property defined inside certificates/models.py
        certificate.file.save(
            f"{certificate.certificate_id}.pdf",
            ContentFile(buffer.getvalue()),
            save=True,
        )
        return certificate

    except Exception as e:
        logger.error(f"Failed to compile reportlab canvas document: {str(e)}")
        return certificate
