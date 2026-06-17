from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CaseViewSet,
    CaseDocumentViewSet,
    CaseCertificateViewSet,
    CaseUpdateViewSet,
    CaseInvoiceViewSet,
    CaseMessageViewSet,
    CreatePaymentIntentView,
)

router = DefaultRouter()
router.register('cases', CaseViewSet, basename='case')
router.register('documents', CaseDocumentViewSet, basename='document')
router.register('certificates', CaseCertificateViewSet, basename='certificate')
router.register('updates', CaseUpdateViewSet, basename='update')
router.register('invoices', CaseInvoiceViewSet, basename='invoice')
router.register('messages', CaseMessageViewSet, basename='message')

urlpatterns = [
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create_payment_intent'),
    path('', include(router.urls)),
]
