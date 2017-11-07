from django.contrib.auth.models import User
from django import forms
from .models import PostActsLog



# class UserForm(forms.ModelForm):
#     username = forms.CharField(widget=forms.TextInput(attrs={'class': 'field', 'placeholder': 'Username',
#                                                              'id': 'input-user'}))
#     password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'field', 'placeholder': 'Password'}))
#
#     class Meta:
#         model = User
#         fields = ['username', 'password']


class UpdatePostActsForm(forms.ModelForm):
    class Meta:
        model = PostActsLog
        fields = ['status', 'checkedBy', 'dateChecked', 'comments']
