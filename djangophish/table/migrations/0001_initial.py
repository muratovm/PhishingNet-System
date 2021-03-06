# Generated by Django 3.0.7 on 2020-07-08 21:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Encounter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(blank=True, default='')),
                ('sha256', models.CharField(blank=True, default='', max_length=64)),
                ('image', models.ImageField(blank=True, default=None, upload_to='images/encounters/')),
            ],
        ),
    ]
