# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-16 17:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0003_auto_20171217_0146'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organization',
            name='cluster',
            field=models.CharField(default='', max_length=255),
        ),
    ]
