import os
import sys
import logging
from datetime import datetime, timedelta
from decimal import Decimal

import joblib

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.utils import timezone
from django.db.models import Q, Avg, Sum, Max

from .models import PredictionGame, PaperTradingSession, UserStats
from .serializers import PredictionGameSerializer, PapeTradingSessionSerializer, UserStatsSerializer

logger = logging.getLogger(__name__)

# Add ML models path
ML_MODELS_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml_models')
ML_MODELS_PATH = os.path.abspath(ML_MODELS_PATH)
logger.info(f"ML Models path: {ML_MODELS_PATH}")

if ML_MODELS_PATH not in sys.path:
    sys.path.insert(0, ML_MODELS_PATH)

try:
    # Import ML utilities and functions
    from importlib.util import spec_from_file_location, module_from_spec
    
    utils_path = os.path.join(ML_MODELS_PATH, 'utils.py')
    spec = spec_from_file_location("utils", utils_path)
    utils_module = module_from_spec(spec)
    spec.loader.exec_module(utils_module)
    fetch_stock_data = utils_module.fetch_stock_data
    
    explanation_path = os.path.join(ML_MODELS_PATH, 'explanation_engine.py')
    spec = spec_from_file_location("explanation_engine", explanation_path)
    explanation_module = module_from_spec(spec)
    spec.loader.exec_module(explanation_module)
    generate_explanation = explanation_module.generate_explanation
    
    # Load the trained model
    BASE_DIR = ML_MODELS_PATH
    model_path = os.path.join(BASE_DIR, "saved_models", "stock_model.pkl")
    if os.path.exists(model_path):
        ML_MODEL = joblib.load(model_path)
        logger.info(f"✅ ML Model loaded successfully from {model_path}")
    else:
        logger.warning(f"⚠️ Model file not found at {model_path}")
        ML_MODEL = None
except Exception as e:
    logger.error(f"❌ Error loading ML model: {str(e)}")
    import traceback
    logger.error(traceback.format_exc())
    ML_MODEL = None
    fetch_stock_data = None
    generate_explanation = None


def get_or_create_user_stats(user):
    """Get or create user stats."""
    stats, created = UserStats.objects.get_or_create(user=user)
    return stats


