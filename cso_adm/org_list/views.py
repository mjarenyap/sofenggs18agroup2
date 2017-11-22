from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse

# Create your views here.

# This is only for testing purposes. You may comment this out
from django.views import View
from dashboard.models import PostActsLog, Organization, Map
import json
from dashboard import utility

# # TODO: Tester url, will be modified
# # TODO: Embed content of SPECIFIC org list
# def test_url(request, username):
#     # TODO: implement org name validation
#     template_name = 'org_list/org-specific.html'
#
#     return render(request, template_name)

# TODO: Placeholder class-based view, will be modified
# TODO: Embed content of general orgs list

def get_response_context(request):
    print('HERE AT ORG LIST CONTEXT')
    organization_set = "["
    for org in Organization.objects.all():
        organization_set = organization_set + str(org.getJSON2())
    if len(organization_set) > 1:
        organization_set = organization_set[:-1]
    organization_set = organization_set + "]"
    print("JSON for Organizations  : " + organization_set)

    data_set = "["
    for org in Organization.objects.all():
        org_log = PostActsLog.objects.filter(organization=org.shortname)
        data_set = data_set + "{\"abbreviation\":\"" + org.shortname + "\","
        data_set = data_set + "\"orgName\":\"" + org.name + "\","
        data_set = data_set + "\"cluster\":\"" + org.cluster + "\","
        ec_cnt = org_log.filter(status='Early Complete').count()
        data_set = data_set + "\"ec\":" + str(ec_cnt) + ","
        lc_cnt = org_log.filter(status='Late Complete').count()
        data_set = data_set + "\"lc\":" + str(lc_cnt) + ","
        ei_cnt = org_log.filter(status='Early Incomplete').count()
        data_set = data_set + "\"ei\":" + str(ei_cnt) + ","
        li_cnt = org_log.filter(status='Late Incomplete').count()
        data_set = data_set + "\"li\":" + str(li_cnt) + ","
        p_cnt = org_log.filter(status='Pending').count()
        data_set = data_set + "\"p\":" + str(p_cnt) + ","
        cnt = org_log.all().count() - ec_cnt - lc_cnt - ei_cnt - li_cnt - p_cnt
        data_set = data_set + "\"nc\":" + str(cnt) + "},"
    if len(data_set) > 1:
        data_set = data_set[:-1]
    data_set = data_set + "]"
    print("JSON for Data: " + data_set)

    response = {'status': 1, 'message': "Ok", 'data_set': data_set, 'orgs': organization_set, 'url': reverse('org_list:general_orgs')}
    return HttpResponse(json.dumps(response), content_type='application/json')

def get_response_context_specific(request, org):
    logs_set = "["
    for log in PostActsLog.objects.filter(organization=org):
        logs_set = logs_set + str(log.getJSON2())
    if len(logs_set) > 1:
        logs_set = logs_set[:-1]
    logs_set = logs_set + "]"
    print("JSON for " + org + " Logs: " + logs_set)

    response = {'status': 1, 'message': "Ok", 'logs': logs_set}
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
    # Get the ID edited from the POST request
    id = request.POST.get('id', False)

    # If an ID was found, this request contains payload
    # If not, then the URL was just manually entered, and nothing would be done
    if id is not False:
        # Get the actual postactslog from the retrieved ID
        edited_post_acts_log = PostActsLog.objects.get(id=id)
        row = str(edited_post_acts_log.row)
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
            print ("Update failed. Changes not saved.")

        # TODO send message update not done

        # Then go back to the index URL with the updated values
        response = {'status': 1, 'message': "Ok", 'url': reverse('dashboard:index')}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return redirect(reverse('dashboard:index'))

