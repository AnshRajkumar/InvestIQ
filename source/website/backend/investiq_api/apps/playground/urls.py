from django.urls import path
from .views import (
    create_prediction,
    get_prediction_history,
    resolve_prediction,
    create_paper_trading_session,
    get_paper_trading_sessions,
    get_user_stats,
)

app_name = 'playground'

urlpatterns = [
    # Prediction endpoints
    path('predictions/', create_prediction, name='create_prediction'),
    path('predictions/history/', get_prediction_history, name='prediction_history'),
    path('predictions/<int:prediction_id>/resolve/', resolve_prediction, name='resolve_prediction'),
    
    # Paper trading endpoints
    path('paper-trading/', get_paper_trading_sessions, name='trading_sessions'),
    path('paper-trading/create/', create_paper_trading_session, name='create_trading_session'),
    
    # Stats endpoints
    path('stats/my_stats/', get_user_stats, name='user_stats'),
]
