from rest_framework import serializers
from .models import FinancialNews, NewsBookmark


class FinancialNewsSerializer(serializers.ModelSerializer):
    related_stocks_list = serializers.SerializerMethodField()
    is_trending = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    
    class Meta:
        model = FinancialNews
        fields = [
            'id', 'title', 'description', 'source', 'url', 'image_url',
            'related_stocks', 'related_stocks_list',
            'sentiment', 'sentiment_score',
            'impact_score', 'impact_category',
            'published_at', 'fetched_at',
            'is_trending', 'is_bookmarked'
        ]
        read_only_fields = fields
    
    def get_related_stocks_list(self, obj):
        return obj.get_related_stocks_list()
    
    def get_is_trending(self, obj):
        return obj.is_trending
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return NewsBookmark.objects.filter(user=request.user, news=obj).exists()
        return False


class NewsBookmarkSerializer(serializers.ModelSerializer):
    news = FinancialNewsSerializer(read_only=True)
    
    class Meta:
        model = NewsBookmark
        fields = ['id', 'news', 'created_at']
        read_only_fields = fields


class AddNewsBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsBookmark
        fields = ['news']


class MarketSentimentSerializer(serializers.Serializer):
    overall_sentiment = serializers.CharField()
    overall_score = serializers.FloatField()
    breakdown = serializers.DictField()
    total_articles = serializers.IntegerField()
