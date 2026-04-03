from django.core.exceptions import ValidationError
from django.db import models


class Election(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-starts_at"]

    def __str__(self) -> str:
        return self.name


class Position(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name="positions")
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    display_order = models.PositiveSmallIntegerField(default=1)
    max_selections = models.PositiveSmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["election", "display_order", "title"]
        unique_together = ("election", "title")

    def __str__(self) -> str:
        return f"{self.election.name} - {self.title}"


class Candidate(models.Model):
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name="candidates")
    full_name = models.CharField(max_length=150)
    manifesto = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["position", "full_name"]
        unique_together = ("position", "full_name")

    def __str__(self) -> str:
        return f"{self.full_name} ({self.position.title})"


class Vote(models.Model):
    student = models.ForeignKey("accounts.Student", on_delete=models.CASCADE, related_name="votes")
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name="votes")
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name="votes")
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="votes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "election", "position"],
                name="unique_student_vote_per_position",
            )
        ]
        ordering = ["-created_at"]

    def clean(self) -> None:
        if self.position_id and self.election_id and self.position.election_id != self.election_id:
            raise ValidationError({"position": "Selected position does not belong to the selected election."})
        if self.candidate_id and self.position_id and self.candidate.position_id != self.position_id:
            raise ValidationError({"candidate": "Selected candidate does not belong to the selected position."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return (
            f"Vote(student={self.student.student_id}, election={self.election.name}, "
            f"position={self.position.title}, candidate={self.candidate.full_name})"
        )
