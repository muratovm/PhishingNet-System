from django.db import models
import datetime

from django.conf import settings
# Create your models here.

class Encounter(models.Model):
    def __str__(self):
        return str(self.url) +"   "+ str(self.date) +"   "+ str(self.time)
    
    class Meta:
        unique_together = ['sha256', 'date','time']

    url = models.URLField(max_length=200, blank=True, default="")
    sha256 = models.CharField(max_length=64, blank=True, default="")
    date = models.DateField(default=datetime.date.today)
    time = models.TimeField(default="00:00")
    image = models.ImageField(default = None, blank=True, upload_to="images/encounters/", height_field=None, width_field=None)


class ScoreCategory(models.Model):
    def __str__(self):
        return self.name


    name = models.CharField(max_length=64, blank=True, default="")


class Score(models.Model):
    def __str__(self):
        return str(self.score_type.name) + ": "+str(self.score)
        
    score = models.PositiveSmallIntegerField(default=None, blank = True)
    score_type = models.ForeignKey(ScoreCategory,default = None,related_name='category',blank=True, on_delete=models.CASCADE)
    encounter = models.ForeignKey(Encounter,related_name='encounter_scores',blank=True, on_delete=models.CASCADE)

