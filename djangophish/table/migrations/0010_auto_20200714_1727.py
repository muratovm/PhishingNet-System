# Generated by Django 3.0.7 on 2020-07-14 21:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('table', '0009_auto_20200714_1705'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='encounter',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='encounter_scores', to='table.Encounter'),
        ),
        migrations.AlterField(
            model_name='score',
            name='score_type',
            field=models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, related_name='category', to='table.ScoreCategory'),
        ),
    ]
