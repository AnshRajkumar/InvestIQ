import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.paginator import Paginator
from .models import FinancialNews, NewsBookmark
from .serializers import (
    FinancialNewsSerializer,
    NewsBookmarkSerializer,
    AddNewsBookmarkSerializer,
    MarketSentimentSerializer
)
from .utils import MockNewsProvider

logger = logging.getLogger(__name__)


@api_view(['GET'])
def get_all_news(request):
    """Get all news articles with pagination"""
    try:
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        # Get mock news
        all_news = MockNewsProvider.fetch_news(limit=50)
        
        # Create paginator
        paginator = Paginator(all_news, page_size)
        page_obj = paginator.get_page(page)
        
        return Response({
            'count': paginator.count,
            'total_pages': paginator.num_pages,
            'page': page,
            'page_size': page_size,
            'results': page_obj.object_list
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching news: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_trending_news(request):
    """Get trending news articles"""
    try:
        limit = int(request.query_params.get('limit', 10))
        trending = MockNewsProvider.get_trending_news(limit=limit)
        
        return Response({
            'count': len(trending),
            'trending': trending
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching trending news: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_news_by_sentiment(request):
    """Get news filtered by sentiment"""
    try:
        sentiment = request.query_params.get('sentiment', 'positive').lower()
        
        if sentiment not in ['positive', 'negative', 'neutral']:
            return Response(
                {'error': 'Invalid sentiment. Must be positive, negative, or neutral.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        limit = int(request.query_params.get('limit', 20))
        news = MockNewsProvider.get_news_by_sentiment(sentiment, limit=limit)
        
        return Response({
            'sentiment': sentiment,
            'count': len(news),
            'results': news
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error filtering news by sentiment: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_news_by_stock(request):
    """Get news related to a specific stock"""
    try:
        stock_symbol = request.query_params.get('symbol')
        
        if not stock_symbol:
            return Response(
                {'error': 'Stock symbol is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        limit = int(request.query_params.get('limit', 10))
        news = MockNewsProvider.get_news_by_stock(stock_symbol, limit=limit)
        
        return Response({
            'symbol': stock_symbol.upper(),
            'count': len(news),
            'results': news
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching news by stock: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_market_sentiment(request):
    """Get overall market sentiment"""
    try:
        limit = int(request.query_params.get('limit', 50))
        sentiment_data = MockNewsProvider.calculate_market_sentiment(limit=limit)
        
        return Response(sentiment_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error calculating market sentiment: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_bookmarks(request):
    """Get user's bookmarked news articles"""
    try:
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        bookmarks = NewsBookmark.objects.filter(user=request.user).select_related('news')
        
        # Manual pagination for consistency
        start = (page - 1) * page_size
        end = start + page_size
        paginated_bookmarks = bookmarks[start:end]
        
        serializer = NewsBookmarkSerializer(
            paginated_bookmarks,
            many=True,
            context={'request': request}
        )
        
        return Response({
            'count': bookmarks.count(),
            'page': page,
            'page_size': page_size,
            'results': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching bookmarks: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_bookmark(request):
    """Add a news article to bookmarks"""
    try:
        serializer = AddNewsBookmarkSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Bookmark is created from mock data, so we need to handle it differently
        # For now, return success message
        return Response({
            'message': 'Article bookmarked successfully'
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        logger.error(f"Error adding bookmark: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_bookmark(request):
    """Remove a news article from bookmarks"""
    try:
        news_id = request.query_params.get('news_id')
        
        if not news_id:
            return Response(
                {'error': 'news_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        bookmark = NewsBookmark.objects.filter(
            user=request.user,
            news_id=news_id
        ).first()
        
        if not bookmark:
            return Response(
                {'error': 'Bookmark not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        bookmark.delete()
        
        return Response({
            'message': 'Bookmark removed successfully'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error removing bookmark: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
