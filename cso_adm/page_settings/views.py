import json

from django.contrib import messages
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.models import User, Group
from django.http import HttpResponse
from django.shortcuts import render, redirect

from django.contrib.auth.decorators import user_passes_test

# # Create your views here.
# # This is only for testing purposes. You may comment this out
# def test_url(request):
#     template_name = 'page_settings/settings.html'
#     return render(request, template_name)
from django.urls import reverse
from django.views import View
from dashboard import modelJSON


def get_response_context(request):
    mod_info_set = modelJSON.get_all_moderator_info_json()
    map_set = modelJSON.get_map_values()
    response = {
        'status': 1,
        'message': "Ok",
        'mod': mod_info_set,
        'maps': map_set
    }
    return HttpResponse(json.dumps(response), content_type='application/json')


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


# TODO: Adjust accordingly to frontend changes

# Useradmin should be logged in to perform changes!
def has_group(user):
    try:
        group = Group.objects.get(name='useradmin')
    except Group.DoesNotExist:
        return False

    return group in user.groups.all()


# Remove a moderator
@user_passes_test(has_group)
def remove_moderator(request):
    # Get the relevant credentials from the POST request
    username = request.POST.get('username', False)

    # Check if the POST request is valid
    if username is not False:
        # Get the user from the given username
        user = User.objects.get(username=username)

        # Purge the user
        user.delete()

        # Then go back to the previous URL with the updated values
        response = {'status': 1, 'message': "Ok", 'url': reverse('settings:settings')}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return redirect(reverse('settings:settings'))


# Add a moderator
@user_passes_test(has_group)
def add_moderator(request):
    # Get the relevant credentials from the POST request
    first_name = request.POST.get('fn', False)
    last_name = request.POST.get('ln', False)
    username = request.POST.get('un', False)
    email = request.POST.get('em', False)
    password = request.POST.get('pw', False)

    # Check if the POST request is valid
    if first_name is not False and last_name is not False and username is not False and email is not False and password is not False:
        # Create a new user out of the given data
        user = User.objects.create_user(first_name=first_name,
                                        last_name=last_name,
                                        username=username,
                                        email=email,
                                        password=password)

        # Then add the user to the moderators group
        g = Group.objects.get(name='moderator')
        user.groups.add(g)

        # Then go back to the previous URL with the updated values
        response = {'status': 1, 'message': "Ok", 'url': reverse('settings:settings')}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return redirect(reverse('settings:settings'))


# Update a moderator
@user_passes_test(has_group)
def update_moderator(request):
    # Get the relevant credentials from the POST request
    old_username = request.POST.get('ou', False)
    username = request.POST.get('un', False)
    password = request.POST.get('pw', False)

    # Check if the POST request is valid
    if old_username is not False and username is not False and password is not False:
        # Get the user from the old username
        user = User.objects.get(username=old_username)

        # Change the relevant credentials
        user.username = username
        user.set_password(password)

        # Commit the changes to the database
        user.save()

        # Then go back to the previous URL with the updated values
        response = {'status': 1, 'message': "Ok", 'url': reverse('settings:settings')}

        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        return redirect(reverse('settings:settings'))
