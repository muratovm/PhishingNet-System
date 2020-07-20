from django.shortcuts import render
from django.views import generic

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from rest_framework.views import APIView
from .models import Encounter
from .serializers import *
import json


class EncounterUpload(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        serializer = EncounterSerializer(data=request.data)
        if serializer.is_valid():
            encounter = Encounter(**serializer.validated_data)
            encounter.save()
            print(request.data)
            scores_data = request.data.pop('scores')
            print(scores_data)
            scores_data = json.loads(scores_data[0])
            print(scores_data)
            
            for score_data in scores_data:
                score_type = score_data.pop('type')
                print("-------------------------------------------")
                print(score_type)
                print("-------------------------------------------")
                score_category = ScoreCategory.objects.get(name=score_type)
                Score.objects.create(encounter=encounter,score_type=score_category, **score_data)
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# Create your views here.
@api_view(['GET', 'POST'])
def encounters(request):
    parser_classes = (MultiPartParser, FormParser)
    print(request.data)

    if request.method == 'GET':
        data = Encounter.objects.all()

        serializer = EncounterSerializer(data, context={'request': request}, many=True)
        print(serializer.data)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        print(request.data)
        serializer = EncounterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        