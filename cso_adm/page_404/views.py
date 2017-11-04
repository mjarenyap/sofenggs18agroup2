from django.shortcuts import render


# Create your views here.
# This is only for testing purposes. You may comment this out
def throw_404(request):
    template_name = 'page_404/404.html'

    return render(request, template_name)
