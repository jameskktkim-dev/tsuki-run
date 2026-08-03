from rest_framework import status
from rest_framework.response import Response

from .services import generate_training_guide
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import (
    Entry,
    MonthlyGoal,
    TrainingGuide,
)

from .serializers import (
    EntrySerializer,
    MonthlyGoalSerializer,
    RegisterSerializer,
    TrainingGuideSerializer,
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

class TrainingGuideListCreateAPIView(
    generics.ListCreateAPIView
):
    serializer_class = TrainingGuideSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrainingGuide.objects.filter(
            user=self.request.user
        ).order_by("-updated_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TrainingGuideRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = TrainingGuideSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrainingGuide.objects.filter(
            user=self.request.user
        )

    
class GenerateTrainingGuideAPIView(
    generics.GenericAPIView
):
    serializer_class = TrainingGuideSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        guide = serializer.save(
            user=request.user
        )

        guide.guide_content = {
            "content": generate_training_guide(
                guide
            )
        }

        guide.save()

        return Response(
            TrainingGuideSerializer(guide).data,
            status=status.HTTP_201_CREATED,
        )