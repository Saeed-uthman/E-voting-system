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

    def validate(self, attrs):
        starts_at = attrs.get("starts_at")
        ends_at = attrs.get("ends_at")

        if starts_at and ends_at and ends_at <= starts_at:
            raise serializers.ValidationError({"ends_at": "End time must be later than start time."})

        return attrs


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
    ERROR_MESSAGES = {
        "student_ineligible": "Student is not eligible to vote.",
        "election_inactive": "Election is not active.",
        "position_mismatch": "Position does not belong to the selected election.",
        "candidate_mismatch": "Candidate does not belong to the selected position.",
        "duplicate_vote": "Student has already voted for this position in this election.",
    }

    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    election = serializers.PrimaryKeyRelatedField(queryset=Election.objects.all())
    position = serializers.PrimaryKeyRelatedField(queryset=Position.objects.select_related("election"))
    candidate = serializers.PrimaryKeyRelatedField(queryset=Candidate.objects.select_related("position", "position__election"))

    class Meta:
        model = Vote
        fields = ["id", "student", "election", "position", "candidate", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        student = attrs.get("student")
        election = attrs.get("election")
        position = attrs.get("position")
        candidate = attrs.get("candidate")
        now = timezone.now()

        if not student or not student.is_active:
            raise serializers.ValidationError({"student": self.ERROR_MESSAGES["student_ineligible"]})

        is_active_window = election and election.starts_at <= now <= election.ends_at
        if not election or not election.is_published or not is_active_window:
            raise serializers.ValidationError({"election": self.ERROR_MESSAGES["election_inactive"]})

        if not position or position.election_id != election.id:
            raise serializers.ValidationError({"position": self.ERROR_MESSAGES["position_mismatch"]})

        if not candidate or candidate.position_id != position.id:
            raise serializers.ValidationError({"candidate": self.ERROR_MESSAGES["candidate_mismatch"]})

        already_voted = Vote.objects.filter(student=student, election=election, position=position)

        if self.instance:
            already_voted = already_voted.exclude(pk=self.instance.pk)

        if already_voted.exists():
            raise serializers.ValidationError({"student": self.ERROR_MESSAGES["duplicate_vote"]})

        return attrs
