from django.conf import settings
from django.db import models


class Entry(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='entries',
    )

    date = models.DateField()

    plan_type = models.CharField(
        max_length=50,
        blank=True,
    )

    plan_distance = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
    )

    result_type = models.CharField(
        max_length=50,
        blank=True,
    )

    result_distance = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
    )

    completed = models.BooleanField(
        default=False,
    )

    reflection = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ['date']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'date'],
                name='unique_entry_per_user_date',
            ),
        ]

    def __str__(self):
        return f'{self.user} - {self.date}'


class MonthlyGoal(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='monthly_goals',
    )

    month = models.DateField()

    distance = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        default=0,
    )

    runs = models.PositiveIntegerField(
        default=0,
    )

    focus = models.CharField(
        max_length=200,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ['month']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'month'],
                name='unique_goal_per_user_month',
            ),
        ]

    def __str__(self):
        return f'{self.user} - {self.month:%Y-%m}'