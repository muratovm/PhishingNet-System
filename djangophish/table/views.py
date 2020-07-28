from django.shortcuts import render
from django.views import generic

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status


from rest_framework.decorators import api_view
from rest_framework.decorators import authentication_classes
from rest_framework.decorators import permission_classes

from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from table.permissions import IsOwnerOrReadOnly

from rest_framework.views import APIView
from .models import Encounter, ScoreCategory, Score
from .serializers import *
import json


class EncounterUpload(APIView):
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated,IsOwnerOrReadOnly]

    def post(self, request, format=None):

        print(request.data)
        serializer = EncounterSerializer(data=request.data)
        print("trying to serialize")
        if serializer.is_valid():
            print("passed valid")
            encounter = Encounter(**serializer.validated_data)
            encounter.user = request.user
            encounter.save()
            print(request.data)
            request.data._mutable = True
            scores_data = request.data.pop('scores')
            request.data._mutable = False
            print(scores_data)
            scores_data = json.loads(scores_data[0])
            print(scores_data)
            
            for score_data in scores_data:
                score_type = score_data.pop('type')
                print("-------------------------------------------")
                print(score_type)
                print("-------------------------------------------")
                try:
                    score_category = ScoreCategory.objects.get(name=score_type)
                except ScoreCategory.DoesNotExist:
                    score_category = ScoreCategory.objects.create(name=score_type)
                
                Score.objects.create(encounter=encounter,score_type=score_category, **score_data)
            print("___________________")
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# Create your views here.
@api_view(['GET', 'POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def encounters(request):
    parser_classes = (MultiPartParser, FormParser)
    print(request.data)
    print(request.user.username)
    print([i for i in request.user.__dict__.keys() if i[:1] != '_'])

    if request.method == 'GET':
        data = Encounter.objects.filter(user=request.user)
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
        