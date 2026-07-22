from rest_framework import serializers

from .models import Entry, MonthlyGoal


class EntrySerializer(serializers.ModelSerializer):
    planType = serializers.CharField(
        source="plan_type",
        max_length=50,
        allow_blank=True,
        required=False,
    )

    planDistance = serializers.DecimalField(
        source="plan_distance",
        max_digits=6,
        decimal_places=2,
        allow_null=True,
        required=False,
    )

    resultType = serializers.CharField(
        source="result_type",
        max_length=50,
        allow_blank=True,
        required=False,
    )

    resultDistance = serializers.DecimalField(
        source="result_distance",
        max_digits=6,
        decimal_places=2,
        allow_null=True,
        required=False,
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
            "date",
            "planType",
            "planDistance",
            "resultType",
            "resultDistance",
            "completed",
            "reflection",
            "createdAt",
            "updatedAt",
            "user",
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
            "month",
            "distance",
            "runs",
            "focus",
            "createdAt",
            "updatedAt",
            "user",
        ]