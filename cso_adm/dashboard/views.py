import json
from datetime import datetime

from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View

from dashboard import utility
from dashboard.models import PostActsLog, Organization, Map
from dashboard import ModelJSON


# Create your views here.

def get_response_context(request):
    print('HERE AT DASHBOARD AJAX CONTEXT')

    logs_set = ModelJSON.get_all_log_json()
    organization_set = ModelJSON.get_all_org_json()
    cluster_set = ModelJSON.get_all_cluster_json()
    mod_set = ModelJSON.get_all_moderator_json()
    type_set = ModelJSON.get_all_type_json()
    status_set = ModelJSON.get_all_status_set()

    response = {
        'status': 1,
        'message': "Ok",
        'logs': logs_set,
        'orgs': organization_set,
        'cluster': cluster_set,
        'mod': mod_set,
        'type': type_set,
        'status': status_set
    }
    return HttpResponse(json.dumps(response), content_type='application/json')

def getContext():
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

    return context


def get_log(request):
    print(request)
    id = request.GET.get("id", False)
    if id is not False:
        log_json = PostActsLog.objects.get(id=int(id)).getFullJSON()
        print("JSON for id=" + str(id) + ": " + log_json)
        response = {'status': 1, 'message': "Ok", "log": log_json, 'url': reverse('dashboard:index')}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return redirect(reverse('dashboard:index'))


def save_post_acts(request):
    # Get the ID edited from the POST request
    id = request.POST.get('id', False)

    # If an ID was found, this request contains payload
    # If not, then the URL was just manually entered, and nothing would be done
    if id is not False:
        # Get the actual postactslog from the retrieved ID
        edited_post_acts_log = PostActsLog.objects.get(id=id)
        row = str(edited_post_acts_log.row_number)
        # Modify the necessary fields
        list = []
        edited_post_acts_log.status = request.POST.get('status')
        log = [row, Map.objects.get(key="status").value, edited_post_acts_log.status]
        list.append(log)
        edited_post_acts_log.checked_by = request.POST.get('cb')
        log = [row, Map.objects.get(key="checked_by").value, edited_post_acts_log.checked_by]
        list.append(log)
        edited_post_acts_log.date_checked = datetime.now().strftime('%m/%d/%Y %H:%M:%S')
        log = [row, Map.objects.get(key="date_checked").value, edited_post_acts_log.date_checked]
        list.append(log)
        edited_post_acts_log.remarks = request.POST.get('remarks')
        log = [row, Map.objects.get(key="remarks").value, edited_post_acts_log.remarks]
        list.append(log)

        # Commit edits into the database
        if utility.update_cells(list):
            edited_post_acts_log.save()
        else:
            print("Update failed. Changes not saved.")

        # TODO send message update not done

        # Then go back to the index URL with the updated values
        response = {'status': 1, 'message': "Ok", 'url': reverse('dashboard:index')}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return redirect(reverse('dashboard:index'))


class UserFormView(View):
    template_name = 'dashboard/index.html'

    def get(self, request):
        utility.sync()

        context = {}

        return render(request, self.template_name, context)

    # process form data
    def post(self, request):
        utility.sync()
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
                context = {}

                messages.error(request, 'Sign in failed. Your username or password is incorrect.')

                return render(request, self.template_name, context)
        elif logouts is not False:
            # If not, but contains a logout object, then it is a logout POST
            logout(request)

            # Retrieve logs
            context = {}

            return render(request, self.template_name, context)
        else:
            return redirect('page_404:page_404')
