from django.utils import timezone
from rest_framework import serializers
from .models import Election, Position, Candidate


class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = '__all__'

    def validate(self, attrs):
        start = attrs.get('start_date', getattr(self.instance, 'start_date', None))
        end = attrs.get('end_date', getattr(self.instance, 'end_date', None))
        if start and end and end <= start:
            raise serializers.ValidationError('End date must be after start date.')
        return attrs


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = '__all__'


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'

    def validate_position(self, value):
        election = value.election
        if election.end_date < timezone.now():
            raise serializers.ValidationError('Cannot add candidates to a closed election.')
        return value
