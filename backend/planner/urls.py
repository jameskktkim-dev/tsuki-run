from django.urls import path

from .views import (
    EntryListCreateAPIView,
    EntryRetrieveUpdateDestroyAPIView,
    MonthlyGoalListCreateAPIView,
    MonthlyGoalRetrieveUpdateDestroyAPIView,
    RegisterAPIView,
    TrainingGuideListCreateAPIView,
    TrainingGuideRetrieveUpdateDestroyAPIView,
    GenerateTrainingGuideAPIView,
)


urlpatterns = [
    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),
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
    path(
        "training-guides/",
        TrainingGuideListCreateAPIView.as_view(),
        name="training-guide-list-create",
    ),
    path(
        "training-guides/<int:pk>/",
        TrainingGuideRetrieveUpdateDestroyAPIView.as_view(),
        name="training-guide-detail",
    ),
    path(
        "training-guides/generate/",
        GenerateTrainingGuideAPIView.as_view(),
        name="training-guide-generate",
    ),
]