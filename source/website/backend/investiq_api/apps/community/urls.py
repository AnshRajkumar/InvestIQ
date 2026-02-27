from django.urls import path
from .views import CommunityPostListCreateView, CommunityTrendingListView, CommunityUserPostListView, PostLikeView


urlpatterns = [
    path('posts/', CommunityPostListCreateView.as_view(), name='community_posts'),
    path('posts/user/<int:user_id>/', CommunityUserPostListView.as_view(), name='community_user_posts'),
    path('trending/', CommunityTrendingListView.as_view(), name='community_trending'),
    path('posts/<int:post_id>/like/', PostLikeView.as_view(), name='like_post'),
]
