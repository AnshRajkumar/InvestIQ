from rest_framework import serializers
from investiq_api.apps.comments.models import PostComment, CommentLike


class PostCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_email_verified = serializers.BooleanField(source='author.is_email_verified', read_only=True)
    author_is_premium = serializers.BooleanField(source='author.is_premium', read_only=True)
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = PostComment
        fields = [
            'id',
            'post',
            'author',
            'author_name',
            'author_email_verified',
            'author_is_premium',
            'content',
            'parent_comment',
            'created_at',
            'updated_at',
            'like_count',
            'is_liked',
            'reply_count',
            'replies'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_like_count(self, obj):
        return obj.get_like_count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CommentLike.objects.filter(comment=obj, user=request.user).exists()
        return False

    def get_reply_count(self, obj):
        return obj.get_reply_count()

    def get_replies(self, obj):
        """Return nested replies for this comment (only if it's a top-level comment)"""
        if obj.parent_comment is None:  # only top-level comments have replies shown
            replies = obj.replies.all()
            return PostCommentSerializer(replies, many=True, context=self.context).data
        return []
