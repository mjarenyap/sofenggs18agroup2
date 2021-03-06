# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-16 17:46
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_map_postactslog'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrgComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.CharField(default='', max_length=255)),
                ('username', models.CharField(default='', max_length=255)),
                ('comment', models.CharField(default='', max_length=255)),
            ],
        ),
        migrations.AlterField(
            model_name='organization',
            name='cluster',
            field=models.CharField(choices=[('ASO', 'ASO'), ('ASPIRE', 'ASPIRE'), ('CAP 12', 'CAP 12'), ('ENGAGE', 'ENGAGE'), ('PROBE', 'PROBE'), ('OTHERS', 'OTHERS')], default='', max_length=255),
        ),
        migrations.AddField(
            model_name='orgcomment',
            name='organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.Organization'),
        ),
    ]
