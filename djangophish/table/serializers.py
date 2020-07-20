from rest_framework import serializers
from .models import Encounter,Score,ScoreCategory
from django import forms
from django.conf import settings



class ScoreSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='score_type.name', default="", allow_blank =True)
    class Meta:
        model = Score
        fields = ('type','score')

class EncounterSerializer(serializers.ModelSerializer):
    scores = ScoreSerializer(source="encounter_scores",many=True,read_only=True)
    #scores = serializers.JSONField()
    dated = serializers.DateField(source="date",format='%m/%d/%Y')

    class Meta:
        model = Encounter
        fields = ('url','sha256','dated','time','scores','image')
    
    def get_queryset(self):
        score = self.request.score
        return Encounter.objects.filter(user=score)

    def create(self,validated_data):
        print("Validated data: " +str(validated_data))
        return encounter
        
