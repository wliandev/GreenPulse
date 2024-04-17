from tkinter import scrolledtext
from django.db import models

class Company(models.Model):
    symbol = models.CharField(max_length=255)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.symbol


