from django.urls import path, include
from rest_framework.routers import DefaultRouter
from investiq_api.apps.comments.views import PostCommentViewSet

router = DefaultRouter()

urlpatterns = [
    path('posts/<int:post_id>/comments/', 
         PostCommentViewSet.as_view({
             'get': 'list',
             'post': 'create'
         }), 
         name='post-comments'),
    path('posts/<int:post_id>/comments/<int:pk>/', 
         PostCommentViewSet.as_view({
             'get': 'retrieve',
             'patch': 'partial_update',
             'delete': 'destroy'
         }), 
         name='post-comment-detail'),
    path('posts/<int:post_id>/comments/<int:pk>/like/', 
         PostCommentViewSet.as_view({'post': 'like'}), 
         name='comment-like'),
    path('posts/<int:post_id>/comments/reply/', 
         PostCommentViewSet.as_view({'post': 'reply'}), 
         name='comment-reply'),
]
