from rest_framework import serializers
from .models import Entry, MonthlyGoal


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = "__all__"


class MonthlyGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyGoal
        fields = "__all__"