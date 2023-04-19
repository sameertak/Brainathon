import csv

from django.db import transaction, connection
from django.http import HttpResponse
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
    def post(request):
        try:
            page = (int(request.data["pg"]) - 1) * 10
            q = f"SELECT * FROM superadmin_countrymodel"
            queryset = CountryModel.objects.raw(q)
            serializer = CountrySerializers(queryset, many=True)
            count = len(serializer.data)
            q = f"SELECT * FROM superadmin_countrymodel LIMIT '10' OFFSET '{page}'"
            queryset = CountryModel.objects.raw(q)
            serializer = CountrySerializers(queryset, many=True)

            return Response(
                data={"message": "Data Fetched", "data": serializer.data, "count": count},
                status=status.HTTP_200_OK
            )

        except:
            return Response(
                data={"message": "Data Cannot Be Fetched", "data": None},
                status=status.HTTP_400_BAD_REQUEST
            )


class DataCountry(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def get(request):
        try:
            response = HttpResponse(content_type='application/pcap')
            response['Content-Disposition'] = 'attachment; filename="country data.csv"'

            writer = csv.writer(response)
            writer.writerow(
                ['Country Name', 'Country Currency Code', 'Status'])

            q = "SELECT * FROM superadmin_countrymodel"
            queryset = CountryModel.objects.raw(q)
            serializer = CountrySerializers(queryset, many=True)

            for ele in serializer.data:
                writer.writerow(list(ele.values())[1:])

            return response
        except:
            return Response(data={'message': 'Unable to access the data'}, status=status.HTTP_400_BAD_REQUEST)


class GetRates(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        # try:

        res = request.data
        global serializer1

        page = (int(res["pg"]) - 1) * 10
        q = f"SELECT * FROM superadmin_exchangemodel WHERE from_id='{res['from_id']}'"
        queryset = ExchangeModel.objects.raw(q)
        serializer1 = ExchangeSerializers(queryset, many=True)
        count = len(serializer1.data)

        q = f"SELECT * FROM superadmin_exchangemodel WHERE from_id='{res['from_id']}' LIMIT '10' OFFSET '{page}'"
        queryset = ExchangeModel.objects.raw(q)
        serializer = ExchangeSerializers(queryset, many=True)

        return Response(
            data={"message": "Data Fetched", "data": serializer.data, "count": count},
            status=status.HTTP_200_OK
        )

    # except:
    #     return Response(
    #         data={"message": "Data Cannot Be Fetched", "data": None},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    @staticmethod
    def get(request):
        try:
            response = HttpResponse(content_type='application/pcap')
            response['Content-Disposition'] = 'attachment; filename="Country Currency.csv"'

            writer = csv.writer(response)
            writer.writerow(
                ['FROM', 'TO', 'RATES'])

            for ele in serializer1.data:
                writer.writerow(list(ele.values())[1:])

            return response
        except:
            return Response(data={'message': 'Unable to access the data'}, status=status.HTTP_400_BAD_REQUEST)


class ChangeRates(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        # try:
        res = request.data

        # Checks if the Exchange country ID exists in DB or not.
        from_ID = res['from_id']

        if ExchangeModel.objects.filter(from_id=res['from_id'], to_id=res['to_id']):

            with transaction.atomic():
                to_id_new = {}
                q = f"UPDATE superadmin_exchangeModel SET rate='{res['rates']}' WHERE from_id='{res['from_id']}' AND to_id='{res['to_id']}'"
                ExchangeModel.objects.raw(q)

                updated_rate = ExchangeModel.objects.select_for_update().filter(from_id=res['from_id'])
                new_rate = ExchangeModel.objects.select_for_update()

                for i in updated_rate:
                    if res['to_id'] == i.to_id:
                        rate = float(res['rates'])
                        i.rate = rate
                        i.save()

                for i in new_rate:
                    if res['to_id'] == i.from_id and res['to_id'] != i.to_id:
                        to_id_new[i.to_id] = float(i.rate)

                for ele in to_id_new:

                    if from_ID != ele:
                        try:
                            rate = ExchangeModel.objects.get(from_id=res['to_id'], to_id=ele)

                            from_obj = ExchangeModel.objects.get(from_id=from_ID, to_id=ele)

                            print(rate, rate.rate, float(res['rates']))
                            from_obj.rate = rate.rate * float(res['rates'])
                            from_obj.save()
                        except:
                            pass

            model1 = ExchangeModel.objects.filter()

            for model_elements in model1:
                if model_elements.from_id != res['to_id']:
                    reverse_model, create = ExchangeModel.objects.get_or_create(to_id=model_elements.from_id,
                                                                                from_id=model_elements.to_id)
                    reverse_model.rate = 1 / model_elements.rate
                    reverse_model.save()

            return Response(
                data={"message": "Data Fetched", "data": 'asd'},
                status=status.HTTP_200_OK
            )

        # If it is not present then creates it in the database.
        else:
            ExchangeModel(
                from_id=res['from_id'],
                to_id=res['to_id'],
                rate=res['rates']
            ).save()

            # Inverse Relation
            ExchangeModel(
                to_id=res['from_id'],
                from_id=res['to_id'],
                rate=1 / float(res['rates'])
            ).save()

            return Response(
                data={
                    "message": "Exchange rate of these countries are not available, kindly add a new one!"
                },
                status=status.HTTP_404_NOT_FOUND
            )


class AddCountry(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):

        try:
            res = request.data

            if CountryModel.objects.filter(country_name=res['country_name']):
                return Response(
                    data={
                        "message": "Country already exits! Please choose different country"
                    }
                )

            CountryModel(
                country_id=res['country_id'],
                country_name=res['country_name'],
                status=True
            ).save()

            ExchangeModel(
                # country_name_id = CountryModel.objects.get(country_id=res['country_id'], country_name=res['country_name']).id,
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
                        rate=i.rate * int(res['rates'])
                    ).save()

            return Response(
                data={
                    "message": "Data Added Successfully!"
                },
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                data={
                    "message": "Data cannot be added :("
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class GetCountryUser(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def get(request):
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
            updated_country.save()

            updated_country = ExchangeModel.objects.filter(from_id=res['prev_country'])
            print(updated_country)
            for object in updated_country:
                object.from_id = res['country_id']
                object.save()

            updated_country = ExchangeModel.objects.filter(to_id=res['prev_country'])
            for object in updated_country:
                object.to_id = res['country_id']
                object.save()

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

            country_id = CountryModel.objects.get(id=res['id']).country_id

            with transaction.atomic():
                delete_emp = CountryModel.objects.select_for_update().get(id=res['id'])
                delete_emp.delete()

                delete_emp = ExchangeModel.objects.select_for_update().filter(from_id=country_id)
                delete_emp.delete()

                delete_emp = ExchangeModel.objects.select_for_update().filter(to_id=country_id)
                delete_emp.delete()

            return Response(
                data={"message": "Deleted Successfully!"},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                data={"message": "Cannot process your request, try again later!"},
                status=status.HTTP_400_BAD_REQUEST
            )


class DeleteRates(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        try:
            res = request.data

            with transaction.atomic():
                delete_emp = ExchangeModel.objects.select_for_update().filter(from_id=res['from_id'], to_id=res['to_id'])
                delete_emp.delete()
                delete_emp = ExchangeModel.objects.select_for_update().filter(to_id=res['from_id'], from_id=res['to_id'])
                delete_emp.delete()

            return Response(
                data={"message": "Deleted Successfully!"},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                data={"message": "Cannot process your request, try again later!"},
                status=status.HTTP_400_BAD_REQUEST
            )


class CurrencyStatus(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        res = request.data

        exchange = ExchangeModel.objects.get(from_id=res['from_id'], to_id=res['to_id'])
        exchange.status = res['status']
        exchange.save()

        try:
            exchange = ExchangeModel.objects.get(to_id=res['from_id'], from_id=res['to_id'])
            exchange.status = res['status']
            exchange.save()
        except:
            pass

        return Response(
            data={"message" : "Exchange Rate Status Updated!"},
            status=status.HTTP_200_OK
        )


class CountryStatus(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        res = request.data

        country = CountryModel.objects.get(id=res['id'])
        country.status = res['status']
        country.save()

        exchange = ExchangeModel.objects.filter(from_id=res['country_id'])
        for modelObj in exchange:
            modelObj.status = res['status']
            modelObj.save()

        exchange = ExchangeModel.objects.filter(to_id=res['country_id'])
        for modelObj in exchange:
            modelObj.status = res['status']
            modelObj.save()


        return Response(
            data={"message": "Country Status Updated!"},
            status=status.HTTP_200_OK
        )

class ActiveCurrency(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        res = request.data

        q = f"SELECT * FROM superadmin_exchangemodel WHERE from_id='{res['from_id']}' AND status='1'"
        queryset = ExchangeModel.objects.raw(q)
        serializer = ExchangeSerializers(queryset, many=True)

        return Response(
            data={"data" : serializer.data}
        )

class GetRatesOnly(APIView):
    permission_classes = [AllowAny]
    @staticmethod
    def post(request):
        res = request.data

        q = f"SELECT id,rate FROM superadmin_exchangemodel WHERE from_id='{res['from_id']}' AND to_id='{res['to_id']}'"
        queryset = ExchangeModel.objects.raw(q)
        serializer = ExchangeSerializers(queryset, many=True)

        return Response(
            data={"data": serializer.data}
        )

class GetRatesUser(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        # try:

        res = request.data
        q = f"SELECT * FROM superadmin_exchangemodel WHERE from_id='{res['from_id']}' AND status='1'"
        queryset = ExchangeModel.objects.raw(q)
        serializer = ExchangeSerializers(queryset, many=True)
        return Response(
            data={"data": serializer.data}
        )

class AddRates(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        res = request.data
        try:
            ExchangeModel.objects.get(from_id=res['from_id'], to_id=res['to_id'])
            return Response(
                data={"message": "Exchange Rate Already Exits!"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except:
            if (CountryModel.objects.filter(country_id=res['from_id'])) and (CountryModel.objects.filter(country_id=res['to_id'])):
                if (res['from_id'] != res['to_id']):
                    ExchangeModel(
                        from_id = res['from_id'],
                        to_id = res['to_id'],
                        rate = res['rate']
                    ).save()

                    ExchangeModel(
                        to_id=res['from_id'],
                        from_id=res['to_id'],
                        rate=1/float(res['rate'])
                    ).save()
                else:
                    return Response(
                        data={"message": "ERROR"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    data={"message": "ERROR"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            data={"message": "Data Added Successfully!"},
            status=status.HTTP_200_OK
        )