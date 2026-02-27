from django.urls import path
from .views import (
    register_view,
    login_view,
    google_login_view,
    refresh_token_view,
    profile_me_view,
    profile_by_id_view,
    update_profile_view,
    logout_view,
    change_password_view,
)

app_name = 'authentication'

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('google/', google_login_view, name='google_login'),
    path('refresh/', refresh_token_view, name='refresh_token'),
    path('profile/me/', profile_me_view, name='profile_me'),
    path('profile/<int:user_id>/', profile_by_id_view, name='profile_by_id'),
    path('profile/update_profile/', update_profile_view, name='update_profile'),
    path('change-password/', change_password_view, name='change_password'),
    path('logout/', logout_view, name='logout'),
]
