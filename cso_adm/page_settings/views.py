import json

from django.contrib import messages
from django.contrib.auth import logout, authenticate, login, update_session_auth_hash
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.models import User, Group
from django.http import HttpResponse
from django.shortcuts import render, redirect

from django.contrib.auth.decorators import user_passes_test

from dashboard.models import Map
# # Create your views here.
# # This is only for testing purposes. You may comment this out
# def test_url(request):
#     template_name = 'page_settings/settings.html'
#     return render(request, template_name)
from django.urls import reverse
from django.views import View
from dashboard import modelJSON
from dashboard import utility


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

    login_url = '/'

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

        curr_username = request.POST.get('un', False)
        old_password = request.POST.get('op', False)
        new_password = request.POST.get('pw', False)

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
        elif curr_username is not False and old_password is not False and new_password is not False:
            # Check if the old password is correct
            if request.user.check_password(old_password):
                print("Password correct")

                # Get the user from the old username
                user = User.objects.get(username=curr_username)

                # Change the relevant credentials
                user.set_password(new_password)

                # Commit the changes to the database
                user.save()

                # Refresh the session, reflecting the new password
                update_session_auth_hash(request, user)

                # Then go back to the previous URL with the updated values
                context = {
                }

                return render(request, self.template_name, context)
            else:
                # Throw an incorrect old password error
                context = {
                }

                messages.error(request, 'Password reset failed. The old password you entered was incorrect.')

                return render(request, self.template_name, context)
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
    username = request.POST.get('un0', False)

    # Check if the POST request is valid (if at least one user gets deleted)
    if username is not False:
        users_deleted = 0

        # For every succeeding user
        while username is not False:
            try:
                # Get the user from the given username
                user = User.objects.get(username=username)

                # Purge the user
                user.delete()

                # Increment the deleted users
                users_deleted += 1

                # Try to go to the next user
                key = 'un' + str(users_deleted)

                # Get the relevant credentials from the POST request
                username = request.POST.get(key, False)
            except User.DoesNotExist:
                break

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


def set_default_term(request):
    term = request.POST.get('term', '')
    if term != '':
        map = Map.objects.get(key='default_term')
        map.value = term
        map.save()
    return redirect(reverse('settings:settings'))


def change_worksheet_settings(request):
    worksheet_key = request.POST.get('worksheet_key', '')
    sheet_name = request.POST.get('sheet_name', '')
    start_row = request.POST.get('start_row', '')

    timestamp = request.POST.get('worksheet_key', '')
    activity_title = request.POST.get('worksheet_key', '')
    term = request.POST.get('worksheet_key', '')
    organization = request.POST.get('worksheet_key', '')

    current_worksheet_key = Map.objects.get(key='worksheet_key').value
    current_sheet_name = Map.objects.get(key='sheet_name').value

    if current_worksheet_key != worksheet_key or current_sheet_name != sheet_name:
        if utility.check_worksheet(worksheet_key, sheet_name):
            m = Map.objects.get(key='worksheet_key')
            m.value = worksheet_key
            m.save()

            m = Map.objects.get(key='sheet_name')
            m.value = sheet_name
            m.save()

            m = Map.objects.get(key='start_row')
            m.value = sheet_name
            m.save()

            # save other attributes

            utility.change_worksheet()
    else:
        ""
        # save other attributes
