from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

# Health check endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for monitoring."""
    return Response({
        'status': 'healthy',
        'service': 'InvestIQ API',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Health Check
    path('api/health/', health_check, name='health_check'),

    # API Endpoints
    path('api/auth/', include('investiq_api.apps.authentication.urls')),
    path('api/prediction/', include('investiq_api.apps.prediction.urls')),
    path('api/news/', include('investiq_api.apps.news.urls')),
    path('api/portfolio/', include('investiq_api.apps.portfolio.urls')),
    path('api/advisor/', include('investiq_api.apps.advisor.urls')),
    path('api/playground/', include('investiq_api.apps.playground.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
