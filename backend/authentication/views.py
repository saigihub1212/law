from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Count
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer
from .permissions import IsAdminOrSuperAdmin

User = get_user_model()

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class RegisterClientView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(role='CLIENT')
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrSuperAdmin]

    def get_queryset(self):
        return User.objects.filter(role='CLIENT').order_by('-date_joined')

    def list(self, request, *args, **kwargs):
        # We can annotate with case count if we want
        queryset = self.get_queryset()
        clients = []
        for u in queryset:
            data = UserSerializer(u).data
            data['case_count'] = u.cases.count()
            clients.append(data)
        return Response(clients)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
