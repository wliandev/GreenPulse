from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import Company

def index(request):
    mycompanies = Company.objects.all().values()
    template = loader.get_template('sp500/index.html')
    context = {
        'mycompanies': mycompanies,
    }
    return HttpResponse(template.render(context, request))