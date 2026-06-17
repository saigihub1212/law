from django.db import models

class PageContent(models.Model):
    page_name = models.CharField(max_length=50, unique=True) # e.g. 'home', 'about'
    content = models.JSONField(default=dict) # key-value pair of editable sections

    def __str__(self):
        return self.page_name

class Service(models.Model):
    CATEGORY_CHOICES = (
        ('PATENT', 'Patent Services'),
        ('TRADEMARK', 'Trademark Services'),
        ('COPYRIGHT', 'Copyright Services'),
        ('DESIGN', 'Design Registration'),
        ('GI', 'Geographical Indication (GI)'),
        ('LITIGATION', 'Litigation & Enforcement'),
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    short_desc = models.TextField()
    long_desc = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, default='Scale') # Lucide icon name
    details_list = models.JSONField(default=list) # key points / sub-services

    def __str__(self):
        return self.name

class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    image_url = models.TextField(blank=True, null=True)
    bio = models.TextField()
    qualifications = models.CharField(max_length=200, blank=True, null=True)
    experience = models.CharField(max_length=50, blank=True, null=True) # e.g. "12+ Years"
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.name

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    category = models.CharField(max_length=50, default='General') # General, Patent, Trademark, etc.

    def __str__(self):
        return self.question[:50]

class Testimonial(models.Model):
    client_name = models.CharField(max_length=100)
    client_role = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    feedback = models.TextField()
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.client_name} - {self.company}"

class Blog(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True)
    summary = models.TextField()
    content = models.TextField() # Markdown or rich HTML
    category = models.CharField(max_length=100, default='IPR Updates')
    image_url = models.TextField(blank=True, null=True)
    seo_title = models.CharField(max_length=200, blank=True, null=True)
    seo_description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.title

class SEOConfig(models.Model):
    route_path = models.CharField(max_length=100, unique=True) # e.g. '/', '/about', '/services/patent'
    title = models.CharField(max_length=200)
    meta_description = models.TextField()
    keywords = models.TextField(blank=True, null=True) # comma separated
    og_image = models.TextField(blank=True, null=True)
    canonical_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.route_path
