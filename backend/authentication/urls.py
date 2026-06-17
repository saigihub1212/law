from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserProfileView,
    RegisterClientView,
    ClientListView,
    ChangePasswordView,
)

urlpatterns = [
    # JWT authentication
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Custom endpoints
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('register-client/', RegisterClientView.as_view(), name='register_client'),
    path('clients/', ClientListView.as_view(), name='client_list'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
