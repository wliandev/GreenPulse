from django.shortcuts import render
from django.http import HttpResponse, Http404


def index(request):
    return render(request, "sp500/index.html")

