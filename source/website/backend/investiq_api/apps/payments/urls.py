from django.urls import path

try:
    from .views import CreateOrderView, VerifyPaymentView, PremiumStatusView
    
    urlpatterns = [
        path('create-order/', CreateOrderView.as_view(), name='create_order'),
        path('verify/', VerifyPaymentView.as_view(), name='verify_payment'),
        path('status/', PremiumStatusView.as_view(), name='premium_status'),
    ]
except ImportError:
    # Fallback if razorpay is not available
    urlpatterns = []
