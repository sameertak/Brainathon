from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.http import urlsafe_base64_decode
from rest_framework import generics, status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        data['role'] = self.user.groups.values_list('name', flat=True)

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class VerifyToken(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self,request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response(
                    data={
                        "message" : "Token is not valid any more"
                    },
                        status=status.HTTP_401_UNAUTHORIZED
                )

            return Response(
                data={
                    "message" : "Credentials are Valid",
                    "uidb64" : uidb64,
                    "token" : token
                },
                status=status.HTTP_200_OK
            )

        except DjangoUnicodeDecodeError as identifier:
            return Response(
                data={
                    "message": "Token is not valid any more"
                },
                    status=status.HTTP_401_UNAUTHORIZED
            )