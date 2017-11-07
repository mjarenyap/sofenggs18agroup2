import json

import pytz
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.http import HttpResponse
from django.shortcuts import render, redirect
# Create your views here.
from django.urls import reverse
from django.utils import timezone
from django.views import View

from dashboard.models import Activity, PostActsLog, Organization


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
    s = s + "'timestamp' : '" + str(
        log.timestamp.astimezone(pytz.timezone('Asia/Manila')).strftime('%Y/%m/%d %H:%M:%S')) + "',"
    s = s + "'activityTitle' : '" + activity.title + "',"
    s = s + "'orgName' : '" + org.shortname + "',"
    s = s + "'term' : '" + activity.term + "',"
    s = s + "'submissionType' : '" + log.submissionType + "',"
    s = s + "'status' : '" + log.status + "',"
    s = s + "'checkedBy' : '" + log.checkedBy + "',"
    if log.dateChecked is not None:
        s = s + "'dateChecked' : '" + str(
            log.dateChecked.astimezone(pytz.timezone('Asia/Manila')).strftime('%Y/%m/%d %H:%M:%S')) + "',"
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
    template_name = 'dashboard/index.html'

    def get(self, request):
        print("GET request received.")
        print("Retrieving data from the database...")

        activities_sets = "[ "
        for org in Organization.objects.all():
            org_acts = Activity.objects.filter(organization=org)
            for activity in org_acts:
                activity_log = PostActsLog.objects.filter(activity=activity)
                for log in activity_log:
                    activities_sets += create(org, activity, log)

        activities_sets = activities_sets[:-1]
        activities_sets += "]"

        print("Data retrieved.")
        print("Embedding the data into the session...")

        context = {
            "activities": activities_sets,
        }

        print("Data embedded.")
        print("Serving index.html...")

        return render(request, self.template_name, context)

    # process form data
    def post(self, request):
        print("POST request received.")
        print("Identifying POST request...")

        # Identify the POST request
        # These two variables would be present in a login POST:
        username = request.POST.get('username', False)
        password = request.POST.get('password', False)

        # While this variable would be present for a logout POST:
        logouts = request.POST.get('logout', False)

        print("POST request identified.")

        # If the username and password objects exist in the request dictionary, then it is a login POST
        if username is not False and password is not False:
            print("Login POST.")

            # Validate the entered credentials
            user = authenticate(request, username=username, password=password)

            # Credentials are valid, so log the user in
            if user is not None:
                print("Credentials correct. Login successful.")

                login(request, user)

                return redirect('dashboard:index')
            else:
                # Credentials are invalid, so keep them out of their privileges
                print("Credentials incorrect. Login failed.")

                # Retrieve activities
                print("Retrieving data from the database...")

                activities_sets = "[ "
                for org in Organization.objects.all():
                    org_acts = Activity.objects.filter(organization=org)
                    for activity in org_acts:
                        activity_log = PostActsLog.objects.filter(activity=activity)
                        for log in activity_log:
                            activities_sets += create(org, activity, log)

                activities_sets = activities_sets[:-1]
                activities_sets += "]"

                print("Data retrieved.")
                print("Embedding the data into the session...")

                context = {
                    "activities": activities_sets,
                }

                print("Data embedded.")
                print("Serving index.html...")

                # Immediately display a one-time error message at the next request holder
                print("Embedding an error message...")
                messages.error(request, 'Sign in failed. Your username or password is incorrect.')

                print("Error message embedded.")
                print("Serving index.html...")

                return render(request, self.template_name, context)
        elif logouts is not False:
            print("Logout POST.")

            print("Logging the user out...")

            # If not, but contains a logout object, then it is a logout POST
            logout(request)

            print("User logged out.")
            print("Retrieving data from the database...")

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

            print("Data retrieved.")
            print("Embedding the data into the session...")

            context = {
                "activities": activities_sets,
            }

            print("Data embedded.")
            print("Serving index.html...")

            return render(request, self.template_name, context)
        else:
            # Unless some POST requests are corrupted, this shouldn't be seen at all
            print("Unknown POST request.")

            return redirect('page_404:test_url')
