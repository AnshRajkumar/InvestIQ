import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ stock_symbol: '', user_prediction: 'bullish' })
  const { darkMode } = useAuth()

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const response = await api.get('/prediction/my-predictions/')
      setPredictions(response.data.results || [])
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/prediction/create_prediction/', formData)
      setFormData({ stock_symbol: '', user_prediction: 'bullish' })
      fetchPredictions()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create prediction')
    }
  }

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stock Predictions 🎯</h1>

          {/* Create Prediction Form */}
          <div className={`rounded-lg shadow p-6 mb-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Make a New Prediction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stock Symbol</label>
                  <input
                    type="text"
                    value={formData.stock_symbol}
                    onChange={(e) => setFormData({...formData, stock_symbol: e.target.value.toUpperCase()})}
                    placeholder="e.g., AAPL"
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Prediction</label>
                  <select
                    value={formData.user_prediction}
                    onChange={(e) => setFormData({...formData, user_prediction: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="bullish">Bullish ⬆️</option>
                    <option value="bearish">Bearish ⬇️</option>
                    <option value="neutral">Neutral →</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-blue-700 text-white hover:bg-blue-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Create Prediction
              </button>
            </form>
          </div>

          {/* Predictions List */}
          {loading ? (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading predictions...</p>
          ) : predictions.length === 0 ? (
            <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No predictions yet. Make your first prediction above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((pred) => (
                <div key={pred.id} className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pred.stock_symbol}</h3>
                      <div className={`mt-2 space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>Your Prediction: <span className={`font-medium ${darkMode ? 'text-gray-200' : ''}`}>{pred.user_prediction}</span></p>
                        <p>AI Prediction: <span className={`font-medium ${darkMode ? 'text-gray-200' : ''}`}>{pred.ai_prediction}</span></p>
                        <p>Confidence: <span className={`font-medium ${darkMode ? 'text-gray-200' : ''}`}>{(pred.ai_confidence * 100).toFixed(0)}%</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>${pred.current_price}</p>
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created: {new Date(pred.prediction_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
