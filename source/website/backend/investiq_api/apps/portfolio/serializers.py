from rest_framework import serializers
from .models import PortfolioHolding


class PortfolioHoldingSerializer(serializers.ModelSerializer):
    """Serializer for portfolio holdings"""
    
    class Meta:
        model = PortfolioHolding
        fields = [
            'id', 'symbol', 'company_name', 'shares', 'average_buy_price',
            'current_price', 'sector', 'total_invested', 'current_value',
            'profit_loss', 'profit_loss_percent', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'total_invested', 'current_value', 'profit_loss',
            'profit_loss_percent', 'created_at', 'updated_at'
        ]


class AddHoldingSerializer(serializers.Serializer):
    """Serializer for adding a new holding"""
    stock_symbol = serializers.CharField(max_length=10)
    quantity = serializers.DecimalField(max_digits=15, decimal_places=4)
    purchase_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    def validate_stock_symbol(self, value):
        """Validate stock symbol"""
        return value.upper().strip()
    
    def validate_quantity(self, value):
        """Validate quantity is positive"""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value
    
    def validate_purchase_price(self, value):
        """Validate purchase price is positive"""
        if value <= 0:
            raise serializers.ValidationError("Purchase price must be greater than 0")
        return value


class PortfolioOverviewSerializer(serializers.Serializer):
    """Serializer for portfolio overview"""
    total_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_invested = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_profit_loss = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_profit_loss_percent = serializers.DecimalField(max_digits=6, decimal_places=2)
    holdings_count = serializers.IntegerField()
    holdings = PortfolioHoldingSerializer(many=True)
