from django.db import models
from django.conf import settings


class FinancialNews(models.Model):
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ]
    
    IMPACT_CATEGORIES = [
        ('product', 'Product'),
        ('earnings', 'Earnings'),
        ('regulation', 'Regulation'),
        ('market', 'Market'),
        ('acquisition', 'Acquisition'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=500)
    description = models.TextField()
    source = models.CharField(max_length=100)
    url = models.URLField()
    image_url = models.URLField(blank=True, null=True)
    
    # Stock relevance
    related_stocks = models.CharField(max_length=500, help_text="Comma-separated stock symbols")
    
    # Sentiment analysis
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES, default='neutral')
    sentiment_score = models.FloatField(default=0.5, help_text="0.0 to 1.0")
    
    # Impact scoring
    impact_score = models.FloatField(default=50.0, help_text="0 to 100")
    impact_category = models.CharField(max_length=20, choices=IMPACT_CATEGORIES, default='other')
    
    # Timestamps
    published_at = models.DateTimeField()
    fetched_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['-published_at']),
            models.Index(fields=['sentiment']),
            models.Index(fields=['impact_score']),
        ]
    
    def __str__(self):
        return self.title
    
    def get_related_stocks_list(self):
        """Return related stocks as a list"""
        return [s.strip().upper() for s in self.related_stocks.split(',') if s.strip()]
    
    @property
    def is_trending(self):
        """Article is trending if impact_score > 70"""
        return self.impact_score > 70


class NewsBookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='news_bookmarks')
    news = models.ForeignKey(FinancialNews, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'news')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.news.title}"
