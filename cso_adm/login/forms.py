from django.contrib.auth.models import User
from django import forms


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class':'field'}))

    class Meta:
        model = User
        fields = ['username', 'password']
