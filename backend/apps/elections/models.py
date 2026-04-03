from django.db import models


class Election(models.Model):
    title = models.CharField(max_length=120)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Position(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='positions')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ('election', 'name')

    def __str__(self):
        return f"{self.name} ({self.election.title})"


class Candidate(models.Model):
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='candidates')
    full_name = models.CharField(max_length=120)
    manifesto = models.TextField(blank=True)
    image_url = models.URLField(blank=True)

    class Meta:
        unique_together = ('position', 'full_name')

    def __str__(self):
        return f"{self.full_name} - {self.position.name}"
