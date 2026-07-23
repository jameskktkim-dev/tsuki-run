from django.urls import path

from .views import (
    EntryListCreateAPIView,
    EntryRetrieveUpdateDestroyAPIView,
    MonthlyGoalListCreateAPIView,
    MonthlyGoalRetrieveUpdateDestroyAPIView,
)

urlpatterns = [
    path(
        "entries/",
        EntryListCreateAPIView.as_view(),
        name="entry-list-create",
    ),
    path(
        "entries/<int:pk>/",
        EntryRetrieveUpdateDestroyAPIView.as_view(),
        name="entry-detail",
    ),
    path(
        "monthly-goals/",
        MonthlyGoalListCreateAPIView.as_view(),
        name="monthly-goal-list-create",
    ),
    path(
        "monthly-goals/<int:pk>/",
        MonthlyGoalRetrieveUpdateDestroyAPIView.as_view(),
        name="monthly-goal-detail",
    ),
]