# Generated by Django 3.0.7 on 2020-07-09 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('table', '0005_auto_20200709_1438'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScoreCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=64)),
            ],
        ),
    ]
