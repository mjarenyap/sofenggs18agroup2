# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-16 17:49
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0004_auto_20171217_0147'),
    ]

    operations = [
        migrations.RenameField(
            model_name='orgcomment',
            old_name='comment',
            new_name='commen',
        ),
    ]
