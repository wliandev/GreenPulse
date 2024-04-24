from errno import EMSGSIZE
from re import S
from tkinter import E, scrolledtext
from django.db import models

class Company(models.Model):
    symbol = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255, null=True)
    E = models.CharField(max_length=255, null=True)
    S = models.CharField(max_length=255, null=True)
    G = models.CharField(max_length=255, null=True)
    ESG = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.symbol


