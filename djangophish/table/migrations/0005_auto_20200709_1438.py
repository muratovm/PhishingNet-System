# Generated by Django 3.0.7 on 2020-07-09 18:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table', '0004_auto_20200709_1436'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Scores',
            new_name='Score',
        ),
    ]