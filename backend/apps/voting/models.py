from django.db import models
from apps.accounts.models import Student
from apps.elections.models import Election, Position, Candidate


class Vote(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='votes')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='votes')
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='votes')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='votes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student', 'position'], name='unique_student_position_vote'),
        ]

    def __str__(self):
        return f"{self.student.reg_no} voted for {self.candidate.full_name}"
