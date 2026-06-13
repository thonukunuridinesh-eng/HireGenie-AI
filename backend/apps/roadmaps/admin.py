from django.contrib import admin
from .models import CareerRoadmap, Milestone, ActionItem

class ActionItemInline(admin.TabularInline):
    model = ActionItem
    extra = 1

class MilestoneInline(admin.StackedInline):
    model = Milestone
    extra = 1

@admin.register(CareerRoadmap)
class CareerRoadmapAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "career_goal", "estimated_months", "is_active", "created_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["user__email", "career_goal"]
    inlines = [MilestoneInline]

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ["id", "roadmap", "order", "title", "is_completed"]
    list_filter = ["is_completed"]
    search_fields = ["title"]
    inlines = [ActionItemInline]
