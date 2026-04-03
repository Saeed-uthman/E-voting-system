from django.db.models import Count
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Candidate, Election, Position, Vote
from .serializers import CandidateSerializer, ElectionSerializer, PositionSerializer, VoteSerializer


class VotingHealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"service": "voting", "status": "ok"})


class ActiveElectionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        now = timezone.now()
        election = (
            Election.objects.filter(is_published=True, starts_at__lte=now, ends_at__gte=now)
            .order_by("starts_at")
            .first()
        )

        if not election:
            return Response({"message": "No active election found.", "data": None}, status=status.HTTP_404_NOT_FOUND)

        serializer = ElectionSerializer(election)
        return Response({"message": "Active election retrieved.", "data": serializer.data}, status=status.HTTP_200_OK)


class ActiveElectionPositionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        now = timezone.now()
        election = (
            Election.objects.filter(is_published=True, starts_at__lte=now, ends_at__gte=now)
            .order_by("starts_at")
            .first()
        )
        if not election:
            return Response({"message": "No active election found.", "data": []}, status=status.HTTP_404_NOT_FOUND)

        positions = Position.objects.filter(election=election).order_by("display_order", "title")
        serializer = PositionSerializer(positions, many=True)
        return Response(
            {
                "message": "Positions for active election retrieved.",
                "data": {
                    "election": ElectionSerializer(election).data,
                    "positions": serializer.data,
                },
            },
            status=status.HTTP_200_OK,
        )


class PositionCandidatesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, position_id):
        try:
            position = Position.objects.select_related("election").get(pk=position_id)
        except Position.DoesNotExist:
            return Response({"message": "Position not found.", "data": []}, status=status.HTTP_404_NOT_FOUND)

        candidates = Candidate.objects.filter(position=position).order_by("full_name")
        serializer = CandidateSerializer(candidates, many=True)

        return Response(
            {
                "message": "Candidates retrieved.",
                "data": {
                    "position": PositionSerializer(position).data,
                    "candidates": serializer.data,
                },
            },
            status=status.HTTP_200_OK,
        )


class ElectionCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = ElectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Election created successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class PositionCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = PositionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Position created successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class CandidateCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = CandidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Candidate created successfully.", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class CastVoteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Vote cast successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)


class ElectionResultsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        election_id = request.query_params.get("election_id")

        if election_id:
            election = Election.objects.filter(pk=election_id).first()
        else:
            now = timezone.now()
            election = (
                Election.objects.filter(is_published=True, starts_at__lte=now, ends_at__gte=now)
                .order_by("starts_at")
                .first()
            )

        if not election:
            return Response({"message": "Election not found.", "data": {}}, status=status.HTTP_404_NOT_FOUND)

        positions_payload = []
        positions = Position.objects.filter(election=election).order_by("display_order", "title")
        for position in positions:
            candidate_results = (
                Vote.objects.filter(election=election, position=position)
                .values("candidate", "candidate__full_name")
                .annotate(total_votes=Count("id"))
                .order_by("-total_votes", "candidate__full_name")
            )
            positions_payload.append(
                {
                    "position_id": position.id,
                    "position_title": position.title,
                    "results": list(candidate_results),
                }
            )

        return Response(
            {
                "message": "Election results retrieved.",
                "data": {
                    "election": ElectionSerializer(election).data,
                    "positions": positions_payload,
                },
            },
            status=status.HTTP_200_OK,
        )
