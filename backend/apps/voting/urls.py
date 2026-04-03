from django.urls import path
from .views import ActiveElectionView, BallotView, VoteCreateView, StudentVoteStatusView, ResultsView

urlpatterns = [
    path('active-election/', ActiveElectionView.as_view(), name='active-election'),
    path('ballot/', BallotView.as_view(), name='ballot'),
    path('submit/', VoteCreateView.as_view(), name='submit-vote'),
    path('status/', StudentVoteStatusView.as_view(), name='vote-status'),
    path('results/', ResultsView.as_view(), name='results'),
]
