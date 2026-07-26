from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Entry, MonthlyGoal


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = "__all__"
        read_only_fields = [
            "id",
            "user",
            "createdAt",
            "updatedAt",
        ]


class MonthlyGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyGoal
        fields = "__all__"
        read_only_fields = [
            "id",
            "user",
            "createdAt",
            "updatedAt",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            "min_length": (
                "Password must be at least 8 characters."
            ),
        },
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
        ]

    def validate_username(self, value):
        username = value.strip()

        if User.objects.filter(
            username__iexact=username
        ).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        return username

    def validate_email(self, value):
        email = value.strip().lower()

        if User.objects.filter(
            email__iexact=email
        ).exists():
            raise serializers.ValidationError(
                "An account already exists with this email."
            )

        return email

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )