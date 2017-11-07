from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import HttpResponse

# Create your views here.

# This is only for testing purposes. You may comment this out
from django.views import View


# TODO: Tester url, will be modified
# TODO: Embed content of SPECIFIC org list
def test_url(request, username):
    # TODO: implement org name validation
    template_name = 'org_list/org-specific.html'

    return render(request, template_name)


# TODO: Placeholder class-based view, will be modified
# TODO: Embed content of general orgs list
class UserFormView(View):
    template_name = 'org_list/org-list.html'

    def get(self, request):
        # TODO: Spew out content of orgs list then add to context

        context = {
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

                return redirect('org_list:index')
            else:
                # TODO: Spew out content of orgs list then add to context

                context = {
                }

                messages.error(request, 'Sign in failed. Your username or password is incorrect.')

                return render(request, self.template_name, context)
        elif logouts is not False:
            # If not, but contains a logout object, then it is a logout POST
            logout(request)

            # TODO: Spew out content of orgs list then add to context

            context = {
            }

            return render(request, self.template_name, context)
        else:
            return redirect('page_404:test_url')
