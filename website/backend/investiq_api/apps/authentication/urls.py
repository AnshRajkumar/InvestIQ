from django.urls import path
from .views import (
    register_view,
    login_view,
    google_login_view,
    refresh_token_view,
    profile_me_view,
    update_profile_view,
    logout_view,
)

app_name = 'authentication'

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('google/', google_login_view, name='google_login'),
    path('refresh/', refresh_token_view, name='refresh_token'),
    path('profile/me/', profile_me_view, name='profile_me'),
    path('profile/update_profile/', update_profile_view, name='update_profile'),
    path('logout/', logout_view, name='logout'),
]
