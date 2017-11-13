from django.contrib import messages
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.mixins import UserPassesTestMixin
from django.shortcuts import render, redirect

# # Create your views here.
# # This is only for testing purposes. You may comment this out
# def test_url(request):
#     template_name = 'page_settings/settings.html'
#     return render(request, template_name)
from django.views import View


class SettingsView(UserPassesTestMixin, View):
    template_name = 'page_settings/settings.html'

    def test_func(self):
        return self.request.user.groups.filter(name='useradmin').exists()

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

                return redirect('settings:settings')
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

            return redirect('dashboard:index')
        else:
            return redirect('page_404:page_404')
