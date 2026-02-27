from django.db import models
from django.conf import settings


class PortfolioHolding(models.Model):
    """Model representing a stock holding in a user's portfolio"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='holdings'
    )
    symbol = models.CharField(max_length=10)
    company_name = models.CharField(max_length=200)
    shares = models.DecimalField(max_digits=15, decimal_places=4)
    average_buy_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    sector = models.CharField(max_length=100)
    
    # Calculated fields
    total_invested = models.DecimalField(max_digits=15, decimal_places=2)
    current_value = models.DecimalField(max_digits=15, decimal_places=2)
    profit_loss = models.DecimalField(max_digits=15, decimal_places=2)
    profit_loss_percent = models.DecimalField(max_digits=6, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'symbol')
        ordering = ['-current_value']
    
    def __str__(self):
        return f"{self.user.username} - {self.symbol} ({self.shares} shares)"
    
    def calculate_metrics(self):
        """Calculate total invested, current value, and profit/loss"""
        self.total_invested = self.shares * self.average_buy_price
        self.current_value = self.shares * self.current_price
        self.profit_loss = self.current_value - self.total_invested
        
        if self.total_invested > 0:
            self.profit_loss_percent = (self.profit_loss / self.total_invested) * 100
        else:
            self.profit_loss_percent = 0
    
    def save(self, *args, **kwargs):
        """Override save to calculate metrics before saving"""
        self.calculate_metrics()
        super().save(*args, **kwargs)
