from django.urls import path
from .views import PatentCheckerAPIView, AiAssistantAPIView

urlpatterns = [
    path('patent-checker/', PatentCheckerAPIView.as_view(), name='ai_patent_checker'),
    path('assistant/', AiAssistantAPIView.as_view(), name='ai_assistant'),
]
