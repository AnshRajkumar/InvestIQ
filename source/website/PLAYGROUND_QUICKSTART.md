# 🎮 Stock Prediction Playground - Quick Start Guide

## ✅ Setup Complete!

The Stock Prediction Playground is fully integrated and ready to use!

## 🚀 Access the Playground

### 1. Servers Are Running

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **Playground**: http://localhost:5173/playground

### 2. Login & Navigate

1. Login to your account at http://localhost:5173/login
2. Click **"Playground"** in the navigation bar
3. Start making predictions!

## 🎯 How to Use

### Prediction Challenge Tab

1. **Select a stock** - Choose from popular tickers or type any ticker
2. **Make your prediction** - Click UP ⬆️ or DOWN ⬇️
3. **Submit** - See AI prediction instantly
4. **Compare** - View confidence levels
5. **Resolve** - Click "Resolve Now" to see actual market outcome
6. **Learn** - Read the intelligent explanation

### Paper Trading Tab

1. **Choose a ticker** - Select stock to trade
2. **Set capital** - Enter initial investment (default: ₹10,000)
3. **Run simulation** - Click "Start Paper Trading"
4. **View results** - See profit/loss, returns, and trade history
5. **Try again** - Test different stocks and strategies

### History Tab

- View all your past predictions
- Check prediction accuracy
- Review trading session performance
- Track your progress over time

## 📊 Features

### ✨ What You Can Do

- **Challenge AI** - Predict stock movements and compare with ML model
- **Paper Trade** - Run risk-free trading simulations
- **Track Performance** - Monitor accuracy and profitability
- **Learn** - Get explanations for every outcome
- **Compete** - See leaderboard rankings

### 🎯 Dashboard Stats

- **Accuracy** - Your prediction success rate
- **Total Predictions** - Number of predictions made
- **Paper Trades** - Trading simulations completed
- **Total P/L** - Cumulative profit/loss from paper trading

## 🔧 Technical Details

### API Endpoints Used

```
/api/playground/predictions/              - Create predictions
/api/playground/predictions/{id}/resolve/ - Resolve predictions
/api/playground/paper-trading/            - Paper trading
/api/playground/stats/my_stats/           - Your statistics
```

### ML Model

- **Algorithm**: XGBoost Classifier
- **Features**: SMA_50, SMA_200, RSI, MACD
- **Output**: UP/DOWN with confidence %
- **Location**: `backend/ml_models/saved_models/stock_model.pkl`

## 🧪 Demo Mode

Currently running with a **demo ML model** for testing.

### To Train with Real Data:

```bash
cd backend/ml_models
python3 train_model.py
```

This will:

1. Fetch real stock data from Yahoo Finance
2. Calculate technical indicators
3. Train XGBoost model
4. Save to `saved_models/stock_model.pkl`

## 💡 Tips

### For Best Results

1. **Try multiple tickers** - Different stocks behave differently
2. **Compare predictions** - See how you stack up against AI
3. **Review explanations** - Learn from each outcome
4. **Track stats** - Monitor your accuracy over time
5. **Experiment with paper trading** - Test different strategies

### Popular Tickers to Try

- **AAPL** - Apple Inc.
- **GOOGL** - Google
- **MSFT** - Microsoft
- **TSLA** - Tesla
- **AMZN** - Amazon
- **META** - Meta/Facebook
- **NVDA** - NVIDIA
- **AMD** - Advanced Micro Devices

## 📱 UI Features

### Dark Mode

- Full dark mode support
- Automatic theme persistence
- Easy toggle in navbar

### Responsive Design

- Works on mobile, tablet, desktop
- Touch-friendly buttons
- Optimized layouts

### Visual Indicators

- 🟢 Green for UP predictions
- 🔴 Red for DOWN predictions
- ✅ Checkmark for correct
- ❌ X for incorrect
- 🧠 Brain icon for AI
- 👤 User icon for you

## 🐛 Troubleshooting

### If predictions don't work:

1. Check if backend is running: http://localhost:8000/api/health/
2. Verify you're logged in
3. Check browser console for errors

### If paper trading is slow:

- It's fetching 1 year of historical data
- Processing all trades
- Normal wait: 5-10 seconds

### If model errors occur:

```bash
cd backend/ml_models
python3 create_demo_model.py
```

## 🎓 Educational Use

This playground is perfect for:

- **Learning** stock market predictions
- **Practicing** trading strategies
- **Understanding** technical indicators
- **Comparing** human vs AI predictions
- **Building** confidence before real trading

## 🏆 Hackathon Ready!

✅ Fully functional prediction system
✅ AI integration working
✅ Paper trading operational
✅ Performance tracking active
✅ Beautiful, responsive UI
✅ Dark mode supported

Perfect for technical evaluation! 🎉

## 📞 Support

If you encounter any issues:

1. Check server logs in terminal
2. Verify migrations are applied
3. Ensure ML packages are installed
4. Check browser console for frontend errors

---

**Enjoy predicting! May your accuracy be high and your paper trades profitable! 📈**
