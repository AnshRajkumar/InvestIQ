from rest_framework import serializers
from .models import PredictionGame, PaperTradingSession, UserStats


class PredictionGameSerializer(serializers.ModelSerializer):
    """Serialize prediction game data."""
    
    class Meta:
        model = PredictionGame
        fields = [
            'id',
            'ticker',
            'user_prediction',
            'ai_prediction',
            'ai_confidence',
            'actual_result',
            'user_correct',
            'ai_correct',
            'explanation',
            'created_at',
            'resolved_at',
        ]
        read_only_fields = ['id', 'ai_prediction', 'ai_confidence', 'explanation', 'created_at', 'resolved_at']


class PapeTradingSessionSerializer(serializers.ModelSerializer):
    """Serialize paper trading session data."""
    
    class Meta:
        model = PaperTradingSession
        fields = [
            'id',
            'ticker',
            'initial_capital',
            'final_value',
            'profit_loss',
            'return_percentage',
            'total_trades',
            'trades',
            'started_at',
            'completed_at',
        ]
        read_only_fields = [
            'id',
            'final_value',
            'profit_loss',
            'return_percentage',
            'total_trades',
            'trades',
            'started_at',
            'completed_at',
        ]


class UserStatsSerializer(serializers.ModelSerializer):
    """Serialize user playground statistics."""
    
    class Meta:
        model = UserStats
        fields = [
            'total_predictions',
            'correct_predictions',
            'ai_correct_predictions',
            'accuracy',
            'total_trading_profit',
            'best_trade_return',
            'total_paper_trading_sessions',
            'updated_at',
        ]
        read_only_fields = [
            'total_predictions',
            'correct_predictions',
            'ai_correct_predictions',
            'accuracy',
            'total_trading_profit',
            'best_trade_return',
            'total_paper_trading_sessions',
            'updated_at',
        ]
