# Generated by Django 3.0.7 on 2020-07-14 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('table', '0010_auto_20200714_1727'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='score',
            field=models.PositiveSmallIntegerField(blank=True, default=None),
        ),
    ]
