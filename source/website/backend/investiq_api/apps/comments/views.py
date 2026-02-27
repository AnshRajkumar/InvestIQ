from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from investiq_api.apps.comments.models import PostComment, CommentLike
from investiq_api.apps.comments.serializers import PostCommentSerializer
from investiq_api.apps.community.models import CommunityPost
from investiq_api.apps.direct_messages.permissions import IsPremiumUser


class PostCommentViewSet(viewsets.ModelViewSet):
    serializer_class = PostCommentSerializer
    permission_classes = [IsPremiumUser]  # Comments are premium-only

    def get_queryset(self):
        # Only premium users or admin can see comments
        user = self.request.user
        if user.is_authenticated and (user.is_premium or user.email == 'sunitpanda680@gmail.com'):
            post_id = self.kwargs.get('post_id')
            if post_id:
                return PostComment.objects.filter(post_id=post_id, parent_comment__isnull=True).select_related('author')
            return PostComment.objects.filter(parent_comment__isnull=True).select_related('author')
        return PostComment.objects.none()

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(CommunityPost, id=post_id)
        serializer.save(author=self.request.user, post=post)

    def get_permissions(self):
        # All comment actions require premium
        return [IsPremiumUser()]

    def destroy(self, request, *args, **kwargs):
        """Allow author or admin to delete comment"""
        comment = self.get_object()
        if comment.author != request.user and request.user.email != 'sunitpanda680@gmail.com':
            return Response({'error': 'Not allowed to delete this comment'}, status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        return Response({'message': 'Comment deleted'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        comment = self.get_object()
        like_obj, created = CommentLike.objects.get_or_create(comment=comment, user=request.user)
        
        if not created:
            like_obj.delete()
            return Response({'liked': False, 'like_count': comment.get_like_count()})
        
        return Response({'liked': True, 'like_count': comment.get_like_count()})

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def reply(self, request, post_id=None):
        """Create a reply to a comment (parent_comment_id required in body)"""
        parent_comment_id = request.data.get('parent_comment_id')
        content = request.data.get('content')

        if not content:
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not parent_comment_id:
            return Response({'error': 'parent_comment_id is required for replies'}, status=status.HTTP_400_BAD_REQUEST)

        parent_comment = get_object_or_404(PostComment, id=parent_comment_id)
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(CommunityPost, id=post_id)

        reply = PostComment.objects.create(
            post=post,
            author=request.user,
            content=content,
            parent_comment=parent_comment
        )

        serializer = self.get_serializer(reply)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
