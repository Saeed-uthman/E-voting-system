from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from apps.accounts.permissions import IsAuthenticatedStudent
from apps.elections.models import Election, Position
from .models import Vote
from .serializers import VoteCreateSerializer, BallotPositionSerializer, ActiveElectionSerializer, compute_results


class ActiveElectionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        now = timezone.now()
        election = Election.objects.filter(is_active=True, start_date__lte=now, end_date__gte=now).first()
        if not election:
            return Response({'detail': 'No active election.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ActiveElectionSerializer(election).data)


class BallotView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        election_id = request.query_params.get('election_id')
        if not election_id:
            return Response({'detail': 'election_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        positions = Position.objects.filter(election_id=election_id).prefetch_related('candidates')
        return Response(BallotPositionSerializer(positions, many=True).data)


class VoteCreateView(APIView):
    permission_classes = [IsAuthenticatedStudent]

    def post(self, request):
        serializer = VoteCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        vote = serializer.save()
        return Response({'id': vote.id, 'detail': 'Vote submitted successfully.'}, status=status.HTTP_201_CREATED)


class StudentVoteStatusView(APIView):
    permission_classes = [IsAuthenticatedStudent]

    def get(self, request):
        election_id = request.query_params.get('election_id')
        if not election_id:
            return Response({'detail': 'election_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        votes = Vote.objects.filter(student=request.student, election_id=election_id).values('position_id')
        return Response({'voted_positions': [row['position_id'] for row in votes]})


class ResultsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        election_id = request.query_params.get('election_id')
        if not election_id:
            return Response({'detail': 'election_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'results': compute_results(election_id)})
