from django.shortcuts import render

# Create your views here.
# This is only for testing purposes. You may comment this out
def test_url(request):
    template_name = 'org_specific/org-specific.html'
    return render(request, template_name)