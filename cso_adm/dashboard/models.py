from django.db import models
from django.urls import reverse

SubmissionType = (
    ('Initial Submission', 'Initial Submission'),
    ('Pended', 'Pended'),
)

Status = (
    ("NC", "Not Checked"),
    ("EC", "Early Complete"),
    ("LC", "Late Complete"),
    ("EI", "Early Incomplete"),
    ("LI", "Late Incomplete"),
    ("AC", "Acknowledge Cancellation"),
    ("P", "Pending"),
)

Term = (
    ('1', '1'),
    ('2', '2'),
    ('3', '3'),
    ('Yearlong', 'Yearlong'),
)

Checker = (
    ('Hordy Mojica', 'Hordy Mojica'),
    ('Kyle Gecana', 'Kyle Gecana'),
    ('Nami Inomata', 'Nami Inomata'),
    ('Jana Josef', 'Jana Josef'),
    ('Julianne Sy', 'Julianne Sy'),
    ('Krystel Tan', 'Krystel Tan'),
)

Cluster = (
    ("ASO", "ASO"),
    ("ASPIRE", "ASPIRE"),
    ("CAP 12", "CAP 12"),
    ("ENGAGE", "ENGAGE"),
    ("PROBE", "PROBE"),
)


class Organization(models.Model):
    name = models.CharField(default="", max_length=255)
    shortname = models.CharField(default="", max_length=255)
    cluster = models.CharField(default="", max_length=255, choices=Cluster)

    def __str__(self):
        return self.name

class PostActsLog():
    activity_title = ""
    timestamp = ""
    submission_type = ""

    # Activity Details
    enp = ""
    anp = ""
    enmp = ""
    anmp = ""
    expenses_incurred = ""

    # Submission Details
    submitted_by = ""
    contact_no = ""
    email = ""

    # Admin edit
    status = ""
    checked_by = ""
    date_checked = ""
    comments = ""

    def __str__(self):
        # this will return json string of log
        return ""

    def get_absolute_url(self):
        return reverse('dashboard', kwargs={'id': self.id})