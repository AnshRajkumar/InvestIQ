import yfinance as yf

def get_actual_outcome(ticker):
    df = yf.download(ticker, period="2d")
    last_two = df['Close'].tail(2)

    return "UP" if last_two.iloc[1] > last_two.iloc[0] else "DOWN"