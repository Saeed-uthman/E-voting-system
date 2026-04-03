from django.utils import timezone
from rest_framework import serializers

from apps.accounts.models import Student

from .models import Candidate, Election, Position, Vote


class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = [
            "id",
            "name",
            "description",
            "starts_at",
            "ends_at",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = [
            "id",
            "election",
            "title",
            "description",
            "display_order",
            "max_selections",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = [
            "id",
            "position",
            "full_name",
            "manifesto",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class VoteSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    election = serializers.PrimaryKeyRelatedField(queryset=Election.objects.all())
    position = serializers.PrimaryKeyRelatedField(queryset=Position.objects.select_related("election"))
    candidate = serializers.PrimaryKeyRelatedField(queryset=Candidate.objects.select_related("position"))

    class Meta:
        model = Vote
        fields = ["id", "student", "election", "position", "candidate", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        student = attrs["student"]
        election = attrs["election"]
        position = attrs["position"]
        candidate = attrs["candidate"]
        now = timezone.now()

        if not student.is_active:
            raise serializers.ValidationError({"student": "Student is not eligible to vote."})

        if not election.is_published or not (election.starts_at <= now <= election.ends_at):
            raise serializers.ValidationError({"election": "Election is not active."})

        if position.election_id != election.id:
            raise serializers.ValidationError({"position": "Position does not belong to the selected election."})

        if candidate.position_id != position.id:
            raise serializers.ValidationError({"candidate": "Candidate does not belong to the selected position."})

        already_voted = Vote.objects.filter(
            student=student,
            election=election,
            position=position,
        )

        if self.instance:
            already_voted = already_voted.exclude(pk=self.instance.pk)

        if already_voted.exists():
            raise serializers.ValidationError({"student": "Student has already voted for this position."})

        return attrs
