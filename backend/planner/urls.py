from django.urls import path

from .views import (
    EntryListCreateAPIView,
    EntryRetrieveUpdateDestroyAPIView,
    MonthlyGoalListCreateAPIView,
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
]