from rest_framework import serializers
from .models import CommunityPost, PostLike


class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['created_at']


class CommunityPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_is_verified = serializers.BooleanField(source='author.is_email_verified', read_only=True)
    author_is_premium = serializers.BooleanField(source='author.is_premium', read_only=True)
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = [
            'id',
            'author',
            'author_name',
            'author_is_verified',
            'author_is_premium',
            'content',
            'created_at',
            'like_count',
            'is_liked'
        ]
        read_only_fields = [
            'author',
            'author_name',
            'author_is_verified',
            'author_is_premium',
            'created_at',
            'like_count',
            'is_liked'
        ]

    def get_like_count(self, obj):
        return obj.get_like_count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
