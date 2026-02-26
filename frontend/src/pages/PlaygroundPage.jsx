import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  User, 
  Trophy, 
  Activity,
  DollarSign,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const PlaygroundPage = () => {
  const { darkMode } = useAuth();
  const [activeTab, setActiveTab] = useState('predict'); // predict, paper-trade, history
  
  // Prediction state
  const [ticker, setTicker] = useState('');
  const [userPrediction, setUserPrediction] = useState('');
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  
  // Paper trading state
  const [tradingTicker, setTradingTicker] = useState('');
  const [initialCapital, setInitialCapital] = useState('10000');
  const [tradingResult, setTradingResult] = useState(null);
  const [tradingLoading, setTradingLoading] = useState(false);
  
  // History & Stats
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [tradingSessions, setTradingSessions] = useState([]);
  
  // Popular tickers
  const popularTickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD'];
  
  useEffect(() => {
    fetchStats();
    fetchHistory();
    fetchTradingSessions();
  }, []);
  
  const fetchStats = async () => {
    try {
      const response = await api.get('/playground/stats/my_stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  const fetchHistory = async () => {
    try {
      const response = await api.get('/playground/predictions/history/');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };
  
  const fetchTradingSessions = async () => {
    try {
      const response = await api.get('/playground/paper-trading/');
      setTradingSessions(response.data);
    } catch (error) {
      console.error('Error fetching trading sessions:', error);
    }
  };
  
  const handlePredictionSubmit = async (e) => {
    e.preventDefault();
    if (!ticker || !userPrediction) return;
    
    setLoading(true);
    setGameResult(null);
    
    try {
      const response = await api.post('/playground/predictions/', {
        ticker: ticker.toUpperCase(),
        user_prediction: userPrediction
      });
      
      setAiPrediction(response.data);
      setGameResult(response.data);
      fetchStats();
    } catch (error) {
      console.error('Error submitting prediction:', error);
      alert(error.response?.data?.error || 'Error submitting prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const resolveGame = async (gameId) => {
    try {
      const response = await api.post(`/playground/predictions/${gameId}/resolve/`);
      setGameResult(response.data);
      fetchStats();
      fetchHistory();
    } catch (error) {
      console.error('Error resolving game:', error);
      alert(error.response?.data?.error || 'Error resolving prediction. Try again later.');
    }
  };
  
  const handlePaperTrade = async (e) => {
    e.preventDefault();
    if (!tradingTicker || !initialCapital) return;
    
    setTradingLoading(true);
    setTradingResult(null);
    
    try {
      const response = await api.post('/playground/paper-trading/', {
        ticker: tradingTicker.toUpperCase(),
        initial_capital: parseFloat(initialCapital)
      });
      
      setTradingResult(response.data);
      fetchStats();
      fetchTradingSessions();
    } catch (error) {
      console.error('Error running paper trade:', error);
      alert(error.response?.data?.error || 'Error running paper trade. Please try again.');
    } finally {
      setTradingLoading(false);
    }
  };
  
  const resetPrediction = () => {
    setTicker('');
    setUserPrediction('');
    setAiPrediction(null);
    setGameResult(null);
  };
  
  const resetTrading = () => {
    setTradingTicker('');
    setInitialCapital('10000');
    setTradingResult(null);
  };

  const safeInitialCapital = tradingResult?.initial_capital ?? initialCapital ?? 0;
  const safeFinalValue = tradingResult?.final_value ?? tradingResult?.initial_capital ?? initialCapital ?? 0;
  const safeProfitLoss = tradingResult?.profit_loss ?? 0;
  const safeReturnPercent = tradingResult?.return_percent ?? 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Stock Prediction Playground
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Challenge our AI in predicting stock movements and practice trading strategies
          </p>
        </div>
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.accuracy.toFixed(1)}%
                  </p>
                </div>
                <Trophy className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Predictions</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.total_predictions}
                  </p>
                </div>
                <Activity className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Paper Trades</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.total_paper_trades}
                  </p>
                </div>
                <DollarSign className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total P/L</p>
                  <p className={`text-2xl font-bold ${
                    parseFloat(stats.total_profit_loss) >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    ₹{parseFloat(stats.total_profit_loss).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${
                  parseFloat(stats.total_profit_loss) >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`} />
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="mb-6">
          <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('predict')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'predict'
                    ? `${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                    : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-600 hover:text-gray-900'}`
                }`}
              >
                Prediction Challenge
              </button>
              <button
                onClick={() => setActiveTab('paper-trade')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'paper-trade'
                    ? `${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                    : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-600 hover:text-gray-900'}`
                }`}
              >
                Paper Trading
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? `${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                    : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-600 hover:text-gray-900'}`
                }`}
              >
                History & Results
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        {activeTab === 'predict' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prediction Form */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Make Your Prediction
              </h2>
              
              <form onSubmit={handlePredictionSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Stock Ticker
                  </label>
                  <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="Enter ticker (e.g., AAPL)"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                  
                  {/* Popular Tickers */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {popularTickers.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTicker(t)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          ticker === t
                            ? 'bg-blue-600 text-white'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Your Prediction
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setUserPrediction('UP')}
                      className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center space-x-2 transition-all ${
                        userPrediction === 'UP'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : darkMode
                            ? 'border-gray-600 hover:border-green-500'
                            : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className={`font-medium ${userPrediction === 'UP' ? 'text-green-600 dark:text-green-400' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        UP
                      </span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setUserPrediction('DOWN')}
                      className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center space-x-2 transition-all ${
                        userPrediction === 'DOWN'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : darkMode
                            ? 'border-gray-600 hover:border-red-500'
                            : 'border-gray-300 hover:border-red-500'
                      }`}
                    >
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      <span className={`font-medium ${userPrediction === 'DOWN' ? 'text-red-600 dark:text-red-400' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        DOWN
                      </span>
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !ticker || !userPrediction}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                    loading || !ticker || !userPrediction
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {loading ? 'Analyzing...' : 'Submit Prediction'}
                </button>
                
                {gameResult && (
                  <button
                    type="button"
                    onClick={resetPrediction}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    New Prediction
                  </button>
                )}
              </form>
            </div>
            
            {/* Results */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Prediction Results
              </h2>
              
              {!gameResult ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Brain className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Make a prediction to see AI analysis and compare results
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Predictions Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-5 h-5 text-blue-500" />
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Your Prediction
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {gameResult.user_prediction === 'UP' ? (
                          <TrendingUp className="w-6 h-6 text-green-500" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-500" />
                        )}
                        <span className={`text-2xl font-bold ${
                          gameResult.user_prediction === 'UP' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {gameResult.user_prediction}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          AI Prediction
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {gameResult.ai_prediction === 'UP' ? (
                          <TrendingUp className="w-6 h-6 text-green-500" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-500" />
                        )}
                        <span className={`text-2xl font-bold ${
                          gameResult.ai_prediction === 'UP' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {gameResult.ai_prediction}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Confidence: {gameResult.ai_confidence}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Actual Outcome */}
                  {gameResult.actual_outcome ? (
                    <>
                      <div className={`p-4 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Actual Market Movement
                          </span>
                          <div className="flex items-center space-x-2">
                            {gameResult.actual_outcome === 'UP' ? (
                              <TrendingUp className="w-6 h-6 text-green-500" />
                            ) : (
                              <TrendingDown className="w-6 h-6 text-red-500" />
                            )}
                            <span className={`text-xl font-bold ${
                              gameResult.actual_outcome === 'UP' ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {gameResult.actual_outcome}
                            </span>
                          </div>
                        </div>
                        
                        {/* Results */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className={`flex items-center space-x-2 p-2 rounded ${
                            gameResult.user_was_correct
                              ? darkMode ? 'bg-green-900/20' : 'bg-green-50'
                              : darkMode ? 'bg-red-900/20' : 'bg-red-50'
                          }`}>
                            {gameResult.user_was_correct ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${
                              gameResult.user_was_correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              You were {gameResult.user_was_correct ? 'correct!' : 'incorrect'}
                            </span>
                          </div>
                          
                          <div className={`flex items-center space-x-2 p-2 rounded ${
                            gameResult.ai_was_correct
                              ? darkMode ? 'bg-green-900/20' : 'bg-green-50'
                              : darkMode ? 'bg-red-900/20' : 'bg-red-50'
                          }`}>
                            {gameResult.ai_was_correct ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${
                              gameResult.ai_was_correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              AI was {gameResult.ai_was_correct ? 'correct!' : 'incorrect'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Explanation */}
                      {gameResult.explanation && (
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-800'} mb-1`}>
                                Analysis
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {gameResult.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                        Prediction submitted! Check back tomorrow to see the actual market outcome and compare results.
                      </p>
                      <button
                        onClick={() => resolveGame(gameResult.id)}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Resolve Now (Demo)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'paper-trade' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trading Form */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Start Paper Trading
              </h2>
              
              <form onSubmit={handlePaperTrade} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Stock Ticker
                  </label>
                  <input
                    type="text"
                    value={tradingTicker}
                    onChange={(e) => setTradingTicker(e.target.value.toUpperCase())}
                    placeholder="Enter ticker (e.g., AAPL)"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {popularTickers.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTradingTicker(t)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          tradingTicker === t
                            ? 'bg-blue-600 text-white'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Initial Capital (₹)
                  </label>
                  <input
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(e.target.value)}
                    placeholder="10000"
                    min="1000"
                    step="1000"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                </div>
                
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                    💡 Paper trading simulates 1 year of AI-driven trading with your initial capital. No real money is involved.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={tradingLoading || !tradingTicker || !initialCapital}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                    tradingLoading || !tradingTicker || !initialCapital
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {tradingLoading ? 'Running Simulation...' : 'Start Paper Trading'}
                </button>
                
                {tradingResult && (
                  <button
                    type="button"
                    onClick={resetTrading}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    New Simulation
                  </button>
                )}
              </form>
            </div>
            
            {/* Trading Results */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Trading Results
              </h2>
              
              {!tradingResult ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <DollarSign className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Start a paper trading simulation to see AI trading performance
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Initial Capital
                      </p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{parseFloat(safeInitialCapital).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Final Value
                      </p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{parseFloat(safeFinalValue).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${
                      parseFloat(safeProfitLoss) >= 0
                        ? darkMode ? 'bg-green-900/20' : 'bg-green-50'
                        : darkMode ? 'bg-red-900/20' : 'bg-red-50'
                    }`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Profit/Loss
                      </p>
                      <p className={`text-xl font-bold ${
                        parseFloat(safeProfitLoss) >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        ₹{parseFloat(safeProfitLoss).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${
                      parseFloat(safeReturnPercent) >= 0
                        ? darkMode ? 'bg-green-900/20' : 'bg-green-50'
                        : darkMode ? 'bg-red-900/20' : 'bg-red-50'
                    }`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Return
                      </p>
                      <p className={`text-xl font-bold ${
                        parseFloat(safeReturnPercent) >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {parseFloat(safeReturnPercent).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Total Trades Executed
                    </p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tradingResult.total_trades}
                    </p>
                  </div>
                  
                  {/* Recent Trades */}
                  {tradingResult.trades && tradingResult.trades.length > 0 && (
                    <div>
                      <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                        Recent Trades (Last 5)
                      </h3>
                      <div className="space-y-2">
                        {tradingResult.trades.slice(-5).reverse().map((trade, idx) => (
                          <div 
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                trade.type === 'BUY'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}>
                                {trade.type}
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {trade.quantity} @ ₹{trade.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              ₹{trade.total.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Prediction History */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Prediction History
              </h2>
              
              {history.length === 0 ? (
                <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No completed predictions yet
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((game) => (
                    <div 
                      key={game.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {game.ticker}
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(game.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {game.user_was_correct !== null && (
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                            game.user_was_correct
                              ? darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
                              : darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
                          }`}>
                            {game.user_was_correct ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span className="text-xs font-medium">
                              {game.user_was_correct ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                            Your Prediction
                          </p>
                          <p className={`font-medium ${
                            game.user_prediction === 'UP' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {game.user_prediction}
                          </p>
                        </div>
                        <div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                            AI Prediction
                          </p>
                          <p className={`font-medium ${
                            game.ai_prediction === 'UP' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {game.ai_prediction} ({game.ai_confidence}%)
                          </p>
                        </div>
                        <div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                            Actual
                          </p>
                          <p className={`font-medium ${
                            game.actual_outcome === 'UP' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {game.actual_outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Trading History */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Paper Trading History
              </h2>
              
              {tradingSessions.length === 0 ? (
                <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No trading sessions yet
                </p>
              ) : (
                <div className="space-y-3">
                  {tradingSessions.map((session) => (
                    <div 
                      key={session.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {session.ticker}
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(session.started_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          parseFloat(session.profit_loss) >= 0
                            ? darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
                            : darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
                        }`}>
                          {parseFloat(session.return_percent).toFixed(2)}%
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                            Initial
                          </p>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ₹{parseFloat(session.initial_capital).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                            Final
                          </p>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ₹{parseFloat(session.final_value).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                            P/L
                          </p>
                          <p className={`font-medium ${
                            parseFloat(session.profit_loss) >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            ₹{parseFloat(session.profit_loss).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                            Trades
                          </p>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {session.total_trades}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaygroundPage;
