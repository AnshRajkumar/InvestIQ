from django.contrib import admin
from .models import FinancialNews, NewsBookmark


@admin.register(FinancialNews)
class FinancialNewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'sentiment', 'impact_score', 'published_at', 'is_trending')
    list_filter = ('sentiment', 'impact_category', 'published_at')
    search_fields = ('title', 'description', 'related_stocks')
    readonly_fields = ('fetched_at',)
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'description', 'source', 'url', 'image_url')
        }),
        ('Stock Relevance', {
            'fields': ('related_stocks',)
        }),
        ('Sentiment & Impact', {
            'fields': ('sentiment', 'sentiment_score', 'impact_score', 'impact_category')
        }),
        ('Timestamps', {
            'fields': ('published_at', 'fetched_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(NewsBookmark)
class NewsBookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'news', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('user__username', 'news__title')
