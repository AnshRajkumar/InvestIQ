import sys
import os

# Ensure ml folder is in Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CURRENT_DIR)

from predict import predict_stock

print("Starting prediction test...\n")

try:
    result = predict_stock("AAPL")

    print("AI Prediction:", result["prediction"])
    print("Confidence:", result["confidence"], "%")

except Exception as e:
    print("Error occurred:", e)