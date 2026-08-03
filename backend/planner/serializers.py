from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Entry, MonthlyGoal, TrainingGuide


class EntrySerializer(serializers.ModelSerializer):
    planType = serializers.CharField(
        source="plan_type",
        required=False,
        allow_blank=True,
    )

    planDistance = serializers.DecimalField(
        source="plan_distance",
        max_digits=6,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    resultType = serializers.CharField(
        source="result_type",
        required=False,
        allow_blank=True,
    )

    resultDistance = serializers.DecimalField(
        source="result_distance",
        max_digits=6,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    createdAt = serializers.DateTimeField(
        source="created_at",
        read_only=True,
    )

    updatedAt = serializers.DateTimeField(
        source="updated_at",
        read_only=True,
    )

    class Meta:
        model = Entry
        fields = [
            "id",
            "user",
            "date",
            "planType",
            "planDistance",
            "resultType",
            "resultDistance",
            "completed",
            "reflection",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = [
            "id",
            "user",
            "createdAt",
            "updatedAt",
        ]


class MonthlyGoalSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(
        source="created_at",
        read_only=True,
    )

    updatedAt = serializers.DateTimeField(
        source="updated_at",
        read_only=True,
    )

    class Meta:
        model = MonthlyGoal
        fields = [
            "id",
            "user",
            "month",
            "distance",
            "runs",
            "focus",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = [
            "id",
            "user",
            "createdAt",
            "updatedAt",
        ]


class TrainingGuideSerializer(serializers.ModelSerializer):
    trainingGoal = serializers.CharField(
        source="training_goal",
    )

    goalDate = serializers.DateField(
        source="goal_date",
    )

    targetTime = serializers.CharField(
        source="target_time",
    )

    longestRun = serializers.DecimalField(
        source="longest_run",
        max_digits=6,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    weeklyDistance = serializers.DecimalField(
        source="weekly_distance",
        max_digits=6,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    pb5k = serializers.CharField(
        source="pb_5k",
        required=False,
        allow_blank=True,
    )

    pb10k = serializers.CharField(
        source="pb_10k",
        required=False,
        allow_blank=True,
    )

    pbHalfMarathon = serializers.CharField(
        source="pb_half_marathon",
        required=False,
        allow_blank=True,
    )

    pbMarathon = serializers.CharField(
        source="pb_marathon",
        required=False,
        allow_blank=True,
    )

    guideContent = serializers.JSONField(
        source="guide_content",
        read_only=True,
    )

    createdAt = serializers.DateTimeField(
        source="created_at",
        read_only=True,
    )

    updatedAt = serializers.DateTimeField(
        source="updated_at",
        read_only=True,
    )

    class Meta:
        model = TrainingGuide
        fields = [
            "id",
            "user",
            "trainingGoal",
            "goalDate",
            "targetTime",
            "longestRun",
            "weeklyDistance",
            "pb5k",
            "pb10k",
            "pbHalfMarathon",
            "pbMarathon",
            "guideContent",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = [
            "id",
            "user",
            "guideContent",
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