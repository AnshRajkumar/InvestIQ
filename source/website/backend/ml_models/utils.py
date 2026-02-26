import yfinance as yf
import pandas as pd
import ta
import numpy as np
import logging

logger = logging.getLogger(__name__)

def fetch_stock_data(ticker, period="2y"):
    """
    Fetch stock data with technical indicators.
    Handles errors and provides fallback mock data for testing.
    """
    try:
        # Download with progress disabled
        df = yf.download(
            ticker, 
            period=period, 
            auto_adjust=True,
            progress=False,
            timeout=10
        )
        
        if df.empty or len(df) == 0:
            logger.warning(f"No data returned for {ticker}, using mock data")
            return generate_mock_data(ticker)
        
        # Fix MultiIndex columns if present
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        
        # Ensure Close is 1D Series
        df['Close'] = df['Close'].astype(float)
        
        # Technical Indicators
        df['SMA_50'] = ta.trend.sma_indicator(close=df['Close'], window=50, fillna=False)
        df['SMA_200'] = ta.trend.sma_indicator(close=df['Close'], window=200, fillna=False)
        df['RSI'] = ta.momentum.rsi(close=df['Close'], window=14, fillna=False)
        df['MACD'] = ta.trend.macd(close=df['Close'], fillna=False)
        
        df.dropna(inplace=True)
        
        if len(df) < 50:
            logger.warning(f"Not enough data for {ticker}, using mock data")
            return generate_mock_data(ticker)
        
        # Target: Next Day Movement
        df['Target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
        
        df.dropna(inplace=True)
        
        logger.info(f"✅ Fetched {len(df)} rows of data for {ticker}")
        return df
    
    except Exception as e:
        logger.warning(f"Error fetching {ticker}: {str(e)}, using mock data")
        return generate_mock_data(ticker)


def generate_mock_data(ticker, days=504):
    """Generate realistic mock data for testing when real data is unavailable."""
    np.random.seed(hash(ticker) % 2**32)
    dates = pd.date_range(end=pd.Timestamp.now(), periods=days, freq='D')
    
    # Generate realistic price movement
    base_price = 100.0
    returns = np.random.normal(0.0005, 0.02, days)
    prices = base_price * np.exp(np.cumsum(returns))
    
    df = pd.DataFrame({
        'Close': prices,
        'Open': prices * (1 + np.random.normal(0, 0.005, days)),
        'High': prices * (1 + np.abs(np.random.normal(0, 0.01, days))),
        'Low': prices * (1 - np.abs(np.random.normal(0, 0.01, days))),
        'Volume': np.random.randint(1000000, 10000000, days)
    }, index=dates)
    
    df.index.name = 'Date'
    df['Close'] = df['Close'].astype(float)
    
    # Add technical indicators
    df['SMA_50'] = ta.trend.sma_indicator(close=df['Close'], window=50, fillna=False)
    df['SMA_200'] = ta.trend.sma_indicator(close=df['Close'], window=200, fillna=False)
    df['RSI'] = ta.momentum.rsi(close=df['Close'], window=14, fillna=False)
    df['MACD'] = ta.trend.macd(close=df['Close'], fillna=False)
    
    df.dropna(inplace=True)
    
    # Target: Next Day Movement
    df['Target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
    df.dropna(inplace=True)
    
    logger.info(f"📊 Generated mock data for {ticker}: {len(df)} rows")
    return df