def getContext():
    organization_set = "["
    for org in Organization.objects.all():
        organization_set = organization_set + str(org.getJSON())
    if len(organization_set) > 1:
        organization_set = organization_set[:-1]
    organization_set = organization_set + "]"
    print("JSON for Organizations: " + organization_set)

    data_set = "["
    for org in Organization.objects.all():
        org_log = PostActsLog.objects.filter(organization=org.shortname)
        data_set = data_set + "{\\\"abbreviation\\\":\\\"" + org.shortname + "\\\","
        data_set = data_set + "\\\"orgName\\\":\\\"" + org.name + "\\\","
        data_set = data_set + "\\\"cluster\\\":\\\"" + org.cluster + "\\\","
        ec_cnt = org_log.filter(status='Early Complete').count()
        data_set = data_set + "\\\"ec\\\":" + str(ec_cnt) + ","
        lc_cnt = org_log.filter(status='Late Complete').count()
        data_set = data_set + "\\\"lc\\\":" + str(lc_cnt) + ","
        ei_cnt = org_log.filter(status='Early Incomplete').count()
        data_set = data_set + "\\\"ei\\\":" + str(ei_cnt) + ","
        li_cnt = org_log.filter(status='Late Incomplete').count()
        data_set = data_set + "\\\"li\\\":" + str(li_cnt) + ","
        p_cnt = org_log.filter(status='Pending').count()
        data_set = data_set + "\\\"p\\\":" + str(p_cnt) + ","
        cnt = org_log.all().count() - ec_cnt - lc_cnt - ei_cnt - li_cnt - p_cnt
        data_set = data_set + "\\\"nc\\\":" + str(cnt) + "},"
    if len(data_set) > 1:
        data_set = data_set[:-1]
    data_set = data_set + "]"
    print("JSON for Data: " + data_set)

    context = {
        "organizations": organization_set,
        "data": data_set,
    }
    return context

def getSpecificContext(org):
    ""
    logs_set = "["
    for log in PostActsLog.objects.filter(organization=org.shortname):
        logs_set = logs_set + str(log.getJSON())
    if len(logs_set) > 1:
        logs_set = logs_set[:-1]
    logs_set = logs_set + "]"
    print("JSON for " + org.shortname + " Logs: " + logs_set)

    org_log = PostActsLog.objects.filter(organization=org.shortname)
    data_set = "{\"abbreviation\":\"" + org.shortname + "\","
    data_set = data_set + "\"orgName\":\"" + org.name + "\","
    data_set = data_set + "\"cluster\":\"" + org.cluster + "\","
    ec_cnt = org_log.filter(status='Early Complete').count()
    data_set = data_set + "\"ec\":" + str(ec_cnt) + ","
    lc_cnt = org_log.filter(status='Late Complete').count()
    data_set = data_set + "\"lc\":" + str(lc_cnt) + ","
    ei_cnt = org_log.filter(status='Early Incomplete').count()
    data_set = data_set + "\"ei\":" + str(ei_cnt) + ","
    li_cnt = org_log.filter(status='Late Incomplete').count()
    data_set = data_set + "\"li\":" + str(li_cnt) + ","
    p_cnt = org_log.filter(status='Pending').count()
    data_set = data_set + "\"p\":" + str(p_cnt) + ","
    cnt = org_log.all().count() - ec_cnt - lc_cnt - ei_cnt - li_cnt - p_cnt
    data_set = data_set + "\"nc\":" + str(cnt) + "}"

    print("JSON for Data: " + data_set)

    context = {
        "logs": logs_set,
        "data": json.loads(data_set),
    }
    return context

class OrgGeneralView(View):
    template_name = 'org_list/org-list.html'

    def get(self, request):
        utility.sync()
        # TODO: Spew out content of orgs list then add to context

        context = getContext()

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

                return redirect('org_list:general_orgs')
            else:
                # TODO: Spew out content of orgs list then add to context

                context = getContext()

                messages.error(request, 'Sign in failed. Your username or password is incorrect.')

                return render(request, self.template_name, context)
        elif logouts is not False:
            # If not, but contains a logout object, then it is a logout POST
            logout(request)

            # TODO: Spew out content of orgs list then add to context

            context = getContext()

            return render(request, self.template_name, context)
        else:
            return redirect('page_404:page_404')


# TODO: Placeholder class-based view, will be modified
# TODO: Embed content of general orgs list
class OrgSpecificView(View):
    template_name = 'org_list/org-specific.html'

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
        utility.sync()
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
