# Create your views here.
from django.shortcuts import render


def login_failed(request):
    return render(request, 'login/login.html')
