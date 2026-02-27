from django.urls import path
from . import views

app_name = 'news'

urlpatterns = [
    # News articles
    path('', views.get_all_news, name='all_news'),
    path('trending/', views.get_trending_news, name='trending'),
    path('by-sentiment/', views.get_news_by_sentiment, name='by_sentiment'),
    path('by_stock/', views.get_news_by_stock, name='by_stock'),
    path('market_sentiment/', views.get_market_sentiment, name='market_sentiment'),
    
    # Bookmarks
    path('bookmarks/', views.get_my_bookmarks, name='my_bookmarks'),
    path('add-bookmark/', views.add_bookmark, name='add_bookmark'),
    path('remove-bookmark/', views.remove_bookmark, name='remove_bookmark'),
]