def update_user_stats(user):
    """Update user stats based on prediction games."""
    stats = get_or_create_user_stats(user)
    
    # Get all resolved predictions
    resolved = PredictionGame.objects.filter(user=user, resolved_at__isnull=False)
    
    total = resolved.count()
    correct = resolved.filter(user_correct=True).count()
    ai_correct = resolved.filter(ai_correct=True).count()
    
    # Get trading stats
    trading_sessions = PaperTradingSession.objects.filter(user=user, completed_at__isnull=False)
    total_profit = trading_sessions.aggregate(Sum('profit_loss'))['profit_loss__sum'] or Decimal('0')
    best_return = trading_sessions.aggregate(Max('return_percentage'))['return_percentage__max'] or 0.0
    
    stats.total_predictions = total
    stats.correct_predictions = correct
    stats.ai_correct_predictions = ai_correct
    stats.accuracy = (correct / total * 100) if total > 0 else 0.0
    stats.total_trading_profit = total_profit
    stats.best_trade_return = best_return
    stats.total_paper_trading_sessions = trading_sessions.count()
    stats.save()
    
    return stats


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_prediction(request):
    """Create a new prediction game."""
    if not ML_MODEL:
        return Response(
            {'error': 'ML Model not available. Please try again later.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    try:
        ticker = request.data.get('ticker', '').upper()
        user_prediction = request.data.get('user_prediction', '').upper()
        
        if not ticker or not user_prediction:
            return Response(
                {'error': 'ticker and user_prediction are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user_prediction not in ['UP', 'DOWN']:
            return Response(
                {'error': 'user_prediction must be UP or DOWN'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Fetch stock data
        try:
            df = fetch_stock_data(ticker)
            if df.empty:
                return Response(
                    {'error': f'Unable to fetch data for ticker {ticker}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            logger.error(f"Error fetching stock data for {ticker}: {str(e)}")
            return Response(
                {'error': f'Error fetching data for {ticker}. Please try a valid ticker.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get latest features
        latest = df.iloc[-1]
        features = ['SMA_50', 'SMA_200', 'RSI', 'MACD']
        
        try:
            X = latest[features].values.reshape(1, -1)
        except KeyError as e:
            logger.error(f"Missing technical indicator: {str(e)}")
            return Response(
                {'error': 'Failed to calculate technical indicators'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get AI prediction
        ai_pred_int = ML_MODEL.predict(X)[0]
        ai_prediction = "UP" if ai_pred_int == 1 else "DOWN"
        ai_confidence = float(ML_MODEL.predict_proba(X)[0][ai_pred_int] * 100)
        
        # Create prediction game
        prediction = PredictionGame.objects.create(
            user=request.user,
            ticker=ticker,
            user_prediction=user_prediction,
            ai_prediction=ai_prediction,
            ai_confidence=ai_confidence,
        )
        
        return Response(
            PredictionGameSerializer(prediction).data,
            status=status.HTTP_201_CREATED
        )
    
    except Exception as e:
        logger.error(f"Error creating prediction: {str(e)}")
        return Response(
            {'error': 'Error creating prediction. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_prediction_history(request):
    """Get prediction history for the user."""
    try:
        predictions = PredictionGame.objects.filter(user=request.user)
        
        # Filter by status if provided
        status_filter = request.query_params.get('status')
        if status_filter == 'resolved':
            predictions = predictions.filter(resolved_at__isnull=False)
        elif status_filter == 'pending':
            predictions = predictions.filter(resolved_at__isnull=True)
        
        serializer = PredictionGameSerializer(predictions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching prediction history: {str(e)}")
        return Response(
            {'error': 'Error fetching history'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resolve_prediction(request, prediction_id):
    """Resolve a prediction game with actual market result."""
    try:
        prediction = PredictionGame.objects.get(id=prediction_id, user=request.user)
        
        if prediction.resolved_at:
            return Response(
                {'error': 'This prediction is already resolved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Fetch current stock data to get actual result
        try:
            df = fetch_stock_data(prediction.ticker)
            if df.empty:
                return Response(
                    {'error': 'Unable to fetch current data'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get next day result (if available)
            latest_close = df.iloc[-2]['Close'] if len(df) > 1 else df.iloc[-1]['Close']
            current_close = df.iloc[-1]['Close']
            actual_result = "UP" if current_close > latest_close else "DOWN"
            
        except Exception as e:
            logger.error(f"Error fetching actual result: {str(e)}")
            return Response(
                {'error': 'Error fetching market data'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Update prediction
        prediction.actual_result = actual_result
        prediction.user_correct = (prediction.user_prediction == actual_result)
        prediction.ai_correct = (prediction.ai_prediction == actual_result)
        prediction.resolved_at = timezone.now()
        
        # Generate explanation
        prediction.explanation = generate_explanation(
            prediction.user_prediction,
            prediction.ai_prediction,
            actual_result,
            prediction.ai_confidence
        )
        
        prediction.save()
        
        # Update user stats
        update_user_stats(request.user)
        
        return Response(
            PredictionGameSerializer(prediction).data,
            status=status.HTTP_200_OK
        )
    
    except PredictionGame.DoesNotExist:
        return Response(
            {'error': 'Prediction not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error resolving prediction: {str(e)}")
        return Response(
            {'error': 'Error resolving prediction'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_paper_trading_session(request):
    """Create a new paper trading session."""
    if not ML_MODEL:
        return Response(
            {'error': 'ML Model not available'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    try:
        ticker = request.data.get('ticker', '').upper()
        initial_capital = Decimal(str(request.data.get('initial_capital', 10000)))
        
        if not ticker or initial_capital <= 0:
            return Response(
                {'error': 'ticker and valid initial_capital are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Fetch stock data
        try:
            df = fetch_stock_data(ticker)
            if df.empty:
                return Response(
                    {'error': f'Unable to fetch data for ticker {ticker}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            logger.error(f"Error fetching stock data: {str(e)}")
            return Response(
                {'error': f'Error fetching data for {ticker}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Run paper trading
        features = ['SMA_50', 'SMA_200', 'RSI', 'MACD']
        df = df.dropna()
        
        logger.info(f"📊 Starting paper trading for {ticker} with {len(df)} data points")
        
        capital = float(initial_capital)
        position = 0.0
        trades = []
        predictions_log = {'UP': 0, 'DOWN': 0}
        rsi_stats = {'min': 100, 'max': 0, 'oversold': 0, 'overbought': 0}
        
        for i in range(len(df) - 1):
            row = df.iloc[i]
            current_price = float(row["Close"])
            
            try:
                X = row[features].values.reshape(1, -1)
            except KeyError as e:
                logger.warning(f"Missing feature {e}, skipping row")
                continue
            
            prediction = ML_MODEL.predict(X)[0]
            predictions_log['UP' if prediction == 1 else 'DOWN'] += 1
            
            # Get RSI for additional signal
            rsi = float(row['RSI'])
            rsi_stats['min'] = min(rsi_stats['min'], rsi)
            rsi_stats['max'] = max(rsi_stats['max'], rsi)
            if rsi < 30:
                rsi_stats['oversold'] += 1
            if rsi > 70:
                rsi_stats['overbought'] += 1
            
            # BUY signal: Model predicts UP OR RSI indicates oversold
            if (prediction == 1 or rsi < 30) and position == 0:
                shares_to_buy = capital / current_price
                position = shares_to_buy
                capital = 0
                trades.append({
                    'type': 'BUY',
                    'price': current_price,
                    'shares': shares_to_buy,
                    'date': str(row.name.date()) if hasattr(row.name, 'date') else str(row.name),
                    'signal': 'ML' if prediction == 1 else 'RSI'
                })
                logger.debug(f"BUY: {shares_to_buy:.2f} shares at ${current_price:.2f} (RSI: {rsi:.1f})")
            
            # SELL signal: Model predicts DOWN OR RSI indicates overbought OR take profit
            elif (prediction == 0 or rsi > 70 or (current_price / (capital + position * current_price) * float(initial_capital)) > 1.05) and position > 0:
                shares_to_sell = position
                capital = position * current_price
                position = 0
                trades.append({
                    'type': 'SELL',
                    'price': current_price,
                    'shares': shares_to_sell,
                    'date': str(row.name.date()) if hasattr(row.name, 'date') else str(row.name),
                    'signal': 'ML' if prediction == 0 else 'RSI/TP'
                })
                logger.debug(f"SELL: {shares_to_sell:.2f} shares at ${current_price:.2f} (RSI: {rsi:.1f})")
        
        logger.info(f"📈 Predictions: UP={predictions_log['UP']}, DOWN={predictions_log['DOWN']}")
        logger.info(f"📊 RSI Stats: Min={rsi_stats['min']:.1f}, Max={rsi_stats['max']:.1f}, Oversold(<30)={rsi_stats['oversold']}, Overbought(>70)={rsi_stats['overbought']}")
        
        # Calculate results
        final_price = float(df.iloc[-1]["Close"])
        final_value = Decimal(str(capital + (position * final_price)))
        profit_loss = final_value - initial_capital
        return_pct = float((profit_loss / initial_capital) * 100) if initial_capital > 0 else 0.0
        
        logger.info(f"✅ Paper trading completed for {ticker}:")
        logger.info(f"   Total trades: {len(trades)}")
        logger.info(f"   Initial: ${initial_capital}, Final: ${final_value}")
        logger.info(f"   P&L: ${profit_loss} ({return_pct:.2f}%)")
        
        # Create session
        session = PaperTradingSession.objects.create(
            user=request.user,
            ticker=ticker,
            initial_capital=initial_capital,
            final_value=final_value,
            profit_loss=profit_loss,
            return_percentage=return_pct,
            total_trades=len(trades),
            trades=trades,
            completed_at=timezone.now(),
        )
        
        # Update user stats
        update_user_stats(request.user)
        
        return Response(
            PapeTradingSessionSerializer(session).data,
            status=status.HTTP_201_CREATED
        )
    
    except ValueError as e:
        return Response(
            {'error': f'Invalid input: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error creating paper trading session: {str(e)}")
        return Response(
            {'error': 'Error creating trading session'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_paper_trading_sessions(request):
    """Get paper trading sessions for the user."""
    try:
        sessions = PaperTradingSession.objects.filter(user=request.user)
        serializer = PapeTradingSessionSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching trading sessions: {str(e)}")
        return Response(
            {'error': 'Error fetching sessions'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_stats(request):
    """Get user playground statistics."""
    try:
        stats = get_or_create_user_stats(request.user)
        serializer = UserStatsSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching user stats: {str(e)}")
        return Response(
            {'error': 'Error fetching stats'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
