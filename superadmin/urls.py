from django.urls import path

from .views import GetCountry, GetRates, ChangeRates, AddCountry, GetCountryUser, EditCountry, DeleteCountry, \
    DataCountry, DeleteRates, CountryStatus, CurrencyStatus, ActiveCurrency, GetRatesOnly, GetRatesUser, AddRates

urlpatterns = [
    path("countries/", GetCountry.as_view()),
    path("country/data/", DataCountry.as_view()),
    path("rates/", GetRates.as_view()),
    path("changerates/", ChangeRates.as_view()),
    path("addcountry/", AddCountry.as_view()),
    path("getcountry/", GetCountryUser.as_view()),
    path("editcountry/", EditCountry.as_view()),
    path("deletecountry/", DeleteCountry.as_view()),
    path("deleterate/", DeleteRates.as_view()),
    path("countrystatus/", CountryStatus.as_view()),
    path("ratestatus/", CurrencyStatus.as_view()),
    path("activerates/", ActiveCurrency.as_view()),
    path("getrates/", GetRatesOnly.as_view()),
    path("userrates/", GetRatesUser.as_view()),
    path("addrates/", AddRates.as_view())
]
