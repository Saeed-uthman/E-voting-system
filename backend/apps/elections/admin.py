from django.contrib import admin
from .models import Election, Position, Candidate

admin.site.register(Election)
admin.site.register(Position)
admin.site.register(Candidate)
