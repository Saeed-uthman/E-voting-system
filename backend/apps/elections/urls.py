from django.urls import path
from .views import (
    ElectionListCreateView,
    ElectionDetailView,
    PositionListCreateView,
    PositionDetailView,
    CandidateListCreateView,
    CandidateDetailView,
)

urlpatterns = [
    path('', ElectionListCreateView.as_view(), name='elections-list-create'),
    path('<int:pk>/', ElectionDetailView.as_view(), name='elections-detail'),
    path('positions/', PositionListCreateView.as_view(), name='positions-list-create'),
    path('positions/<int:pk>/', PositionDetailView.as_view(), name='positions-detail'),
    path('candidates/', CandidateListCreateView.as_view(), name='candidates-list-create'),
    path('candidates/<int:pk>/', CandidateDetailView.as_view(), name='candidates-detail'),
]
