from django.urls import path

from .views import (
    ActiveElectionPositionsView,
    ActiveElectionView,
    CandidateCreateView,
    CastVoteView,
    ElectionCreateView,
    ElectionResultsView,
    PositionCandidatesView,
    PositionCreateView,
    VotingHealthView,
)

urlpatterns = [
    path("health/", VotingHealthView.as_view(), name="voting-health"),
    path("elections/active/", ActiveElectionView.as_view(), name="active-election"),
    path("elections/active/positions/", ActiveElectionPositionsView.as_view(), name="active-election-positions"),
    path("elections/create/", ElectionCreateView.as_view(), name="election-create"),
    path("positions/create/", PositionCreateView.as_view(), name="position-create"),
    path("positions/<int:position_id>/candidates/", PositionCandidatesView.as_view(), name="position-candidates"),
    path("candidates/create/", CandidateCreateView.as_view(), name="candidate-create"),
    path("votes/cast/", CastVoteView.as_view(), name="vote-cast"),
    path("results/", ElectionResultsView.as_view(), name="election-results"),
]
