from django.urls import path
from .views import ConversationListCreateView, MessageListCreateView


urlpatterns = [
    path('conversations/', ConversationListCreateView.as_view(), name='direct_conversations'),
    path('conversations/<int:conversation_id>/messages/', MessageListCreateView.as_view(), name='direct_messages'),
]
