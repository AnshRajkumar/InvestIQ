from rest_framework import serializers
from .models import DirectConversation, DirectMessage


class DirectMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = DirectMessage
        fields = ['id', 'conversation', 'sender', 'sender_name', 'content', 'created_at']
        read_only_fields = ['conversation', 'sender', 'sender_name', 'created_at']


class DirectConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    last_message_at = serializers.SerializerMethodField()

    class Meta:
        model = DirectConversation
        fields = ['id', 'participant_one', 'participant_two', 'other_user', 'last_message', 'last_message_at', 'updated_at']
        read_only_fields = ['participant_one', 'participant_two', 'other_user', 'last_message', 'last_message_at', 'updated_at']

    def get_other_user(self, obj):
        request = self.context.get('request')
        if not request:
            return None
        user = obj.other_user(request.user)
        return {
            'id': user.id,
            'username': user.username,
            'profile_picture': user.profile_picture,
            'is_email_verified': user.is_email_verified,
            'is_premium': user.is_premium,
        }

    def get_last_message(self, obj):
        message = obj.messages.order_by('-created_at').first()
        return message.content if message else ''

    def get_last_message_at(self, obj):
        message = obj.messages.order_by('-created_at').first()
        return message.created_at if message else None
