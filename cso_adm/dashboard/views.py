import json
from datetime import datetime

from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.mixins import UserPassesTestMixin
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View

from dashboard import utility
from dashboard.models import PostActsLog, Organization, Map
from dashboard import modelJSON


# Create your views here.

def get_response_context(request):
    print('HERE AT DASHBOARD AJAX CONTEXT')

    logs_set = modelJSON.get_all_log_json()
    organization_set = modelJSON.get_all_org_json()
    cluster_set = modelJSON.get_all_cluster_json()
    mod_set = modelJSON.get_all_moderator_json()
    type_set = modelJSON.get_all_type_json()
    status_set = modelJSON.get_all_status_set()

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
    print("Saving post acts")
    # Get the ID edited from the POST request
    id = request.POST.get('id', False)
    print(request.user)

    if not request.user.is_authenticated():
        print("Saved failed. Not logged in.")
        response = {'status': 0}

        return HttpResponse(json.dumps(response), content_type='application/json')

    # If an ID was found, this request contains payload
    # If not, then the URL was just manually entered, and nothing would be done
    if id is not False:
        # Get the actual postactslog from the retrieved ID
        edited_post_acts_log = PostActsLog.objects.get(id=id)
        row = str(edited_post_acts_log.row_number)
        # Modify the necessary fields
        list = []
        edited_post_acts_log.status = request.POST.get('status')
        print(edited_post_acts_log.status)
        log = [row, Map.objects.get(key="status").value, edited_post_acts_log.status]
        list.append(log)
        edited_post_acts_log.checked_by = request.user.get_full_name()
        print(edited_post_acts_log.checked_by)
        log = [row, Map.objects.get(key="checked_by").value, edited_post_acts_log.checked_by]
        list.append(log)
        edited_post_acts_log.date_checked = datetime.now().strftime('%m/%d/%Y %H:%M:%S')
        print(edited_post_acts_log.date_checked)
        log = [row, Map.objects.get(key="date_checked").value, edited_post_acts_log.date_checked]
        list.append(log)
        edited_post_acts_log.remarks = request.POST.get('remarks')
        print(edited_post_acts_log.remarks)
        log = [row, Map.objects.get(key="remarks").value, edited_post_acts_log.remarks]
        list.append(log)

        # Commit edits into the database
        if utility.update_cells(list):
            edited_post_acts_log.save()
        else:
            print("Update failed. Changes not saved.")
            response = {'status': 0}

            return HttpResponse(json.dumps(response), content_type='application/json')

        # Then go back to the index URL with the updated values
        response = {'status': 1, 'message': "Ok"}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        print("Saving failed.")
        response = {'status': 0}

        return HttpResponse(json.dumps(response), content_type='application/json')


class UserFormView(UserPassesTestMixin, View):
    template_name = 'dashboard/index.html'

    login_url = '/settings/'

    def test_func(self):
        return not self.request.user.groups.filter(name='useradmin').exists()

    def get(self, request):
        utility.sync()

        context = {
            "term" : Map.objects.get(key="default_term").value
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
                context = {
                    "term": Map.objects.get(key="default_term").value
                }

                messages.error(request, 'Sign in failed. Your username or password is incorrect.')

                return render(request, self.template_name, context)
        elif logouts is not False:
            # If not, but contains a logout object, then it is a logout POST
            logout(request)

            # Retrieve logs
            context = {
                "term": Map.objects.get(key="default_term").value
            }

            return render(request, self.template_name, context)
        else:
            return redirect('page_404:page_404')
