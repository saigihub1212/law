from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from django.utils.text import slugify
from .models import PageContent, Service, TeamMember, FAQ, Testimonial, Blog, SEOConfig
from .serializers import (
    PageContentSerializer,
    ServiceSerializer,
    TeamMemberSerializer,
    FAQSerializer,
    TestimonialSerializer,
    BlogSerializer,
    SEOConfigSerializer,
)
from authentication.permissions import IsAdminOrSuperAdmin

class BaseCmsViewSet(viewsets.ModelViewSet):
    """
    Base viewset for CMS where GET requests are public, and modify requests require admin status.
    """
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminOrSuperAdmin]
        return [permission() for permission in permission_classes]

class PageContentViewSet(BaseCmsViewSet):
    queryset = PageContent.objects.all()
    serializer_class = PageContentSerializer
    lookup_field = 'page_name'

class ServiceViewSet(BaseCmsViewSet):
    queryset = Service.objects.all().order_by('name')
    serializer_class = ServiceSerializer
    lookup_field = 'slug'

class TeamMemberViewSet(BaseCmsViewSet):
    queryset = TeamMember.objects.all().order_by('id')
    serializer_class = TeamMemberSerializer

class FAQViewSet(BaseCmsViewSet):
    queryset = FAQ.objects.all().order_by('id')
    serializer_class = FAQSerializer

class TestimonialViewSet(BaseCmsViewSet):
    queryset = Testimonial.objects.all().order_by('-id')
    serializer_class = TestimonialSerializer

    def get_queryset(self):
        # Admin sees all testimonials, public sees only approved
        user = self.request.user
        if user and user.is_authenticated and user.role in ['ADMIN', 'SUPERADMIN']:
            return Testimonial.objects.all().order_by('-id')
        return Testimonial.objects.filter(approved=True).order_by('-id')

class BlogViewSet(BaseCmsViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        # Admin can view drafts; public can only view published blogs
        user = self.request.user
        if user and user.is_authenticated and user.role in ['ADMIN', 'SUPERADMIN']:
            return Blog.objects.all().order_by('-created_at')
        return Blog.objects.filter(status='PUBLISHED').order_by('-published_at')

    def perform_create(self, serializer):
        # Automatically generate slug if not provided and handle publishing date
        title = serializer.validated_data.get('title')
        slug = serializer.validated_data.get('slug')
        if not slug:
            slug = slugify(title)
        
        status_val = serializer.validated_data.get('status', 'DRAFT')
        pub_at = None
        if status_val == 'PUBLISHED':
            pub_at = now()
            
        serializer.save(slug=slug, published_at=pub_at)

    def perform_update(self, serializer):
        status_val = serializer.validated_data.get('status')
        pub_at = serializer.instance.published_at
        if status_val == 'PUBLISHED' and not pub_at:
            pub_at = now()
        elif status_val == 'DRAFT':
            pub_at = None
            
        serializer.save(published_at=pub_at)

class SEOConfigViewSet(BaseCmsViewSet):
    queryset = SEOConfig.objects.all()
    serializer_class = SEOConfigSerializer
    lookup_field = 'id'

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def match_path(self, request):
        path = request.query_params.get('path', '/')
        try:
            seo = SEOConfig.objects.get(route_path=path)
            return Response(SEOConfigSerializer(seo).data)
        except SEOConfig.DoesNotExist:
            # Fallback/Default metadata for missing paths
            default_meta = {
                "route_path": path,
                "title": "SR4IPR Partners | Leading Intellectual Property Law Firm",
                "meta_description": "SR4IPR Partners is a premier legal advisory firm specializing in patents, trademarks, copyrights, geographical indications, and IP litigation support.",
                "keywords": "IP Law, Intellectual Property, Patents, Trademarks, Copyrights, India IP law, Litigation",
                "og_image": "",
                "canonical_url": f"https://www.sr4ipr.com{path}"
            }
            return Response(default_meta)

from django.http import HttpResponse

def sitemap_view(request):
    """
    Dynamically generates sitemap.xml listing all static and dynamic resources.
    """
    urls = [
        ("/", "1.0", "daily"),
        ("/about", "0.8", "monthly"),
        ("/services", "0.9", "weekly"),
        ("/team", "0.8", "monthly"),
        ("/faqs", "0.6", "monthly"),
        ("/book", "0.9", "weekly"),
        ("/patent-checker", "0.8", "weekly"),
        ("/calculator", "0.7", "monthly"),
        ("/blog", "0.9", "daily"),
    ]
    
    xml_items = []
    current_date = now().strftime("%Y-%m-%d")
    
    # Static and high-level routes
    for path, priority, freq in urls:
        xml_items.append(
            f"  <url>\n"
            f"    <loc>https://www.sr4ipr.com{path}</loc>\n"
            f"    <lastmod>{current_date}</lastmod>\n"
            f"    <changefreq>{freq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            f"  </url>"
        )
        
    # Dynamic Services
    for service in Service.objects.all():
        xml_items.append(
            f"  <url>\n"
            f"    <loc>https://www.sr4ipr.com/services/{service.slug}</loc>\n"
            f"    <lastmod>{current_date}</lastmod>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.85</priority>\n"
            f"  </url>"
        )
        
    # Dynamic Blogs
    for blog in Blog.objects.filter(status='PUBLISHED'):
        blog_date = blog.published_at.strftime("%Y-%m-%d") if blog.published_at else current_date
        xml_items.append(
            f"  <url>\n"
            f"    <loc>https://www.sr4ipr.com/blog/{blog.slug}</loc>\n"
            f"    <lastmod>{blog_date}</lastmod>\n"
            f"    <changefreq>monthly</changefreq>\n"
            f"    <priority>0.75</priority>\n"
            f"  </url>"
        )
        
    xml_content = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(xml_items)
        + "\n</urlset>"
    )
    
    return HttpResponse(xml_content, content_type="application/xml")

