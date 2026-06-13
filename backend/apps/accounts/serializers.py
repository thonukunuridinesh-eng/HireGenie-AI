from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from apps.accounts.models import Profile


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "date_joined",
        ]
        read_only_fields = ["id", "is_staff", "date_joined"]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "email",
            "role",
            "full_name",
            "phone",
            "avatar",
            "headline",
            "bio",
            "location",
            "github_url",
            "linkedin_url",
            "portfolio_url",
            "target_role",
            "skills",
            "experience_level",
            "total_points",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "role",
            "total_points",
            "created_at",
            "updated_at",
        ]


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    target_role = serializers.CharField(
        max_length=120,
        required=False,
        allow_blank=True,
    )

    def validate_email(self, value):
        email = value.lower().strip()

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("This email is already registered.")

        return email

    def create(self, validated_data):
        full_name = validated_data["full_name"].strip()
        email = validated_data["email"]
        password = validated_data["password"]
        target_role = validated_data.get("target_role", "")

        username_base = email.split("@")[0]
        username = username_base
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{username_base}{counter}"
            counter += 1

        name_parts = full_name.split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        profile, _ = Profile.objects.get_or_create(user=user)
        profile.full_name = full_name
        profile.target_role = target_role
        profile.save()

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email").lower().strip()
        password = attrs.get("password")

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        user = authenticate(username=user_obj.username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is disabled.")

        attrs["user"] = user
        return attrs