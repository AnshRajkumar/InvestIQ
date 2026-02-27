from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('overview/', views.get_portfolio_overview, name='overview'),
    path('add_holding/', views.add_holding, name='add_holding'),
    path('holdings/', views.get_holdings, name='holdings'),
    path('remove_holding/', views.remove_holding, name='remove_holding'),
    path('update_prices/', views.update_prices, name='update_prices'),
]

