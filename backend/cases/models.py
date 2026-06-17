from django.db import models
from django.conf import settings

class Case(models.Model):
    TYPE_CHOICES = (
        ('PATENT', 'Patent'),
        ('TRADEMARK', 'Trademark'),
        ('COPYRIGHT', 'Copyright'),
        ('DESIGN', 'Design'),
    )
    STATUS_CHOICES = (
        ('DRAFTING', 'Drafting'),
        ('FILING', 'Filing'),
        ('EXAMINATION', 'Examination'),
        ('RESPONSE', 'Response'),
        ('GRANT', 'Grant'),
    )
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cases')
    case_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFTING')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.case_number} - {self.title}"

class CaseDocument(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=150)
    file = models.FileField(upload_to='case_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.case.case_number})"

class CaseCertificate(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='certificates')
    name = models.CharField(max_length=150)
    file = models.FileField(upload_to='case_certificates/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.case.case_number})"

class CaseUpdate(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='updates')
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Update for {self.case.case_number} at {self.date.strftime('%Y-%m-%d')}"

class CaseInvoice(models.Model):
    STATUS_CHOICES = (
        ('UNPAID', 'Unpaid'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
    )
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UNPAID')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.invoice_number} - {self.case.case_number} ({self.status})"

class CaseMessage(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Msg from {self.sender.email} at {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
