from django.contrib import admin
from .models import CommunityPost


@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'created_at')
    search_fields = ('author__email', 'author__username', 'content')
    ordering = ('-created_at',)
