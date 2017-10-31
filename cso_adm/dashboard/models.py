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


class Organization(models.Model):
    name = models.CharField(default="", max_length=255)
    shortname = models.CharField(default="", max_length=255)

    def __str__(self):
        return self.name


class Activity(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    title = models.CharField(default="", max_length=255)
    term = models.CharField(choices=Term, max_length=255)
    tieupOrgs = models.CharField(default="", max_length=255, blank=True)

    def __str__(self):
        return self.title


class PostActRequirements(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    preActs = models.BooleanField()
    listOfExpenses = models.BooleanField()
    gals = models.BooleanField()
    pictures = models.BooleanField()
    actvReport = models.BooleanField()
    evalResults = models.BooleanField()

    def __str__(self):
        return self.activity.title


class PostActsLog(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    timestamp = models.DateTimeField('timestamp')
    submissionType = models.CharField(choices=SubmissionType, max_length=255)

    # Activity Details
    enp = models.IntegerField(default=0)
    anp = models.IntegerField(default=0)
    enmp = models.IntegerField(default=0)
    anmp = models.IntegerField(default=0)
    expensesIncurred = models.CharField(default="", max_length=255)

    # Submission Details
    submittedBy = models.CharField(default="", max_length=255)
    contactNo = models.CharField(default="", max_length=255)
    email = models.EmailField()

    # Admin edit
    status = models.CharField(default='NC', choices=Status, max_length=255)
    checkedBy = models.CharField(choices=Checker, max_length=255, blank=True)
    dateChecked = models.DateTimeField('date checked', blank=True, null=True)
    comments = models.CharField(default="", max_length=255, blank=True)

    def __str__(self):
        return self.activity.title

    def get_absolute_url(self):
        return reverse('dashboard', kwargs={'id': self.id})
