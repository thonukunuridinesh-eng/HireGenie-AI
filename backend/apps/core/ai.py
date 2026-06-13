import json
import re

from django.conf import settings


class AIClient:
    @staticmethod
    def generate_text(prompt, fallback_text="AI response is not available right now."):
        provider = settings.AI_PROVIDER.lower()

        if provider == "gemini" and settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai

                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)

                return response.text.strip()
            except Exception as error:
                return f"{fallback_text}\n\nAI Error: {str(error)}"

        if provider == "openai" and settings.OPENAI_API_KEY:
            try:
                from openai import OpenAI

                client = OpenAI(api_key=settings.OPENAI_API_KEY)

                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are HireGenie AI, a helpful career assistant.",
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        },
                    ],
                    temperature=0.7,
                )

                return response.choices[0].message.content.strip()
            except Exception as error:
                return f"{fallback_text}\n\nAI Error: {str(error)}"

        return fallback_text

    @staticmethod
    def generate_json(prompt, fallback_data):
        text = AIClient.generate_text(
            prompt=prompt,
            fallback_text=json.dumps(fallback_data),
        )

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        try:
            json_match = re.search(r"\{.*\}", text, flags=re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except Exception:
            pass

        return fallback_data
    # Backward compatibility alias
# Some old files import AIService, so we map it to AIClient.
AIService = AIClient