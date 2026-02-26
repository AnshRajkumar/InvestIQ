import os
import joblib
from utils import fetch_stock_data

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "saved_models", "stock_model.pkl")

model = joblib.load(model_path)


def predict_stock(ticker):
    df = fetch_stock_data(ticker)

    features = ["SMA_50", "SMA_200", "RSI", "MACD"]
    latest = df.iloc[-1]

    X = latest[features].values.reshape(1, -1)

    prediction = model.predict(X)[0]
    probability = model.predict_proba(X)[0][prediction]

    return {
        "prediction": "UP" if prediction == 1 else "DOWN",
        "confidence": round(float(probability) * 100, 2)
    }