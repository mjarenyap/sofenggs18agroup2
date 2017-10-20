from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.views.generic import View

from .forms import UserForm


# Create your views here.
# For user registration
class UserRegistrationView(View):
    form_class = UserForm
    template_name = 'register/registration_form.html'

    # display blank form
    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

    # process form data
    def post(self, request):
        form = self.form_class(request.POST)

        if form.is_valid():
            user = form.save(commit=False)

            # clean, normalized data
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user.set_password(password)
            user.save()

            if user is not None:
                if user.is_active:
                    login(request, user)
                    return redirect('dashboard:index')

        return render(request, self.template_name, {'form': form})
