from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import models

from apps.aptitude.models import AptitudeQuestion, AptitudeTest
from apps.coding.models import CodingQuestion
from apps.jobs.models import Job


User = get_user_model()


def get_model_field_names(model):
    return {field.name for field in model._meta.fields}


def has_field(model, field_name):
    return field_name in get_model_field_names(model)


def clean_data_for_model(model, data):
    """
    Removes keys that are not present in the model.
    This prevents errors like:
    TypeError: Job() got unexpected keyword argument 'company_name'
    """
    model_fields = get_model_field_names(model)
    cleaned = {}

    for key, value in data.items():
        if key in model_fields:
            cleaned[key] = value

    return cleaned


def convert_value_for_field(model, field_name, value):
    """
    Converts values safely for JSONField.
    Example:
    'Python, Django, React' -> ['Python', 'Django', 'React']
    """
    try:
        field = model._meta.get_field(field_name)

        if isinstance(field, models.JSONField) and isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]

    except Exception:
        pass

    return value


def set_if_field(model, data, field_name, value):
    """
    Add field only if it exists in the model.
    """
    if has_field(model, field_name):
        data[field_name] = convert_value_for_field(model, field_name, value)


class Command(BaseCommand):
    help = "Seed custom demo data for HireGenie AI"

    def handle(self, *args, **kwargs):
        self.seed_coding_questions()
        self.seed_aptitude()
        self.seed_jobs()

        self.stdout.write(
            self.style.SUCCESS("Demo data seeded successfully.")
        )

    def seed_coding_questions(self):
        questions = [
            {
                "title": "Check Prime Number",
                "difficulty": "easy",
                "description": "Write a program to check whether a number is prime.",
                "input_format": "A single integer N.",
                "output_format": "Print Prime if the number is prime, otherwise print Not Prime.",
                "sample_input": "7",
                "sample_output": "Prime",
                "points": 10,
                "constraints": "1 <= N <= 10^5",
                "tags": ["python", "loops", "math"],
                "starter_code": "def is_prime(n):\n    pass",
                "reference_solution": (
                    "def is_prime(n):\n"
                    "    if n <= 1:\n"
                    "        return False\n"
                    "    for i in range(2, int(n ** 0.5) + 1):\n"
                    "        if n % i == 0:\n"
                    "            return False\n"
                    "    return True"
                ),
            },
            {
                "title": "Reverse a String",
                "difficulty": "easy",
                "description": "Write a program to reverse a given string.",
                "input_format": "A single string.",
                "output_format": "Print the reversed string.",
                "sample_input": "hello",
                "sample_output": "olleh",
                "points": 10,
                "constraints": "Length <= 100",
                "tags": ["python", "string"],
                "starter_code": "def reverse_string(text):\n    pass",
                "reference_solution": "def reverse_string(text):\n    return text[::-1]",
            },
            {
                "title": "Find Maximum in List",
                "difficulty": "medium",
                "description": "Find the maximum number from a list of space-separated integers.",
                "input_format": "Space-separated integers.",
                "output_format": "Print the maximum number.",
                "sample_input": "1 5 2 9 3",
                "sample_output": "9",
                "points": 20,
                "constraints": "Array items within signed integer limits.",
                "tags": ["python", "array", "logic"],
                "starter_code": "def find_max(numbers):\n    pass",
                "reference_solution": "def find_max(numbers):\n    return max(numbers)",
            },
        ]

        for item in questions:
            defaults = clean_data_for_model(CodingQuestion, item)

            CodingQuestion.objects.get_or_create(
                title=item["title"],
                defaults=defaults,
            )

        self.stdout.write(
            self.style.SUCCESS("Coding questions seeded.")
        )

    def seed_aptitude(self):
        test_defaults = clean_data_for_model(
            AptitudeTest,
            {
                "duration_minutes": 10,
                "is_active": True,
                "description": "Beginner level aptitude practice test.",
                "total_marks": 2,
            },
        )

        test, _ = AptitudeTest.objects.get_or_create(
            title="Beginner Aptitude Test",
            defaults=test_defaults,
        )

        aptitude_questions = [
            {
                "question_text": "What is 20% of 150?",
                "category": "quantitative",
                "difficulty": "easy",
                "option_a": "20",
                "option_b": "25",
                "option_c": "30",
                "option_d": "35",
                "correct_option": "C",
                "marks": 1,
                "test": test,
            },
            {
                "question_text": "Find the next number: 2, 4, 8, 16, ?",
                "category": "logical",
                "difficulty": "easy",
                "option_a": "18",
                "option_b": "20",
                "option_c": "24",
                "option_d": "32",
                "correct_option": "D",
                "marks": 1,
                "test": test,
            },
            {
                "question_text": "If A is the brother of B and B is the sister of C, how is A related to C?",
                "category": "logical",
                "difficulty": "easy",
                "option_a": "Brother",
                "option_b": "Sister",
                "option_c": "Father",
                "option_d": "Mother",
                "correct_option": "A",
                "marks": 1,
                "test": test,
            },
        ]

        for item in aptitude_questions:
            defaults = clean_data_for_model(AptitudeQuestion, item)

            AptitudeQuestion.objects.get_or_create(
                question_text=item["question_text"],
                defaults=defaults,
            )

        self.stdout.write(
            self.style.SUCCESS("Aptitude questions seeded.")
        )

    def get_or_create_recruiter(self):
        recruiter_email = "recruiter@example.com"

        user_defaults = {}

        if has_field(User, "is_staff"):
            user_defaults["is_staff"] = True

        if has_field(User, "is_active"):
            user_defaults["is_active"] = True

        if has_field(User, "role"):
            user_defaults["role"] = "recruiter"

        if has_field(User, "username"):
            user_defaults["username"] = "demo_recruiter"

        if has_field(User, "first_name"):
            user_defaults["first_name"] = "Demo"

        if has_field(User, "last_name"):
            user_defaults["last_name"] = "Recruiter"

        if has_field(User, "email"):
            recruiter, created = User.objects.get_or_create(
                email=recruiter_email,
                defaults=user_defaults,
            )
        else:
            recruiter, created = User.objects.get_or_create(
                username="demo_recruiter",
                defaults=user_defaults,
            )

        if created:
            recruiter.set_password("Recruiter@123")
            recruiter.save()

        return recruiter

    def seed_jobs(self):
        recruiter = self.get_or_create_recruiter()

        jobs = [
            {
                "title": "Python Developer Intern",
                "company": "TechNova Solutions",
                "location": "Remote",
                "work_mode": "remote",
                "job_type": "internship",
                "skills": "Python, Django, REST API, Git",
                "description": "Work on Django APIs and backend features.",
                "salary_range": "INR 10,000 - 20,000/month",
            },
            {
                "title": "React Frontend Intern",
                "company": "PixelCraft Labs",
                "location": "Hyderabad",
                "work_mode": "hybrid",
                "job_type": "internship",
                "skills": "React, JavaScript, Tailwind, API Integration",
                "description": "Build modern responsive frontend pages.",
                "salary_range": "INR 8,000 - 18,000/month",
            },
            {
                "title": "Full Stack Developer Trainee",
                "company": "CloudBridge AI",
                "location": "Bengaluru",
                "work_mode": "on_site",
                "job_type": "full_time",
                "skills": "Python, Django, React, PostgreSQL",
                "description": "Build full-stack SaaS features with Django and React.",
                "salary_range": "INR 3 LPA - 5 LPA",
            },
        ]

        for item in jobs:
            job_data = {}

            set_if_field(Job, job_data, "title", item["title"])

            # Supports both company and company_name field names
            set_if_field(Job, job_data, "company", item["company"])
            set_if_field(Job, job_data, "company_name", item["company"])

            set_if_field(Job, job_data, "location", item["location"])

            # Supports both work_mode and location_type field names
            set_if_field(Job, job_data, "work_mode", item["work_mode"])
            set_if_field(Job, job_data, "location_type", item["work_mode"])

            set_if_field(Job, job_data, "job_type", item["job_type"])

            # Supports both required_skills and requirements field names
            set_if_field(Job, job_data, "required_skills", item["skills"])
            set_if_field(Job, job_data, "requirements", item["skills"])

            set_if_field(Job, job_data, "description", item["description"])
            set_if_field(Job, job_data, "salary_range", item["salary_range"])
            set_if_field(Job, job_data, "is_active", True)
            set_if_field(Job, job_data, "recruiter", recruiter)

            lookup = {"title": item["title"]}

            if has_field(Job, "company"):
                lookup["company"] = item["company"]

            if has_field(Job, "company_name"):
                lookup["company_name"] = item["company"]

            defaults = clean_data_for_model(Job, job_data)

            Job.objects.get_or_create(
                **lookup,
                defaults=defaults,
            )

        self.stdout.write(
            self.style.SUCCESS("Jobs seeded.")
        )