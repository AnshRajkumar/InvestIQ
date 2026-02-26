import yfinance as yf
import pandas as pd
import ta


def fetch_stock_data(ticker):
    df = yf.download(ticker, period="2y", auto_adjust=True)

    if df.empty:
        raise ValueError("Invalid ticker or no data.")

    # 🔥 Fix MultiIndex columns if present
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Ensure Close is a proper 1D Series
    close = df["Close"].astype(float)

    # Technical Indicators
    df["SMA_50"] = ta.trend.sma_indicator(close=close, window=50)
    df["SMA_200"] = ta.trend.sma_indicator(close=close, window=200)
    df["RSI"] = ta.momentum.rsi(close=close, window=14)
    df["MACD"] = ta.trend.macd(close=close)

    # Target variable
    df["Target"] = (close.shift(-1) > close).astype(int)

    df = df.dropna()

    return df