from datetime import datetime
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import UserPassesTestMixin
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse

# Create your views here.

# This is only for testing purposes. You may comment this out
from django.views import View
from dashboard.models import PostActsLog, Organization, Map, OrgComment
import json
from dashboard import utility
from dashboard import modelJSON

def get_response_context(request):
    print('HERE AT ORG LIST CONTEXT')
    organization_set = modelJSON.get_all_org_json()
    cluster_set = modelJSON.get_all_cluster_json()

    data_set = "["
    for org in Organization.objects.all():
        org_log = PostActsLog.objects.filter(organization__iexact=org.shortname)
        data_set = data_set + "{\"abbreviation\":\"" + org.shortname + "\","
        data_set = data_set + "\"orgName\":\"" + org.name + "\","
        data_set = data_set + "\"cluster\":\"" + org.cluster + "\","
        ec_cnt = org_log.filter(status__iexact='Early Complete').count()
        data_set = data_set + "\"ec\":" + str(ec_cnt) + ","
        lc_cnt = org_log.filter(status__iexact='Late Complete').count()
        data_set = data_set + "\"lc\":" + str(lc_cnt) + ","
        ei_cnt = org_log.filter(status__iexact='Early Incomplete').count()
        data_set = data_set + "\"ei\":" + str(ei_cnt) + ","
        li_cnt = org_log.filter(status__iexact='Late Incomplete').count()
        data_set = data_set + "\"li\":" + str(li_cnt) + ","
        p_cnt = org_log.filter(status__iexact='Pending').count()
        data_set = data_set + "\"p\":" + str(p_cnt) + ","
        ac_cnt = org_log.filter(status__iexact='Acknowledged Cancellation').count()
        data_set = data_set + "\"ac\":" + str(ac_cnt) + ","
        cnt = org_log.all().count() - ec_cnt - lc_cnt - ei_cnt - li_cnt - p_cnt - ac_cnt
        data_set = data_set + "\"nc\":" + str(cnt) + "},"
    if len(data_set) > 1:
        data_set = data_set[:-1]
    data_set = data_set + "]"
    print("JSON for Data: " + data_set)

    response = {'status': 1, 'message': "Ok", 'data_set': data_set, 'orgs': organization_set, 'cluster': cluster_set, 'url': reverse('org_list:general_orgs')}
    return HttpResponse(json.dumps(response), content_type='application/json')

def get_response_context_specific(request, org):
    logs_set = modelJSON.get_org_log_json(org)
    mod_set = modelJSON.get_all_moderator_json()
    type_set = modelJSON.get_all_type_json()
    status_set = modelJSON.get_all_status_set()

    response = {
        'status': 1,
        'message': "Ok",
        'logs': logs_set,
        'mod': mod_set,
        'type': type_set,
        'status': status_set
    }
    return HttpResponse(json.dumps(response), content_type='application/json')

def get_org_comments(request, org):
    comments_set = modelJSON.get_all_org_comments(org)

    response = {
        'status': 1,
        'message': "Ok",
        'comments': comments_set
    }

    return HttpResponse(json.dumps(response), content_type='application/json')

def add_org_comment(request, org):
    comment_msg = request.POST.get('comment', '')
    comment = OrgComment()
    comment.organization = Organization.objects.get(shortname__iexact = org)
    comment.timestamp = datetime.now().strftime('%Y/%m/%d %H:%M:%S')
    comment.username = request.user.username
    comment.comment = comment_msg
    # comment.save()

    response = {
        'status': 1,
        'message': "Ok",
        'comment': comment.getFullJSON()
    }

    return HttpResponse(json.dumps(response), content_type='application/json')

def get_log(request):
    print (request)
    id = request.GET.get("id", False)
    if id is not False:
        log_json = PostActsLog.objects.get(id=int(id)).getFullJSON()
        print("JSON for id=" + str(id) + ": " + log_json)
        response = {'status': 1, 'message': "Ok", "log": log_json, 'url': reverse('org_list:specific_org')}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return redirect(reverse('org_list:specific_org'))


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

