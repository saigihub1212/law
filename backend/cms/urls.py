from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PageContentViewSet,
    ServiceViewSet,
    TeamMemberViewSet,
    FAQViewSet,
    TestimonialViewSet,
    BlogViewSet,
    SEOConfigViewSet,
)

router = DefaultRouter()
router.register('pages', PageContentViewSet, basename='pages')
router.register('services', ServiceViewSet, basename='services')
router.register('team', TeamMemberViewSet, basename='team')
router.register('faqs', FAQViewSet, basename='faqs')
router.register('testimonials', TestimonialViewSet, basename='testimonials')
router.register('blogs', BlogViewSet, basename='blogs')
router.register('seo', SEOConfigViewSet, basename='seo')

urlpatterns = [
    path('', include(router.urls)),
]
