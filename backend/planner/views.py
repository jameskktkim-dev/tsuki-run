from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Entry, MonthlyGoal
from .serializers import (
    EntrySerializer,
    MonthlyGoalSerializer,
    RegisterSerializer,
)


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class EntryListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Entry.objects.filter(
            user=self.request.user
        ).order_by("date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EntryRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Entry.objects.filter(
            user=self.request.user
        )


class MonthlyGoalListCreateAPIView(
    generics.ListCreateAPIView
):
    serializer_class = MonthlyGoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MonthlyGoal.objects.filter(
            user=self.request.user
        ).order_by("month")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MonthlyGoalRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = MonthlyGoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MonthlyGoal.objects.filter(
            user=self.request.user
        )