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

# myindustries = [
#     "Software & Services", 
#     "Diversified Financials", 
#     "Media", 
#     "Commercial Services",
#     "Transportation", 
#     "Building Products",
#     "Retailing",
#     " ",
#     "Construction Materials",
#     "Oil & Gas Producers",
#     "Consumer Durables",
#     "Banks",
#     "Pharmaceuticals",
#     "Diversified Metals",
#     "Steel",
#     "Automobiles",
#     "Technology Hardware",
#     "Food Products",
#     "Machinery",
#     "Homebuilders",
#     "Canada Fund Canadian Small/Mid Cap Equity",
#     "Canada Fund Global Corporate Fixed Income",
#     "Canada Fund Emerging Markets Equity",
#     "Semiconductors",
#     "Textiles & Apparel",
#     "Insurance",
#     "Utilities",
#     "Precious Metals",
#     "Industrial Conglomerates",
#     "Aerospace & Defense",
#     "Refiners & Pipelines",
#     "Chemicals",
#     "Energy Services",
#     "Food Retailers",
#     "Construction & Engineering",
#     "Real Estate",
#     "Australia Fund Equity Global Technology",
#     "Traders & Distributors",
#     "Paper & Forestry",
#     "Containers & Packaging",
#     "Household Products",
#     "Consumer Services",
#     "EAA Fund Other Equity",
#     "Healthcare",
#     "Auto Components",
#     "Telecommunication Services" ]