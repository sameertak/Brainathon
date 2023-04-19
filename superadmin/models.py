from django.db import models

# Create your models here.


class CountryModel(models.Model):
    country_id = models.CharField(max_length=3)
    country_name = models.CharField(max_length=30, default='')
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.country_name


class ExchangeModel(models.Model):
    # country_name=models.ForeignKey(CountryModel, on_delete=models.CASCADE)
    from_id = models.CharField(max_length=3)
    to_id = models.CharField(max_length=3)
    rate = models.FloatField(null=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.from_id} to {self.to_id}'

