"""
Quick script to create a pre-trained model for demo purposes
"""
import joblib
from xgboost import XGBClassifier
import numpy as np

# Create a simple trained model with dummy data for demonstration
# In production, this would be trained on real stock data
X_train = np.random.rand(100, 4)  # 4 features: SMA_50, SMA_200, RSI, MACD
y_train = np.random.randint(0, 2, 100)  # Binary classification: 0 (DOWN) or 1 (UP)

model = XGBClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=5,
    random_state=42
)

print("Training model with demo data...")
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, "saved_models/stock_model.pkl")
print("✅ Model saved successfully at saved_models/stock_model.pkl")
print("Note: This is a demo model. For production, train with real stock data using train_model.py")
