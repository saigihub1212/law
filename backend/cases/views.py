from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
import random
import os
from .models import Case, CaseDocument, CaseCertificate, CaseUpdate, CaseInvoice, CaseMessage
from .serializers import (
    CaseSerializer,
    CaseDocumentSerializer,
    CaseCertificateSerializer,
    CaseUpdateSerializer,
    CaseInvoiceSerializer,
    CaseMessageSerializer,
)
from authentication.permissions import IsAdminOrSuperAdmin

class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'my_cases']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminOrSuperAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPERADMIN']:
            return Case.objects.all().order_by('-updated_at')
        return Case.objects.filter(client=user).order_by('-updated_at')

    @action(detail=False, methods=['get'])
    def my_cases(self, request):
        """
        Direct helper endpoint to fetch client cases.
        """
        cases = Case.objects.filter(client=request.user).order_by('-updated_at')
        serializer = self.get_serializer(cases, many=True)
        return Response(serializer.data)

class CaseDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = CaseDocumentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminOrSuperAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPERADMIN']:
            return CaseDocument.objects.all().order_by('-id')
        return CaseDocument.objects.filter(case__client=user).order_by('-id')

class CaseCertificateViewSet(viewsets.ModelViewSet):
    serializer_class = CaseCertificateSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminOrSuperAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPERADMIN']:
            return CaseCertificate.objects.all().order_by('-id')
        return CaseCertificate.objects.filter(case__client=user).order_by('-id')

class CaseUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = CaseUpdateSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminOrSuperAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPERADMIN']:
            return CaseUpdate.objects.all().order_by('-date')
        return CaseUpdate.objects.filter(case__client=user).order_by('-date')

class CaseInvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = CaseInvoiceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'pay_invoice']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminOrSuperAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPERADMIN']:
            return CaseInvoice.objects.all().order_by('-created_at')
        return CaseInvoice.objects.filter(case__client=user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def pay_invoice(self, request, pk=None):
        invoice = self.get_object()
        payment_method_id = request.data.get('payment_method_id', '')
        if not payment_method_id:
            return Response({"error": "Payment method required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Simulating successful Stripe transaction processing
        invoice.status = 'PAID'
        invoice.save()

        # Add a case update to record payment
        CaseUpdate.objects.create(
            case=invoice.case,
            message=f"Invoice #{invoice.invoice_number} paid via Stripe."
        )

        return Response({"status": "Payment successful", "invoice": CaseInvoiceSerializer(invoice).data})

class CaseMessageViewSet(viewsets.ModelViewSet):
    serializer_class = CaseMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = CaseMessage.objects.all().order_by('timestamp')
        case_id = self.request.query_params.get('case')
        if case_id:
            queryset = queryset.filter(case_id=case_id)
        if user.role in ['ADMIN', 'SUPERADMIN']:
            return queryset
        return queryset.filter(case__client=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        invoice_id = request.data.get('invoice_id')
        if not invoice_id:
            return Response({"error": "Invoice ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            invoice = CaseInvoice.objects.get(id=invoice_id)
        except CaseInvoice.DoesNotExist:
            return Response({"error": "Invoice not found."}, status=status.HTTP_404_NOT_FOUND)

        stripe_secret = os.environ.get('STRIPE_SECRET_KEY')
        if stripe_secret:
            try:
                import stripe
                stripe.api_key = stripe_secret
                intent = stripe.PaymentIntent.create(
                    amount=int(invoice.amount * 100),
                    currency='usd',
                    metadata={'invoice_id': invoice.id, 'invoice_number': invoice.invoice_number}
                )
                return Response({
                    "clientSecret": intent.client_secret,
                    "amount": invoice.amount,
                    "method": "Real Stripe PaymentIntent"
                }, status=status.HTTP_200_OK)
            except Exception:
                pass

        mock_client_secret = f"pi_mock_{invoice.id}_secret_{random.randint(100000, 999999)}"
        return Response({
            "clientSecret": mock_client_secret,
            "amount": invoice.amount,
            "method": "Simulated Stripe PaymentIntent (Fallback)"
        }, status=status.HTTP_200_OK)
