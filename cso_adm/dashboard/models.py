from django.db import models
from django.urls import reverse

import datetime

Cluster = (
    ("ASO", "ASO"),
    ("ASPIRE", "ASPIRE"),
    ("CAP 12", "CAP 12"),
    ("ENGAGE", "ENGAGE"),
    ("PROBE", "PROBE"),
    ("OTHERS", "OTHERS"),
)


class Organization(models.Model):
    name = models.CharField(default="", max_length=255)
    shortname = models.CharField(default="", max_length=255)
    cluster = models.CharField(default="", max_length=255, choices=Cluster)

    def getJSON(self):
        s = "{"
        s = s + "\\\"short\\\":\\\"" + self.shortname + "\\\","
        s = s + "\\\"long\\\":\\\"" + self.name + "\\\","
        s = s + "\\\"cluster\\\":\\\"" + self.cluster + "\\\"},"
        return s

    def getJSON2(self):
        s = "{"
        s = s + "\"short\":\"" + self.shortname + "\","
        s = s + "\"long\":\"" + self.name + "\","
        s = s + "\"cluster\":\"" + self.cluster + "\"},"
        return s
    def __str__(self):
        return self.name

class PostActsLog(models.Model):
    row_number = models.IntegerField(default=-1)
    timestamp = models.CharField(default="", max_length=255)
    activity_title = models.CharField(default="", max_length=255)
    term = models.CharField(default="", max_length=255)
    organization = models.CharField(default="", max_length=255)
    tie_up_orgs = models.CharField(default="", max_length=255)
    submission_type = models.CharField(default="", max_length=255)

    # Activity Details
    enp = models.CharField(default="", max_length=255)
    anp = models.CharField(default="", max_length=255)
    enmp = models.CharField(default="", max_length=255)
    anmp = models.CharField(default="", max_length=255)
    expenses_incurred = models.CharField(default="", max_length=255)

    # Submission Details
    submitted_by = models.CharField(default="", max_length=255)
    contact_no = models.CharField(default="", max_length=255)
    email = models.CharField(default="", max_length=255)

    # Admin edit
    status = models.CharField(default="", max_length=255, blank=True)
    checked_by = models.CharField(default="", max_length=255, blank=True)
    date_checked = models.CharField(default="", max_length=255, blank=True)
    remarks = models.CharField(default="", max_length=255, blank=True)

    def getJSON(self):
        s = '{'
        s = s + "\\\"id\\\":" + str(self.id) + ","
        try:
            s = s + "\\\"t\\\":\\\"" + datetime.datetime.strptime(self.timestamp, '%m/%d/%Y %H:%M:%S').strftime('%Y/%m/%d %H:%M:%S') + "\\\","
        except:
            s = s + "\\\"t\\\":\\\"" + self.timestamp + "\\\","
        s = s + "\\\"n\\\":\\\"" + self.activity_title.replace("\"", "\\\\\\\"") + "\\\","
        s = s + "\\\"o\\\":\\\"" + self.organization + "\\\","
        s = s + "\\\"term\\\":\\\"" + self.term + "\\\","
        s = s + "\\\"st\\\":\\\"" + self.submission_type + "\\\","
        s = s + "\\\"s\\\":\\\"" + self.status + "\\\","
        s = s + "\\\"cb\\\":\\\"" + self.checked_by + "\\\","
        try:
            s = s + "\\\"d\\\":\\\"" + datetime.datetime.strptime(self.date_checked, '%m/%d/%Y %H:%M:%S').strftime('%Y/%m/%d %H:%M:%S') + "\\\"},"
        except:
            s = s + "\\\"d\\\":\\\"" + self.date_checked + "\\\"},"

        return s

    def getJSON2(self):
        s = '{'
        s = s + "\"id\":" + str(self.id) + ","
        try:
            s = s + "\"t\":\"" + datetime.datetime.strptime(self.timestamp, '%m/%d/%Y %H:%M:%S').strftime('%Y/%m/%d %H:%M:%S') + "\","
        except:
            s = s + "\"t\":\"" + self.timestamp + "\","
        s = s + "\"n\":\"" + self.activity_title.replace("\"", "\\\"") + "\","
        s = s + "\"o\":\"" + self.organization + "\","
        s = s + "\"term\":\"" + self.term + "\","
        s = s + "\"st\":\"" + self.submission_type + "\","
        s = s + "\"s\":\"" + self.status + "\","
        s = s + "\"cb\":\"" + self.checked_by + "\","
        try:
            s = s + "\"d\":\"" + datetime.datetime.strptime(self.date_checked, '%m/%d/%Y %H:%M:%S').strftime('%Y/%m/%d %H:%M:%S') + "\"},"
        except:
            s = s + "\"d\":\"" + self.date_checked + "\"},"

        return s

    def getFullJSON(self):
        s = '{'
        s = s + "\"id\":" + str(self.id) + ","
        try:
            s = s + "\"t\":\"" + datetime.datetime.strptime(self.timestamp, '%m/%d/%Y %H:%M:%S').strftime('%Y/%m/%d %H:%M:%S') + "\","
        except:
            s = s + "\"t\":\"" + self.timestamp + "\","
        s = s + "\"n\":\"" + self.activity_title.replace("\"", "\\\"") + "\","
        s = s + "\"o\":\"" + self.organization + "\","
        s = s + "\"term\":\"" + self.term + "\","
        s = s + "\"st\":\"" + self.submission_type + "\","
        s = s + "\"s\":\"" + self.status + "\","
        s = s + "\"cb\":\"" + self.checked_by + "\","
        try:
            s = s + "\"d\":\"" + datetime.datetime.strptime(self.date_checked, '%m/%d/%Y %H:%M:%S').strftime('%Y/%m/%d %H:%M:%S') + "\","
        except:
            s = s + "\"d\":\"" + self.date_checked + "\","
        s = s + "\"tie\":\"" + self.tie_up_orgs.replace("\"", "\\\"") + "\","
        s = s + "\"en\":\"" + self.enp + "\","
        s = s + "\"enm\":\"" + self.enmp + "\","
        s = s + "\"an\":\"" + self.anp + "\","
        s = s + "\"anm\":\"" + self.anmp + "\","
        s = s + "\"sb\":\"" + self.submitted_by + "\","
        s = s + "\"num\":\"" + self.contact_no + "\","
        s = s + "\"ml\":\"" + self.email + "\","
        s = s + "\"mk\":\"" + self.remarks.replace("\"", "\\\"") + "\"}"

        return s

    def __str__(self):
        return self.activity_title

    def get_absolute_url(self):
        return reverse('dashboard', kwargs={'id': self.id})

class Map(models.Model):
    key = models.CharField(default="", max_length=255)
    value = models.CharField(default="", max_length=255)

    def __str__(self):
        return self.key


