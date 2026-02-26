import os
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from utils import fetch_stock_data


def train(ticker="AAPL"):
    df = fetch_stock_data(ticker)

    features = ["SMA_50", "SMA_200", "RSI", "MACD"]
    X = df[features]
    y = df["Target"]

    print("Class Distribution:")
    print(y.value_counts())

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    model = XGBClassifier(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=4,
        random_state=42,
        eval_metric="logloss"
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, preds))

    # Save model
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    save_path = os.path.join(BASE_DIR, "saved_models")
    os.makedirs(save_path, exist_ok=True)

    model_file = os.path.join(save_path, "stock_model.pkl")
    joblib.dump(model, model_file)

    print("Model saved at:", model_file)


if __name__ == "__main__":
    train("AAPL")