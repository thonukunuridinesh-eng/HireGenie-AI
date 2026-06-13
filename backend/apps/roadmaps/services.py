import json


def build_fallback_roadmap(target_role, current_skills, experience_level, timeline_months):
    return {
        "target_role": target_role,
        "experience_level": experience_level,
        "timeline_months": timeline_months,
        "current_skills": current_skills,
        "roadmap": [
            {
                "phase": "Phase 1",
                "title": "Foundation Skills",
                "duration": "Month 1",
                "topics": [
                    "Python basics",
                    "OOP concepts",
                    "Git and GitHub",
                    "HTML, CSS, JavaScript basics",
                ],
                "projects": [
                    "Portfolio website",
                    "Python mini automation script",
                ],
            },
            {
                "phase": "Phase 2",
                "title": "Backend Development",
                "duration": "Month 2 - Month 3",
                "topics": [
                    "Django",
                    "Django REST Framework",
                    "JWT authentication",
                    "PostgreSQL",
                    "API development",
                ],
                "projects": [
                    "Student Management System",
                    "Resume Analyzer API",
                ],
            },
            {
                "phase": "Phase 3",
                "title": "Frontend Development",
                "duration": "Month 4",
                "topics": [
                    "React.js",
                    "React Router",
                    "Axios",
                    "Tailwind CSS",
                    "Dashboard UI",
                ],
                "projects": [
                    "Career dashboard",
                    "Job listing frontend",
                ],
            },
            {
                "phase": "Phase 4",
                "title": "AI Integration",
                "duration": "Month 5",
                "topics": [
                    "AI prompts",
                    "Resume analysis",
                    "Mock interview feedback",
                    "Career roadmap generation",
                ],
                "projects": [
                    "AI Resume Analyzer",
                    "AI Mock Interview module",
                ],
            },
            {
                "phase": "Phase 5",
                "title": "Deployment and Resume Preparation",
                "duration": "Month 6",
                "topics": [
                    "Docker basics",
                    "Render or Railway deployment",
                    "Vercel frontend deployment",
                    "README documentation",
                    "Demo video preparation",
                ],
                "projects": [
                    "Deploy HireGenie AI",
                    "Create GitHub README with screenshots",
                ],
            },
        ],
        "recommended_certifications": [
            "Python Full Stack Development",
            "Django REST Framework",
            "React.js",
            "PostgreSQL",
            "Git and GitHub",
        ],
        "interview_preparation": [
            "Python interview questions",
            "Django REST API questions",
            "React.js questions",
            "SQL queries",
            "Project explanation practice",
        ],
    }


def generate_career_roadmap(
    target_role=None,
    current_skills=None,
    experience_level="beginner",
    timeline_months=6,
    **kwargs,
):
    target_role = (
        target_role
        or kwargs.get("role")
        or kwargs.get("career_goal")
        or kwargs.get("target_role")
        or "Python Full Stack Developer"
    )

    current_skills = current_skills or kwargs.get("skills") or []

    if isinstance(current_skills, str):
        current_skills = [
            skill.strip()
            for skill in current_skills.split(",")
            if skill.strip()
        ]

    prompt = f"""
You are an expert AI career mentor.

Create a detailed career roadmap for the following student:

Target Role: {target_role}
Current Skills: {", ".join(current_skills) if current_skills else "Beginner"}
Experience Level: {experience_level}
Timeline: {timeline_months} months

Return a practical roadmap with:
1. Monthly learning plan
2. Skills to learn
3. Projects to build
4. Certifications
5. Interview preparation plan
6. GitHub and resume improvement tips
"""

    fallback_data = build_fallback_roadmap(
        target_role=target_role,
        current_skills=current_skills,
        experience_level=experience_level,
        timeline_months=timeline_months,
    )

    try:
        from apps.core.ai import generate_ai_response

        ai_response = generate_ai_response(prompt)

        return {
            "target_role": target_role,
            "experience_level": experience_level,
            "timeline_months": timeline_months,
            "current_skills": current_skills,
            "ai_response": ai_response,
            "fallback_roadmap": fallback_data,
        }

    except Exception:
        return fallback_data