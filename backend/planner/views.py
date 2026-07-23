from rest_framework import generics

from .models import Entry, MonthlyGoal
from .serializers import EntrySerializer, MonthlyGoalSerializer


class EntryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer


class EntryRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer


class MonthlyGoalListCreateAPIView(
    generics.ListCreateAPIView
):
    queryset = MonthlyGoal.objects.all()
    serializer_class = MonthlyGoalSerializer


class MonthlyGoalRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = MonthlyGoal.objects.all()
    serializer_class = MonthlyGoalSerializer