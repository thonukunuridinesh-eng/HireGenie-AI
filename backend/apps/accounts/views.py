from django.conf import settings
from django.contrib.auth import get_user_model
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import Profile
from apps.accounts.serializers import (
    LoginSerializer,
    ProfileSerializer,
    RegisterSerializer,
    UserSerializer,
)
from apps.core.utils import error_response, success_response

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return success_response(
                message="Account created successfully.",
                data={
                    "user": UserSerializer(user).data,
                    "profile": ProfileSerializer(user.profile).data,
                    "tokens": tokens,
                },
                status_code=status.HTTP_201_CREATED,
            )
        return error_response(
            message="Registration failed.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            tokens = get_tokens_for_user(user)
            return success_response(
                message="Login successful.",
                data={
                    "user": UserSerializer(user).data,
                    "profile": ProfileSerializer(user.profile).data,
                    "tokens": tokens,
                },
            )
        return error_response(
            message="Login failed.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        google_token = request.data.get("id_token")
        if not google_token:
            return error_response(message="Google ID token is required.", status_code=status.HTTP_400_BAD_REQUEST)
        if not settings.GOOGLE_CLIENT_ID:
            return error_response(message="GOOGLE_CLIENT_ID not configured.", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            token_info = id_token.verify_oauth2_token(google_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
            email = token_info.get("email")
            if not email:
                return error_response(message="Google account email not found.", status_code=status.HTTP_400_BAD_REQUEST)
            user, _ = User.objects.get_or_create(
                email=email,
                defaults={"username": email.split("@")[0]},
            )
            tokens = get_tokens_for_user(user)
            return success_response(
                message="Google login successful.",
                data={
                    "user": UserSerializer(user).data,
                    "profile": ProfileSerializer(user.profile).data,
                    "tokens": tokens,
                },
            )
        except ValueError:
            return error_response(message="Invalid Google token.", status_code=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(message="Profile retrieved successfully.", data=serializer.data)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(message="Profile updated successfully.", data=serializer.data)
        return error_response(message="Profile update failed.", errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return error_response(message="Refresh token is required.", status_code=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return success_response(message="Logged out successfully.")
        except Exception:
            return error_response(message="Invalid refresh token.", status_code=status.HTTP_400_BAD_REQUEST)
