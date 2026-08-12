from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.tokens import (
    default_token_generator,
)
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

import resend

from rest_framework import generics, status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response

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

from .services import generate_training_guide

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(
            user
        )

        verify_url = (
            f"{settings.FRONTEND_URL}"
            f"/verify-email"
            f"?uid={uid}&token={token}"
        )

        if not settings.RESEND_API_KEY:
            raise RuntimeError(
                "RESEND_API_KEY is not configured."
            )

        resend.api_key = settings.RESEND_API_KEY

        resend.Emails.send(
            {
                "from": (
                    "Tsuki Run "
                    "<onboarding@resend.dev>"
                ),
                "to": [user.email],
                "subject": (
                    "Verify your Tsuki Run email"
                ),
                "html": f"""
                <div style="
                    font-family: Arial, sans-serif;
                    line-height: 1.7;
                    color: #1f1c1a;
                ">
                    <p>
                        Welcome to Tsuki Run.
                    </p>

                    <p>
                        Please verify your email
                        address to finish creating
                        your account.
                    </p>

                    <p>
                        <a href="{verify_url}">
                            Verify your email
                        </a>
                    </p>

                    <p>
                        If you did not create this
                        account, you can ignore
                        this email.
                    </p>
                </div>
                """,
            }
        )

        return Response(
            {
                "detail": (
                    "Account created. Please check "
                    "your email to verify your account."
                )
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailAPIView(
    generics.GenericAPIView
):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid", "")
        token = request.data.get("token", "")

        if not uid or not token:
            return Response(
                {
                    "detail": (
                        "Missing email verification "
                        "information."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(
                pk=user_id
            )
        except (
            ValueError,
            TypeError,
            OverflowError,
            User.DoesNotExist,
        ):
            return Response(
                {
                    "detail": (
                        "This verification link "
                        "is invalid."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.is_active:
            return Response(
                {
                    "detail": (
                        "Your email is already verified."
                    )
                },
                status=status.HTTP_200_OK,
            )

        if not default_token_generator.check_token(
            user,
            token,
        ):
            return Response(
                {
                    "detail": (
                        "This verification link "
                        "is invalid or has expired."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = True
        user.save(update_fields=["is_active"])

        return Response(
            {
                "detail": (
                    "Your email has been verified."
                )
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetRequestAPIView(
    generics.GenericAPIView
):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (
            request.data.get("email", "")
            .strip()
            .lower()
        )

        if not email:
            return Response(
                {
                    "detail": (
                        "Please enter your email address."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(
            email__iexact=email
        ).first()

        # Always return the same response so callers
        # cannot discover which emails have accounts.
        response_message = {
            "detail": (
                "If an account exists with that email, "
                "a password reset link has been sent."
            )
        }

        if user is None:
            return Response(
                response_message,
                status=status.HTTP_200_OK,
            )

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(
            user
        )

        reset_url = (
            f"{settings.FRONTEND_URL}"
            f"/reset-password"
            f"?uid={uid}&token={token}"
        )

        if not settings.RESEND_API_KEY:
            raise RuntimeError(
                "RESEND_API_KEY is not configured."
            )

        resend.api_key = settings.RESEND_API_KEY

        resend.Emails.send(
            {
                "from": (
                    "Tsuki Run "
                    "<onboarding@resend.dev>"
                ),
                "to": [user.email],
                "subject": (
                    "Reset your Tsuki Run password"
                ),
                "html": f"""
                <div style="
                    font-family: Arial, sans-serif;
                    line-height: 1.7;
                    color: #1f1c1a;
                ">
                    <p>
                        You asked to reset your
                        Tsuki Run password.
                    </p>

                    <p>
                        <a href="{reset_url}">
                            Reset your password
                        </a>
                    </p>

                    <p>
                        If you did not request this,
                        you can ignore this email.
                    </p>
                </div>
                """,
            }
        )

        return Response(
            response_message,
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmAPIView(
    generics.GenericAPIView
):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid", "")
        token = request.data.get("token", "")
        new_password = request.data.get(
            "newPassword",
            "",
        )

        if not uid or not token or not new_password:
            return Response(
                {
                    "detail": (
                        "Missing password reset information."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {
                    "detail": (
                        "Password must be at least "
                        "8 characters."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(
                pk=user_id
            )
        except (
            ValueError,
            TypeError,
            OverflowError,
            User.DoesNotExist,
        ):
            return Response(
                {
                    "detail": (
                        "This password reset link "
                        "is invalid."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(
            user,
            token,
        ):
            return Response(
                {
                    "detail": (
                        "This password reset link "
                        "is invalid or has expired."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {
                "detail": (
                    "Your password has been reset."
                )
            },
            status=status.HTTP_200_OK,
        )


class EntryListCreateAPIView(
    generics.ListCreateAPIView
):
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

        guide.guide_content = (
            generate_training_guide(
                guide
            )
        )

        guide.save()

        return Response(
            TrainingGuideSerializer(
                guide
            ).data,
            status=status.HTTP_201_CREATED,
        )