import json
import pytz

from django.contrib.auth import login, authenticate, logout
from django.utils import timezone
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse
from django.views import View
from django.views.generic import UpdateView

from dashboard.models import Activity, PostActsLog, Organization
from dashboard.forms import UserForm, UpdatePostActsForm


# def index(request):
#     template_name = 'dashboard/index2.html'
#     activities = Activity.objects.all()
#
#     context = {
#         "activities": serializers.serialize('json', activities),
#     }
#
#     return render(request, template_name, context)
def create(org, activity, log):
    s = '{'
    s = s + "'postActsLogID' : '" + str(log.id) + "',"
    s = s + "'timestamp' : '" + str(log.timestamp.astimezone(pytz.timezone('Asia/Manila')).strftime('%Y/%m/%d %H:%M:%S')) + "',"
    s = s + "'activityTitle' : '" + activity.title + "',"
    s = s + "'orgName' : '" + org.shortname + "',"
    s = s + "'term' : '" + activity.term + "',"
    s = s + "'submissionType' : '" + log.submissionType + "',"
    s = s + "'status' : '" + log.status + "',"
    s = s + "'checkedBy' : '" + log.checkedBy + "',"
    if log.dateChecked is not None:
        s = s + "'dateChecked' : '" + str(log.dateChecked.astimezone(pytz.timezone('Asia/Manila')).strftime('%Y/%m/%d %H:%M:%S')) + "',"
    else:
        s = s + "'dateChecked' : '',"
    if activity.tieupOrgs == "":
        s = s + "'tieUpOrg' : 'N/A',"
    else:
        s = s + "'tieUpOrg' : '" + activity.tieupOrgs + "',"
    s = s + "'enp' : '" + str(log.enp) + "',"
    s = s + "'enmp' : '" + str(log.enmp) + "',"
    s = s + "'anp' : '" + str(log.anp) + "',"
    s = s + "'anmp' : '" + str(log.anmp) + "',"
    s = s + "'submittedBy' : '" + log.submittedBy + "',"
    s = s + "'contactNo' : '" + log.contactNo + "',"
    s = s + "'email' : '" + log.email + "',"
    s = s + "'remarks' : '" + log.comments + "'},"
    return s


def save_post_acts(request):
    # Get the ID edited from the POST request
    id = request.POST.get('id', False)

    # If an ID was found, this request contains payload
    # If not, then the URL was just manually entered, and nothing would be done
    if id is not False:
        # Get the actual postactslog from the retrieved ID
        edited_post_acts_log = PostActsLog.objects.get(id=id)

        # Modify the necessary fields
        edited_post_acts_log.status = request.POST.get('status')
        edited_post_acts_log.checkedBy = request.POST.get('cb')
        edited_post_acts_log.dateChecked = timezone.now()
        edited_post_acts_log.comments = request.POST.get('remarks')

        print(edited_post_acts_log.dateChecked)

        # Commit edits into the database
        edited_post_acts_log.save()

        # Then go back to the index URL with the updated values
        response = {'status': 1, 'message': "Ok", 'url': reverse('dashboard:index')}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return redirect(reverse('dashboard:index'))


class UserFormView(View):
    form_class = UserForm
    template_name = 'dashboard/index.html'

    def get(self, request):
        form = self.form_class(None)

        activities_sets = "[ "
        for org in Organization.objects.all():
            org_acts = Activity.objects.filter(organization=org)
            for activity in org_acts:
                activity_log = PostActsLog.objects.filter(activity=activity)
                for log in activity_log:
                    activities_sets += create(org, activity, log)

        activities_sets = activities_sets[:-1]
        activities_sets += "]"
        context = {
            "activities": activities_sets,
            "form": form
        }

        return render(request, self.template_name, context)

    # process form data
    def post(self, request):
        form = self.form_class(request.POST)

        username = request.POST.get('username', False)
        password = request.POST.get('password', False)

        # If the username and password objects exist in the request dictionary, then it is a login POST
        if username is not False and password is not False:
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)

                return redirect('dashboard:index')
            else:
                # Retrieve activities
                activities_sets = "[ "
                for org in Organization.objects.all():
                    org_acts = Activity.objects.filter(organization=org)
                    for activity in org_acts:
                        activity_log = PostActsLog.objects.filter(activity=activity)
                        for log in activity_log:
                            activities_sets += create(org, activity, log)

                activities_sets = activities_sets[:-1]
                activities_sets += "]"
                context = {
                    "activities": activities_sets,
                    "form": form
                }

                return render(request, self.template_name, context)
        else:
            # If not, then it is a logout POST
            logout(request)

            # Retrieve activities
            activities_sets = "[ "
            for org in Organization.objects.all():
                org_acts = Activity.objects.filter(organization=org)
                for activity in org_acts:
                    activity_log = PostActsLog.objects.filter(activity=activity)
                    for log in activity_log:
                        activities_sets += create(org, activity, log)

            activities_sets = activities_sets[:-1]
            activities_sets += "]"
            context = {
                "activities": activities_sets,
                "form": form
            }

            return render(request, self.template_name, context)
