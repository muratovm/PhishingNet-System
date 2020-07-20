from django.contrib import admin
from .models import Encounter, Score, ScoreCategory

# Register your models here.
admin.site.register(Encounter)
admin.site.register(Score)
admin.site.register(ScoreCategory)