def getSpecificContext(org):

    org_log = PostActsLog.objects.filter(organization__iexact=org.shortname)
    data_set = "{\"abbreviation\":\"" + org.shortname + "\","
    data_set = data_set + "\"orgName\":\"" + org.name + "\","
    data_set = data_set + "\"cluster\":\"" + org.cluster + "\","
    ec_cnt = org_log.filter(status__iexact='Early Complete').count()
    data_set = data_set + "\"ec\":" + str(ec_cnt) + ","
    lc_cnt = org_log.filter(status__iexact='Late Complete').count()
    data_set = data_set + "\"lc\":" + str(lc_cnt) + ","
    ei_cnt = org_log.filter(status__iexact='Early Incomplete').count()
    data_set = data_set + "\"ei\":" + str(ei_cnt) + ","
    li_cnt = org_log.filter(status__iexact='Late Incomplete').count()
    data_set = data_set + "\"li\":" + str(li_cnt) + ","
    p_cnt = org_log.filter(status__iexact='Pending').count()
    data_set = data_set + "\"p\":" + str(p_cnt) + ","
    ac_cnt = org_log.filter(status__iexact='Acknowledged Cancellation').count()
    data_set = data_set + "\"ac\":" + str(ac_cnt) + ","
    cnt = org_log.all().count() - ec_cnt - lc_cnt - ei_cnt - li_cnt - p_cnt - ac_cnt
    data_set = data_set + "\"nc\":" + str(cnt) + "}"

    #print("JSON for Data: " + data_set)

    context = {
        "data": json.loads(data_set),
        "term": Map.objects.get(key="default_term").value,
    }
    return context

class OrgGeneralView(UserPassesTestMixin, View):
    template_name = 'org_list/org-list.html'

    login_url = '/settings/'

    def test_func(self):
        return not self.request.user.groups.filter(name='useradmin').exists()

    def get(self, request):
        utility.sync()
        # TODO: Spew out content of orgs list then add to context

        context = {}

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

                return redirect('org_list:general_orgs')
            else:
                # TODO: Spew out content of orgs list then add to context

                context = {}

                messages.error(request, 'Sign in failed. Your username or password is incorrect.')

                return render(request, self.template_name, context)
        elif logouts is not False:
            # If not, but contains a logout object, then it is a logout POST
            logout(request)

            # TODO: Spew out content of orgs list then add to context

            context = {}

            return render(request, self.template_name, context)
        else:
            return redirect('page_404:page_404')


# TODO: Placeholder class-based view, will be modified
# TODO: Embed content of general orgs list
class OrgSpecificView(UserPassesTestMixin, View):
    template_name = 'org_list/org-specific.html'

    login_url = '/settings/'

    def test_func(self):
        return not self.request.user.groups.filter(name='useradmin').exists()

    def get(self, request, org_name):
        utility.sync()
        # Does that case insensitive org name even exist?
        try:
            org = Organization.objects.get(shortname__iexact=org_name)
            # TODO: Spew out content of specific org then add to context

            context = getSpecificContext(org)

            return render(request, self.template_name, context)
        except Organization.DoesNotExist:
            print("ERROR: " + org_name + " does not exist.")
            return redirect('page_404:page_404')



    # process form data
    def post(self, request, org_name):
        username = request.POST.get('username', False)
        password = request.POST.get('password', False)
        logouts = request.POST.get('logout', False)
        org = Organization.objects.get(shortname__iexact=org_name)
        # If the username and password objects exist in the request dictionary, then it is a login POST
        if username is not False and password is not False:
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)

                return redirect('org_list:specific_org', org_name=org_name)
            else:
                # TODO: Spew out content of orgs list then add to context

                context = getSpecificContext(org)

                messages.error(request, 'Sign in failed. Your username or password is incorrect.')

                return render(request, self.template_name, context)
        elif logouts is not False:
            # If not, but contains a logout object, then it is a logout POST
            logout(request)

            # TODO: Spew out content of orgs list then add to context

            context = getSpecificContext(org)

            return render(request, self.template_name, context)
        else:
            return redirect('page_404:page_404')
