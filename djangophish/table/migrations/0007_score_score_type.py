# Generated by Django 3.0.7 on 2020-07-09 18:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('table', '0006_scorecategory'),
    ]

    operations = [
        migrations.AddField(
            model_name='score',
            name='score_type',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='category', to='table.ScoreCategory'),
        ),
    ]