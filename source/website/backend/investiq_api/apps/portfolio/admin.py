from django.contrib import admin
from .models import PortfolioHolding


@admin.register(PortfolioHolding)
class PortfolioHoldingAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'symbol', 'company_name', 'shares', 
        'average_buy_price', 'current_price', 'profit_loss',
        'profit_loss_percent', 'created_at'
    ]
    list_filter = ['sector', 'created_at', 'user']
    search_fields = ['symbol', 'company_name', 'user__username', 'user__email']
    readonly_fields = [
        'total_invested', 'current_value', 'profit_loss',
        'profit_loss_percent', 'created_at', 'updated_at'
    ]
    
    fieldsets = (
        ('Stock Information', {
            'fields': ('user', 'symbol', 'company_name', 'sector')
        }),
        ('Holding Details', {
            'fields': ('shares', 'average_buy_price', 'current_price')
        }),
        ('Calculated Metrics', {
            'fields': (
                'total_invested', 'current_value',
                'profit_loss', 'profit_loss_percent'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
