from django.contrib import admin

from .models import Candidate, Election, Position, Vote


@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):
    list_display = ("name", "starts_at", "ends_at", "is_published")
    list_filter = ("is_published",)
    search_fields = ("name",)
    ordering = ("-starts_at",)


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ("title", "election", "display_order", "max_selections")
    list_filter = ("election",)
    search_fields = ("title", "election__name")
    ordering = ("election", "display_order")


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ("full_name", "position", "position_election")
    list_filter = ("position__election", "position")
    search_fields = ("full_name", "position__title", "position__election__name")

    @staticmethod
    def position_election(obj):
        return obj.position.election.name


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("student", "election", "position", "candidate", "created_at")
    list_filter = ("election", "position")
    search_fields = ("student__student_id", "student__first_name", "student__last_name", "candidate__full_name")
    ordering = ("-created_at",)
