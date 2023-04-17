from django.db import transaction
from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CountryModel, ExchangeModel
from .serializers import CountrySerializers, ExchangeSerializers


class GetCountry(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def get(request):
        try:
            q = "SELECT * FROM superadmin_countrymodel"
            queryset = CountryModel.objects.raw(q)
            serializer = CountrySerializers(queryset, many=True)

            return Response(
                data={"message": "Data Fetched", "data": serializer.data},
                status=status.HTTP_200_OK
            )

        except:
            return Response(
                data={"message": "Data Cannot Be Fetched", "data": None},
                status=status.HTTP_400_BAD_REQUEST
            )


class GetRates(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        try:
            res = request.data
            q = f"SELECT * FROM superadmin_exchangemodel WHERE from_id='{res['from_id']}'"
            queryset = ExchangeModel.objects.raw(q)
            serializer = ExchangeSerializers(queryset, many=True)
            return Response(
                data={"message": "Data Fetched", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                data={"message": "Data Cannot Be Fetched", "data": None},
                status=status.HTTP_400_BAD_REQUEST
            )


class ChangeRates(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        # try:
            res = request.data


            with transaction.atomic():
                q = f"UPDATE superadmin_exchangeModel SET rate='{res['rates']}' WHERE from_id='{res['from_id']}' AND to_id='{res['to_id']}'"
                ExchangeModel.objects.raw(q)
                updated_rate = ExchangeModel.objects.select_for_update().filter(from_id=res['from_id'])

                for i in updated_rate:
                    if res['to_id'] == i.to_id:
                        percentage = i.rate/float(res['rates'])
                        i.rate = res['rates']
                        i.country_name_id = CountryModel.objects.get(country_id=res['from_id']).id
                        i.save()

                for i in updated_rate:
                    if res['to_id'] != i.to_id:
                        i.country_name_id = CountryModel.objects.get(country_id=res['from_id']).id
                        i.rate *= percentage
                        i.save()

            return Response(
                data={"message": "Data Fetched", "data": 'asd'},
                status=status.HTTP_200_OK
            )

        # except:
        #     return Response(
        #         data={"message": "Data Cannot Be Fetched", "data": None},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )


class AddCountry(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):

        # try:
            res = request.data

            if CountryModel.objects.filter(country_name=res['country_name']):
                return Response(
                    data={
                        "message": "Country already exits! Please choose different country"
                    }
                )


            CountryModel(
                country_id = res['country_id'],
                country_name=res['country_name'],
                status=True
            ).save()

            ExchangeModel(
                country_name_id = CountryModel.objects.get(country_id=res['country_id'], country_name=res['country_name']).id,
                from_id=res['country_id'],
                to_id=res['to_id'],
                rate=res['rates']
            ).save()

            with transaction.atomic():
                q = f"UPDATE superadmin_exchangeModel SET rate='{res['rates']}' WHERE from_id='{res['country_id']}' AND to_id='{res['to_id']}'"
                ExchangeModel.objects.raw(q)
                updated_rate = ExchangeModel.objects.filter(from_id=res['to_id'])

                for i in updated_rate:
                    ExchangeModel(
                        from_id=res['country_id'],
                        to_id=i.to_id,
                        rate=i.rate*int(res['rates'])
                    ).save()

            return Response(
                data={
                    "message" : "Data Added Successfully!"
                },
                status=status.HTTP_200_OK
            )
        # except:
        #     return Response(
        #         data={
        #         "message" : "Data cannot be added :("
        #         },
        #         status=status.HTTP_400_BAD_REQUEST
        #     )


class GetCountryUser(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        res = request.data
        q = "SELECT * FROM superadmin_countrymodel WHERE status=1"
        queryset = CountryModel.objects.raw(q)
        serializer = CountrySerializers(queryset, many=True)
        return Response(
            data={"message": "Data Fetched", "data": serializer.data},
            status=status.HTTP_200_OK
        )


class EditCountry(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        res = request.data

        with transaction.atomic():
            q = f"UPDATE superadmin_countrymodel SET country_id='{res['country_id']}' AND country_name='{res['country_name']}' WHERE id='{res['id']}'"
            CountryModel.objects.raw(q)
            updated_country = CountryModel.objects.select_for_update().get(id=res['id'])
            updated_country.country_id = res['country_id']
            updated_country.country_name = res['country_name']
            updated_country.status = res['status']
            updated_country.save()

        return Response(
            data={"message": "Data updated successfully!"},
            status=status.HTTP_200_OK
        )


class DeleteCountry(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        try:
            res = request.data

            with transaction.atomic():
                delete_emp = CountryModel.objects.select_for_update().get(id=res['id'])
                delete_emp.delete()

            return Response(
                data={"message" : "Deleted Successfully!"},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                data={"message": "Cannot process your request, try again later!"},
                status=status.HTTP_400_BAD_REQUEST
            )


