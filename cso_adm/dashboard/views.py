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

from dashboard.models import PostActsLog, Organization
from dashboard import utility

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
        edited_post_acts_log.checked_by = request.POST.get('cb')
        edited_post_acts_log.date_checked = timezone.now()
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
        utility.sync()
        logs_set = "["
        for log in PostActsLog.objects.all():
            logs_set = logs_set + str(log.getJSON())
        if len(logs_set) > 1:
            logs_set = logs_set[:-1]
        logs_set = logs_set + "]"
        print("JSON for Logs: " + logs_set)

        organization_set = "["
        for org in Organization.objects.all():
            organization_set = organization_set + str(org.getJSON())
        if len(organization_set) > 1:
            organization_set = organization_set[:-1]
        organization_set = organization_set + "]"
        print("JSON for Organizations: " + organization_set)

        context = {
            "logs": logs_set,
            "organizations": organization_set,
        }

        return render(request, self.template_name, context)

    # process form data
    def post(self, request):
        username = request.POST.get('username', False)
        password = request.POST.get('password', False)
        logouts = request.POST.get('logout', False)

        # If the username and password objects exist in the request dictionary, then it is a login POST
        if username is not False and password is not False:
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)

                return redirect('dashboard:index')
            else:
                # Retrieve logs
                logs_set = "["
                for log in PostActsLog.objects.all():
                    logs_set = logs_set + str(log.getJSON())
                if len(logs_set) > 1:
                    logs_set = logs_set[:-1]
                logs_set = logs_set + "]"

                organization_set = "["
                for org in Organization.objects.all():
                    organization_set = organization_set + str(org.getJSON())
                if len(organization_set) > 1:
                    organization_set = organization_set[:-1]
                organization_set = organization_set + "]"
                print("JSON for Organizations: " + organization_set)

                context = {
                    "logs": logs_set,
                    "organizations": organization_set,
                }

                messages.error(request, 'Sign in failed. Your username or password is incorrect.')

                return render(request, self.template_name, context)
        elif logouts is not False:
            # If not, but contains a logout object, then it is a logout POST
            logout(request)

            # Retrieve logs
            logs_set = "["
            for log in PostActsLog.objects.all():
                logs_set = logs_set + str(log.getJSON())
            if len(logs_set) > 1:
                logs_set = logs_set[:-1]
            logs_set = logs_set + "]"

            organization_set = "["
            for org in Organization.objects.all():
                organization_set = organization_set + str(org.getJSON())
            if len(organization_set) > 1:
                organization_set = organization_set[:-1]
            organization_set = organization_set + "]"
            print("JSON for Organizations: " + organization_set)

            context = {
                "logs": logs_set,
                "organizations": organization_set,
            }

            return render(request, self.template_name, context)
        else:
            return redirect('page_404:page_404')
