from io import BytesIO

from PyPDF2 import PdfReader
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from apps.core.ai import AIClient


ROLE_KEYWORDS = {
    "python developer": [
        "python",
        "django",
        "flask",
        "rest api",
        "sql",
        "postgresql",
        "git",
        "oops",
        "data structures",
        "debugging",
    ],
    "python full stack developer": [
        "python",
        "django",
        "django rest framework",
        "react",
        "javascript",
        "postgresql",
        "rest api",
        "jwt",
        "docker",
        "git",
    ],
    "frontend developer": [
        "html",
        "css",
        "javascript",
        "react",
        "tailwind",
        "responsive design",
        "api integration",
        "git",
    ],
    "data analyst": [
        "python",
        "sql",
        "excel",
        "power bi",
        "tableau",
        "pandas",
        "numpy",
        "data visualization",
    ],
}


def extract_pdf_text(file_path):
    text = ""

    try:
        reader = PdfReader(file_path)

        for page in reader.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"

    except Exception:
        text = ""

    return text.strip()


def get_required_keywords(target_role):
    role = (target_role or "").lower().strip()

    if role in ROLE_KEYWORDS:
        return ROLE_KEYWORDS[role]

    return [
        "python",
        "django",
        "react",
        "javascript",
        "postgresql",
        "rest api",
        "git",
        "docker",
        "problem solving",
        "projects",
    ]


def calculate_ats_score(resume_text, target_role):
    text = (resume_text or "").lower()
    required_keywords = get_required_keywords(target_role)

    matched_keywords = [
        keyword for keyword in required_keywords if keyword.lower() in text
    ]

    missing_keywords = [
        keyword for keyword in required_keywords if keyword.lower() not in text
    ]

    keyword_score = int((len(matched_keywords) / len(required_keywords)) * 70)

    sections = ["education", "skills", "projects", "experience", "certifications"]
    found_sections = [section for section in sections if section in text]
    section_score = int((len(found_sections) / len(sections)) * 20)

    bonus_score = 0

    if "github" in text:
        bonus_score += 5

    if "linkedin" in text:
        bonus_score += 5

    final_score = min(keyword_score + section_score + bonus_score, 100)

    strengths = []

    if len(matched_keywords) >= 5:
        strengths.append("Good technical keyword coverage.")

    if "projects" in text:
        strengths.append("Project section is available.")

    if "github" in text:
        strengths.append("GitHub profile is included.")

    weaknesses = []

    if missing_keywords:
        weaknesses.append("Important role-based keywords are missing.")

    if "experience" not in text:
        weaknesses.append("Experience or internship section can be improved.")

    if "certifications" not in text:
        weaknesses.append("Certifications section is missing.")

    return {
        "score": final_score,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "strengths": strengths,
        "weaknesses": weaknesses,
    }


def get_ai_resume_suggestions(resume_text, target_role, ats_data):
    prompt = f"""
You are an expert ATS resume reviewer.

Target Role: {target_role}

ATS Score: {ats_data["score"]}

Matched Keywords:
{ats_data["matched_keywords"]}

Missing Keywords:
{ats_data["missing_keywords"]}

Resume Text:
{resume_text[:4000]}

Give practical resume improvement suggestions for a student.
Use clear bullet points.
Focus on ATS keywords, project descriptions, skills, achievements, and formatting.
"""

    fallback = (
        "1. Add missing role-based keywords naturally in your skills and project sections.\n"
        "2. Add measurable achievements such as percentage improvement, time saved, or users served.\n"
        "3. Improve project descriptions using action words like built, developed, integrated, deployed.\n"
        "4. Add GitHub, LinkedIn, certifications, and internship experience if available.\n"
        "5. Keep the resume clean, one-page, and ATS-friendly."
    )

    return AIClient.generate_text(prompt, fallback)


def generate_ats_pdf_bytes(report):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)

    width, height = A4
    y = height - 60

    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawString(50, y, "HireGenie AI - ATS Resume Report")

    y -= 45

    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, y, f"Resume: {report.resume.title}")

    y -= 25
    pdf.drawString(50, y, f"Target Role: {report.resume.target_role or 'Not provided'}")

    y -= 25
    pdf.drawString(50, y, f"ATS Score: {report.score}/100")

    y -= 40

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Matched Keywords:")

    y -= 22
    pdf.setFont("Helvetica", 11)
    pdf.drawString(70, y, ", ".join(report.matched_keywords) or "No matched keywords")

    y -= 40

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Missing Keywords:")

    y -= 22
    pdf.setFont("Helvetica", 11)
    pdf.drawString(70, y, ", ".join(report.missing_keywords) or "No missing keywords")

    y -= 40

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Suggestions:")

    y -= 25
    pdf.setFont("Helvetica", 10)

    suggestions = report.suggestions.split("\n")

    for line in suggestions:
        if y < 80:
            pdf.showPage()
            y = height - 60
            pdf.setFont("Helvetica", 10)

        pdf.drawString(70, y, line[:100])
        y -= 16

    pdf.showPage()
    pdf.save()

    buffer.seek(0)
    return buffer.getvalue()