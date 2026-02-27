from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class PredictionGame(models.Model):
    """Store user predictions for the prediction playground."""
    
    PREDICTION_CHOICES = (
        ('UP', 'Price will go UP'),
        ('DOWN', 'Price will go DOWN'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prediction_games')
    ticker = models.CharField(max_length=10)
    user_prediction = models.CharField(max_length=10, choices=PREDICTION_CHOICES)
    ai_prediction = models.CharField(max_length=10, choices=PREDICTION_CHOICES) 
    ai_confidence = models.FloatField()  # Confidence percentage
    actual_result = models.CharField(max_length=10, choices=PREDICTION_CHOICES, null=True, blank=True)
    user_correct = models.BooleanField(null=True, blank=True)
    ai_correct = models.BooleanField(null=True, blank=True)
    explanation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Prediction Game'
        verbose_name_plural = 'Prediction Games'
    
    def __str__(self):
        return f"{self.user.email} - {self.ticker} ({self.created_at.date()})"


class PaperTradingSession(models.Model):
    """Store paper trading simulations."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='paper_trading_sessions')
    ticker = models.CharField(max_length=10)
    initial_capital = models.DecimalField(max_digits=12, decimal_places=2)
    final_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    profit_loss = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    return_percentage = models.FloatField(null=True, blank=True)
    total_trades = models.IntegerField(null=True, blank=True)
    trades = models.JSONField(default=list, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-started_at']
        verbose_name = 'Paper Trading Session'
        verbose_name_plural = 'Paper Trading Sessions'
    
    def __str__(self):
        return f"{self.user.email} - {self.ticker} ({self.started_at.date()})"


class UserStats(models.Model):
    """Store aggregated stats for each user."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='playground_stats')
    total_predictions = models.IntegerField(default=0)
    correct_predictions = models.IntegerField(default=0)
    ai_correct_predictions = models.IntegerField(default=0)
    accuracy = models.FloatField(default=0.0)
    total_trading_profit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    best_trade_return = models.FloatField(default=0.0)
    total_paper_trading_sessions = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - Stats"
