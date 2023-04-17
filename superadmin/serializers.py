from rest_framework import serializers
from .models import CountryModel, ExchangeModel


class CountrySerializers(serializers.ModelSerializer):
    class Meta:
        model = CountryModel
        fields = '__all__'


class ExchangeSerializers(serializers.ModelSerializer):
    class Meta:
        model = ExchangeModel
        fields = '__all__'