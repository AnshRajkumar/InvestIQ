import logging
import yfinance as yf
from decimal import Decimal
from django.db.models import Sum, F
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PortfolioHolding
from .serializers import (
    PortfolioHoldingSerializer,
    AddHoldingSerializer,
    PortfolioOverviewSerializer
)

logger = logging.getLogger(__name__)


def get_stock_info(symbol):
    """Fetch stock information with mock data for development"""
    import random
    
    # Use mock data for development (yfinance has rate limits)
    logger.info(f"Using mock prices for {symbol}")
    
    # Generate realistic mock data based on symbol
    base_prices = {
        'AAPL': 180.0,
        'GOOGL': 140.0,
        'MSFT': 380.0,
        'AMZN': 170.0,
        'TSLA': 210.0,
        'META': 450.0,
        'NVDA': 720.0,
        'AMD': 165.0,
        'NFLX': 520.0,
        'DIS': 110.0,
    }
    
    base_price = base_prices.get(symbol, 100.0)
    # Add random fluctuation (-5% to +5%)
    current_price = base_price * (1 + random.uniform(-0.05, 0.05))
    
    company_names = {
        'AAPL': 'Apple Inc.',
        'GOOGL': 'Alphabet Inc.',
        'MSFT': 'Microsoft Corporation',
        'AMZN': 'Amazon.com Inc.',
        'TSLA': 'Tesla Inc.',
        'META': 'Meta Platforms Inc.',
        'NVDA': 'NVIDIA Corporation',
        'AMD': 'Advanced Micro Devices Inc.',
        'NFLX': 'Netflix Inc.',
        'DIS': 'The Walt Disney Company',
    }
    
    return {
        'company_name': company_names.get(symbol, f'{symbol} Corporation'),
        'current_price': round(current_price, 2),
        'sector': 'Technology'
    }


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_portfolio_overview(request):
    """Get portfolio overview with all holdings"""
    holdings = PortfolioHolding.objects.filter(user=request.user)
    
    # Update current prices for all holdings with real-time data
    for holding in holdings:
        stock_info = get_stock_info(holding.symbol)
        if stock_info['current_price'] > 0:
            holding.current_price = Decimal(str(stock_info['current_price']))
            holding.company_name = stock_info['company_name']
            holding.sector = stock_info['sector']
            holding.save()
    
    # Refresh from database to get updated calculated fields
    holdings = PortfolioHolding.objects.filter(user=request.user)
    
    # Calculate totals
    total_invested = holdings.aggregate(Sum('total_invested'))['total_invested__sum'] or 0
    total_value = holdings.aggregate(Sum('current_value'))['current_value__sum'] or 0
    total_profit_loss = Decimal(total_value) - Decimal(total_invested)
    
    total_profit_loss_percent = 0
    if total_invested > 0:
        total_profit_loss_percent = (float(total_profit_loss) / float(total_invested)) * 100
    
    data = {
        'total_value': total_value,
        'total_invested': total_invested,
        'total_profit_loss': total_profit_loss,
        'total_profit_loss_percent': total_profit_loss_percent,
        'holdings_count': holdings.count(),
        'holdings': holdings
    }
    
    serializer = PortfolioOverviewSerializer(data)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_holding(request):
    """Add a new stock holding to portfolio"""
    serializer = AddHoldingSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    stock_symbol = serializer.validated_data['stock_symbol']
    quantity = serializer.validated_data['quantity']
    purchase_price = serializer.validated_data['purchase_price']
    
    # Check if holding already exists
    existing_holding = PortfolioHolding.objects.filter(
        user=request.user,
        symbol=stock_symbol
    ).first()
    
    if existing_holding:
        # Update existing holding (average the price)
        total_shares = existing_holding.shares + quantity
        total_cost = (existing_holding.shares * existing_holding.average_buy_price) + (quantity * purchase_price)
        new_average_price = total_cost / total_shares
        
        existing_holding.shares = total_shares
        existing_holding.average_buy_price = new_average_price
        
        # Try to get updated current price
        stock_info = get_stock_info(stock_symbol)
        if stock_info['current_price'] > 0:
            existing_holding.current_price = Decimal(str(stock_info['current_price']))
            existing_holding.company_name = stock_info['company_name']
            existing_holding.sector = stock_info['sector']
        
        existing_holding.save()
        
        return Response({
            'message': f'Updated holding for {stock_symbol}',
            'holding': PortfolioHoldingSerializer(existing_holding).data
        }, status=status.HTTP_200_OK)
    
    # Create new holding
    stock_info = get_stock_info(stock_symbol)
    
    holding = PortfolioHolding.objects.create(
        user=request.user,
        symbol=stock_symbol,
        company_name=stock_info['company_name'],
        shares=quantity,
        average_buy_price=purchase_price,
        current_price=Decimal(str(stock_info['current_price'])) if stock_info['current_price'] > 0 else purchase_price,
        sector=stock_info['sector']
    )
    
    return Response({
        'message': f'Added {stock_symbol} to your portfolio',
        'holding': PortfolioHoldingSerializer(holding).data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_holdings(request):
    """Get all holdings for the user"""
    holdings = PortfolioHolding.objects.filter(user=request.user)
    
    # Update current prices for all holdings
    for holding in holdings:
        stock_info = get_stock_info(holding.symbol)
        if stock_info['current_price'] > 0:
            holding.current_price = Decimal(str(stock_info['current_price']))
            holding.save()
    
    serializer = PortfolioHoldingSerializer(holdings, many=True)
    return Response({
        'count': holdings.count(),
        'results': serializer.data
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_holding(request):
    """Remove a stock holding from portfolio"""
    stock_symbol = request.query_params.get('stock_symbol')
    
    if not stock_symbol:
        return Response({
            'error': 'stock_symbol parameter is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        holding = PortfolioHolding.objects.get(
            user=request.user,
            symbol=stock_symbol.upper()
        )
        holding.delete()
        
        return Response({
            'message': f'Removed {stock_symbol} from your portfolio'
        }, status=status.HTTP_200_OK)
    except PortfolioHolding.DoesNotExist:
        return Response({
            'error': f'Holding {stock_symbol} not found in your portfolio'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_prices(request):
    """Update current prices for all holdings"""
    holdings = PortfolioHolding.objects.filter(user=request.user)
    updated_count = 0
    
    for holding in holdings:
        stock_info = get_stock_info(holding.symbol)
        if stock_info['current_price'] > 0:
            holding.current_price = Decimal(str(stock_info['current_price']))
            holding.company_name = stock_info['company_name']
            holding.sector = stock_info['sector']
            holding.save()
            updated_count += 1
    
    return Response({
        'message': f'Updated prices for {updated_count} holdings',
        'updated_count': updated_count
    }, status=status.HTTP_200_OK)
