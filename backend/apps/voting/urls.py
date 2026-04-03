from django.urls import path

from .views import VotingHealthView

urlpatterns = [
    path("health/", VotingHealthView.as_view(), name="voting-health"),
]
