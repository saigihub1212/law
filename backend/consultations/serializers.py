from rest_framework import serializers
from .models import Consultation

class ConsultationPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = ('id', 'date', 'time', 'service', 'status')

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ('id', 'status', 'created_at', 'assigned_lawyer', 'notes')

class ConsultationAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ('id', 'created_at')
