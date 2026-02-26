import yfinance as yf
import pandas as pd
import ta

def fetch_stock_data(ticker, period="2y"):
    df = yf.download(ticker, period=period, auto_adjust=True)

    # Fix MultiIndex columns if present
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Ensure Close is 1D Series
    df['Close'] = df['Close'].astype(float)

    # Technical Indicators
    df['SMA_50'] = ta.trend.sma_indicator(close=df['Close'], window=50)
    df['SMA_200'] = ta.trend.sma_indicator(close=df['Close'], window=200)
    df['RSI'] = ta.momentum.rsi(close=df['Close'], window=14)
    df['MACD'] = ta.trend.macd(close=df['Close'])

    df.dropna(inplace=True)

    # Target: Next Day Movement
    df['Target'] = (df['Close'].shift(-1) > df['Close']).astype(int)

    df.dropna(inplace=True)

    return df