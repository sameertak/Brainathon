from django.urls import path

from .views import GetCountry, GetRates, ChangeRates, AddCountry, GetCountryUser, EditCountry, DeleteCountry

urlpatterns = [
    path("countries/", GetCountry.as_view()),
    path("rates/", GetRates.as_view()),
    path("changerates/", ChangeRates.as_view()),
    path("addcountry/", AddCountry.as_view()),
    path("getcountry/", GetCountryUser.as_view()),
    path("editcountry/", EditCountry.as_view()),
    path("deletecountry/", DeleteCountry.as_view())
]
