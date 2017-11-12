from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import HttpResponse

# Create your views here.

# This is only for testing purposes. You may comment this out
from django.views import View
from dashboard.models import PostActsLog, Organization

# # TODO: Tester url, will be modified
# # TODO: Embed content of SPECIFIC org list
# def test_url(request, username):
#     # TODO: implement org name validation
#     template_name = 'org_list/org-specific.html'
#
#     return render(request, template_name)

# TODO: Placeholder class-based view, will be modified
# TODO: Embed content of general orgs list
from dashboard.models import Organization

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

    data_set = "["
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
        "logs": logs_set,
        "data": data_set,
    }
    return context

class OrgGeneralView(View):
    template_name = 'org_list/org-list.html'

    def get(self, request):
        # TODO: Spew out content of orgs list then add to context

        context = getContext()

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

                return redirect('org_list:index')
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
            return redirect('page_404:test_url')


# TODO: Placeholder class-based view, will be modified
# TODO: Embed content of general orgs list
class OrgSpecificView(View):
    template_name = 'org_list/org-specific.html'

    def get(self, request, org_name):
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
    def post(self, request):
        username = request.POST.get('username', False)
        password = request.POST.get('password', False)
        logouts = request.POST.get('logout', False)

        # If the username and password objects exist in the request dictionary, then it is a login POST
        if username is not False and password is not False:
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)

                return redirect('org_list:index')
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
            return redirect('page_404:test_url')
