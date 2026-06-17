import csv
from django.http import HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Consultation
from .serializers import ConsultationSerializer, ConsultationAdminSerializer, ConsultationPublicSerializer
from authentication.permissions import IsAdminOrSuperAdmin

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return ConsultationPublicSerializer
        if user.role in ['ADMIN', 'SUPERADMIN']:
            return ConsultationAdminSerializer
        return ConsultationSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['list', 'retrieve', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminOrSuperAdmin]
        # Allow anyone to check availability of dates (public list by date)
        if self.action == 'list' and self.request.query_params.get('date'):
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            if user.role in ['ADMIN', 'SUPERADMIN']:
                queryset = Consultation.objects.all().order_by('-created_at')
            else:
                queryset = Consultation.objects.filter(email=user.email).order_by('-created_at')
        else:
            date_filter = self.request.query_params.get('date')
            if date_filter:
                queryset = Consultation.objects.filter(date=date_filter).order_by('-created_at')
            else:
                return Consultation.objects.none()

        # Searching and filtering
        search = self.request.query_params.get('search')
        status_filter = self.request.query_params.get('status')
        service_filter = self.request.query_params.get('service')
        
        if search and user and user.is_authenticated and user.role in ['ADMIN', 'SUPERADMIN']:
            queryset = queryset.filter(
                name__icontains=search
            ) | queryset.filter(
                email__icontains=search
            ) | queryset.filter(
                phone__icontains=search
            )
            
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        if service_filter:
            queryset = queryset.filter(service=service_filter)
            
        return queryset

    def perform_create(self, serializer):
        consultation = serializer.save()
        
        # Format dates nicely for printouts
        date_str = consultation.date.strftime('%B %d, %Y')
        time_str = consultation.time
        
        # Send mail notifications
        subject_admin = f"New Consultation Request: {consultation.name} - {consultation.service}"
        msg_admin = f"""
Hello SR4IPR Partners Admin,

A new consultation request has been received on the website.

Client Name: {consultation.name}
Email Address: {consultation.email}
Phone Number: {consultation.phone}
Preferred Date: {date_str}
Preferred Time: {time_str}
Practice Area: {consultation.service}

Message / Details:
{consultation.message or 'No message provided.'}

Manage this lead at http://localhost:5173/admin/consultations
"""

        subject_client = "Consultation Request Received - SR4IPR Partners"
        msg_client = f"""
Dear {consultation.name},

Thank you for reaching out to SR4IPR Partners. We have received your request to book a consultation session.

Booking Details:
- Practice Area: {consultation.service}
- Requested Date: {date_str}
- Requested Time: {time_str}

One of our IP specialists will review your enquiry and get in touch with you shortly to finalize the meeting link (Google Meet / Zoom).

Sincerely,
SR4IPR Partners Team
https://www.sr4ipr.com
"""
        
        # Trigger emails asynchronously / safely in fallback try-except
        try:
            # Alert Admin
            send_mail(
                subject_admin,
                msg_admin,
                settings.DEFAULT_FROM_EMAIL or 'noreply@sr4ipr.com',
                [settings.DEFAULT_FROM_EMAIL or 'info@sr4ipr.com'],
                fail_silently=True
            )
            # Alert Client
            send_mail(
                subject_client,
                msg_client,
                settings.DEFAULT_FROM_EMAIL or 'noreply@sr4ipr.com',
                [consultation.email],
                fail_silently=True
            )
        except Exception:
            # Fallback if SMTP fails or isn't set up
            pass

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="consultation_requests.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Service', 'Status', 'Assigned Lawyer', 'Notes', 'Created At'])
        
        for item in queryset:
            writer.writerow([
                item.id,
                item.name,
                item.email,
                item.phone,
                item.date,
                item.time,
                item.service,
                item.get_status_display(),
                item.assigned_lawyer or '',
                item.notes or '',
                item.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
            
        return response
