from django.contrib import admin

from .models import Entry, MonthlyGoal


@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'date',
        'plan_type',
        'plan_distance',
        'result_type',
        'result_distance',
        'completed',
    )

    list_filter = (
        'completed',
        'plan_type',
        'result_type',
        'date',
    )

    search_fields = (
        'user__username',
        'reflection',
        'plan_type',
        'result_type',
    )

    ordering = ('-date',)


@admin.register(MonthlyGoal)
class MonthlyGoalAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'month',
        'distance',
        'runs',
        'focus',
    )

    list_filter = ('month',)

    search_fields = (
        'user__username',
        'focus',
    )

    ordering = ('-month',)