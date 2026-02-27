from django.db.models import Count
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import CommunityPost, PostLike
from .serializers import CommunityPostSerializer
from investiq_api.apps.direct_messages.permissions import IsPremiumUser


class CommunityPostListCreateView(generics.ListCreateAPIView):
    queryset = CommunityPost.objects.select_related('author').order_by('-created_at')
    serializer_class = CommunityPostSerializer
    permission_classes = [permissions.IsAuthenticated, IsPremiumUser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommunityTrendingListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPremiumUser]
    serializer_class = CommunityPostSerializer

    def get_queryset(self):
        return CommunityPost.objects.select_related('author').annotate(
            like_count=Count('likes', distinct=True)
        ).order_by('-like_count', '-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CommunityUserPostListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsPremiumUser]
    serializer_class = CommunityPostSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return CommunityPost.objects.select_related('author').filter(author_id=user_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class PostLikeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CommunityPost.objects.all()

    def post(self, request, post_id):
        """Like a post"""
        try:
            post = CommunityPost.objects.get(id=post_id)
        except CommunityPost.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        like, created = PostLike.objects.get_or_create(post=post, user=request.user)
        
        if not created:
            # Already liked, return current state
            return Response({
                'message': 'Post already liked',
                'is_liked': True,
                'like_count': post.get_like_count()
            }, status=status.HTTP_200_OK)

        return Response({
            'message': 'Post liked',
            'is_liked': True,
            'like_count': post.get_like_count()
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, post_id):
        """Unlike a post"""
        try:
            post = CommunityPost.objects.get(id=post_id)
        except CommunityPost.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        like = PostLike.objects.filter(post=post, user=request.user).first()
        if like:
            like.delete()
            return Response({
                'message': 'Post unliked',
                'is_liked': False,
                'like_count': post.get_like_count()
            }, status=status.HTTP_200_OK)

        return Response({
            'message': 'Post not liked',
            'is_liked': False,
            'like_count': post.get_like_count()
        }, status=status.HTTP_200_OK)
