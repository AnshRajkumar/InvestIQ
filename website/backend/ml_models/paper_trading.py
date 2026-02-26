import joblib
import os
from utils import fetch_stock_data

# Load model once
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "saved_models", "stock_model.pkl")
model = joblib.load(model_path)


def paper_trade(ticker, initial_capital):
    df = fetch_stock_data(ticker)

    features = ['SMA_50', 'SMA_200', 'RSI', 'MACD']
    df = df.dropna()

    capital = float(initial_capital)
    position = 0
    trades = 0

    print(f"\nStarting Paper Trading for {ticker}")
    print(f"Initial Capital: ₹{capital}\n")

    for i in range(len(df) - 1):
        row = df.iloc[i]
        current_price = row["Close"]

        X = row[features].values.reshape(1, -1)
        prediction = model.predict(X)[0]

        # BUY
        if prediction == 1 and position == 0:
            position = capital // current_price
            capital -= position * current_price
            trades += 1
            print(f"BUY at ₹{current_price:.2f}")

        # SELL
        elif prediction == 0 and position > 0:
            capital += position * current_price
            position = 0
            trades += 1
            print(f"SELL at ₹{current_price:.2f}")

    final_price = df.iloc[-1]["Close"]
    final_value = capital + (position * final_price)

    profit = final_value - initial_capital
    return_percent = (profit / initial_capital) * 100

    print("\n------ RESULTS ------")
    print(f"Final Portfolio Value: ₹{final_value:.2f}")
    print(f"Total Profit/Loss: ₹{profit:.2f}")
    print(f"Return: {return_percent:.2f}%")
    print(f"Total Trades: {trades}")


if __name__ == "__main__":
    ticker = input("Enter Stock Ticker (e.g., AAPL): ").strip().upper()
    capital = float(input("Enter Initial Capital (₹): "))

    paper_trade(ticker, capital)