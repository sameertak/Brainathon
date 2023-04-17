from django.contrib import admin
from .models import ExchangeModel, CountryModel
# Register your models here.
admin.site.register(ExchangeModel)
admin.site.register(CountryModel)