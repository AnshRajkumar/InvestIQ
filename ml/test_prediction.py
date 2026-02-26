from predict import predict_stock


def main():
    ticker = input("Enter Stock Ticker (e.g., AAPL): ").strip().upper()

    result = predict_stock(ticker)

    print("\nResult:")
    print("Prediction:", result["prediction"])
    print("Confidence:", result["confidence"], "%")


if __name__ == "__main__":
    main()