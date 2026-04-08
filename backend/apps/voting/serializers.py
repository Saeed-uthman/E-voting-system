from django.db.models import Count
from django.utils import timezone
from rest_framework import serializers
from apps.elections.models import Election, Position, Candidate
from .models import Vote


class VoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'election', 'position', 'candidate', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        request = self.context.get('request')
        student = getattr(request, 'student', None)
        if not student:
            raise serializers.ValidationError('Authenticated student is required.')

        election = attrs['election']
        position = attrs['position']
        candidate = attrs['candidate']

        now = timezone.now()
        if not election.is_active or election.start_date > now or election.end_date < now:
            raise serializers.ValidationError('Election is not active for voting.')

        if position.election_id != election.id:
            raise serializers.ValidationError('Selected position does not belong to the election.')

        if candidate.position_id != position.id:
            raise serializers.ValidationError('Selected candidate does not belong to the position.')

        if Vote.objects.filter(student=student, position=position).exists():
            raise serializers.ValidationError('You have already voted for this position.')

        attrs['student'] = student
        return attrs


class ResultSerializer(serializers.Serializer):
    position_id = serializers.IntegerField()
    position_name = serializers.CharField()
    candidates = serializers.ListField()


class ActiveElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = ['id', 'title', 'start_date', 'end_date', 'is_active']


class BallotCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ['id', 'full_name', 'manifesto', 'image_url', 'position']


class BallotPositionSerializer(serializers.ModelSerializer):
    candidates = BallotCandidateSerializer(many=True, read_only=True)

    class Meta:
        model = Position
        fields = ['id', 'name', 'description', 'election', 'candidates']


def compute_results(election_id):
    positions = Position.objects.filter(election_id=election_id).prefetch_related('candidates')
    output = []
    for position in positions:
        candidate_counts = (
            Vote.objects.filter(position=position)
            .values('candidate__id', 'candidate__full_name')
            .annotate(total_votes=Count('id'))
            .order_by('-total_votes', 'candidate__full_name')
        )
        output.append({
            'position_id': position.id,
            'position_name': position.name,
            'candidates': list(candidate_counts),
        })
    return output
