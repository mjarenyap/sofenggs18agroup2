from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

# This is only for testing purposes. You may comment this out
def test_url(request):
    template_name = 'org_list/org-list.html'
    return render(request, template_name)