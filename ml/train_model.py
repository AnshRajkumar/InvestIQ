import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from xgboost import XGBClassifier
from utils import fetch_stock_data

TICKER = "AAPL"

def train():
    df = fetch_stock_data(TICKER)

    features = ['SMA_50', 'SMA_200', 'RSI', 'MACD']
    X = df[features]
    y = df['Target']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    model = XGBClassifier(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=5
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)

    print("Model Accuracy:", acc)

    print("\nClassification Report:")
    print(classification_report(y_test, preds))

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, preds))

    joblib.dump(model, "ml/saved_models/stock_model.pkl")
    print("Model Saved!")

if __name__ == "__main__":
    train()