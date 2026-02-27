from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response
from .models import DirectConversation, DirectMessage
from .serializers import DirectConversationSerializer, DirectMessageSerializer
from .permissions import IsPremiumUser


class IsMessageAuthorOrAdmin(permissions.BasePermission):
    """Allow message author or admin (sunitpanda680@gmail.com) to delete"""
    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user or request.user.email == 'sunitpanda680@gmail.com'


class ConversationListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPremiumUser]
    serializer_class = DirectConversationSerializer

    def get_queryset(self):
        user = self.request.user
        return DirectConversation.objects.filter(
            Q(participant_one=user) | Q(participant_two=user)
        ).select_related('participant_one', 'participant_two').order_by('-updated_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        other_user_id = request.data.get('user_id')
        if not other_user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        if int(other_user_id) == request.user.id:
            return Response({'error': 'Cannot start a conversation with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        participants = sorted([request.user.id, int(other_user_id)])
        conversation, _created = DirectConversation.objects.get_or_create(
            participant_one_id=participants[0],
            participant_two_id=participants[1]
        )
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MessageListCreateDeleteView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPremiumUser]
    serializer_class = DirectMessageSerializer

    def get_queryset(self):
        conversation = self._get_conversation()
        return DirectMessage.objects.filter(conversation=conversation).select_related('sender')

    def perform_create(self, serializer):
        conversation = self._get_conversation()
        serializer.save(conversation=conversation, sender=self.request.user)
        conversation.save()

    def _get_conversation(self):
        conversation_id = self.kwargs.get('conversation_id')
        try:
            conversation = DirectConversation.objects.get(id=conversation_id)
        except DirectConversation.DoesNotExist:
            raise NotFound('Conversation not found')

        user = self.request.user
        if conversation.participant_one_id != user.id and conversation.participant_two_id != user.id:
            raise PermissionDenied('Not allowed')

        return conversation

    def delete(self, request, *args, **kwargs):
        """Delete a message (author or admin only)"""
        message_id = kwargs.get('message_id')
        try:
            message = DirectMessage.objects.get(id=message_id)
        except DirectMessage.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check permission
        if message.sender != request.user and request.user.email != 'sunitpanda680@gmail.com':
            return Response({'error': 'Not allowed to delete this message'}, status=status.HTTP_403_FORBIDDEN)
        
        message.delete()
        return Response({'message': 'Message deleted'}, status=status.HTTP_204_NO_CONTENT)


# Keep old name for backward compatibility
MessageListCreateView = MessageListCreateDeleteView
