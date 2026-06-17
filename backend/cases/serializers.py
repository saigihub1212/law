from rest_framework import serializers
from .models import Case, CaseDocument, CaseCertificate, CaseUpdate, CaseInvoice, CaseMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class CaseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseUpdate
        fields = '__all__'

class CaseDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseDocument
        fields = '__all__'

class CaseCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseCertificate
        fields = '__all__'

class CaseInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseInvoice
        fields = '__all__'

class CaseMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = CaseMessage
        fields = '__all__'

class CaseSerializer(serializers.ModelSerializer):
    documents = CaseDocumentSerializer(many=True, read_only=True)
    certificates = CaseCertificateSerializer(many=True, read_only=True)
    updates = CaseUpdateSerializer(many=True, read_only=True)
    invoices = CaseInvoiceSerializer(many=True, read_only=True)
    messages = CaseMessageSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    client_email = serializers.CharField(source='client.email', read_only=True)

    class Meta:
        model = Case
        fields = '__all__'
