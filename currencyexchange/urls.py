from django.contrib import admin
from django.urls import path, include
from .views import MyTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('superadmin/', include('superadmin.urls')),
]
