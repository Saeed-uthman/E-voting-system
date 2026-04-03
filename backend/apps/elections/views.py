from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Election, Position, Candidate
from .serializers import ElectionSerializer, PositionSerializer, CandidateSerializer


class ElectionListCreateView(APIView):
    def get_permissions(self):
        return [IsAdminUser()] if self.request.method == 'POST' else [AllowAny()]

    def get(self, request):
        elections = Election.objects.all().order_by('-created_at')
        return Response(ElectionSerializer(elections, many=True).data)

    def post(self, request):
        serializer = ElectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ElectionDetailView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        election = Election.objects.filter(pk=pk).first()
        if not election:
            return Response({'detail': 'Election not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ElectionSerializer(election, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        election = Election.objects.filter(pk=pk).first()
        if not election:
            return Response({'detail': 'Election not found.'}, status=status.HTTP_404_NOT_FOUND)
        election.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PositionListCreateView(APIView):
    def get_permissions(self):
        return [IsAdminUser()] if self.request.method == 'POST' else [AllowAny()]

    def get(self, request):
        positions = Position.objects.select_related('election').all().order_by('id')
        election_id = request.query_params.get('election_id')
        if election_id:
            positions = positions.filter(election_id=election_id)
        return Response(PositionSerializer(positions, many=True).data)

    def post(self, request):
        serializer = PositionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PositionDetailView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        position = Position.objects.filter(pk=pk).first()
        if not position:
            return Response({'detail': 'Position not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PositionSerializer(position, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        position = Position.objects.filter(pk=pk).first()
        if not position:
            return Response({'detail': 'Position not found.'}, status=status.HTTP_404_NOT_FOUND)
        position.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateListCreateView(APIView):
    def get_permissions(self):
        return [IsAdminUser()] if self.request.method == 'POST' else [AllowAny()]

    def get(self, request):
        candidates = Candidate.objects.select_related('position', 'position__election').all().order_by('id')
        position_id = request.query_params.get('position_id')
        if position_id:
            candidates = candidates.filter(position_id=position_id)
        return Response(CandidateSerializer(candidates, many=True).data)

    def post(self, request):
        serializer = CandidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CandidateDetailView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        candidate = Candidate.objects.filter(pk=pk).first()
        if not candidate:
            return Response({'detail': 'Candidate not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CandidateSerializer(candidate, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        candidate = Candidate.objects.filter(pk=pk).first()
        if not candidate:
            return Response({'detail': 'Candidate not found.'}, status=status.HTTP_404_NOT_FOUND)
        candidate.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
