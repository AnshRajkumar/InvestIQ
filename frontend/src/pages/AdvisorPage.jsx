import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AdvisorPage() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [feedback, setFeedback] = useState({})
  const { darkMode } = useAuth()

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/advisor/history/')
      setRecommendations(response.data.results || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetRecommendation = async () => {
    try {
      const response = await api.post('/advisor/recommendation/')
      setRecommendations([response.data, ...recommendations])
      setShowForm(false)
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to get recommendation')
    }
  }

  const handleFeedback = async (recId, feedbackValue) => {
    try {
      await api.post(`/advisor/feedback/`, {
        recommendation_id: recId,
        user_feedback: feedbackValue
      })
      setFeedback({...feedback, [recId]: feedbackValue})
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Strategy Advisor 🤖</h1>

          {/* Get Recommendation Button */}
          <div className="mb-8">
            <button
              onClick={handleGetRecommendation}
              className={`px-8 py-3 rounded-lg font-medium text-lg ${
                darkMode
                  ? 'bg-blue-700 text-white hover:bg-blue-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Get AI Recommendation
            </button>
          </div>

          {/* Recommendations List */}
          {loading ? (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading recommendations...</p>
          ) : recommendations.length === 0 ? (
            <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No recommendations yet. Click above to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className={`rounded-lg shadow p-6 hover:shadow-lg transition ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rec.title}</h3>
                      <RecommendationBadge type={rec.recommendation_type} darkMode={darkMode} />
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{(rec.confidence_score * 100).toFixed(0)}%</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence</p>
                    </div>
                  </div>

                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rec.description}</p>

                  {rec.reasoning && (
                    <div className={`rounded-lg p-4 mb-4 text-sm ${
                      darkMode
                        ? 'bg-blue-900/20 text-gray-300'
                        : 'bg-blue-50 text-gray-700'
                    }`}>
                      <p className="font-medium mb-2">Reasoning:</p>
                      <p>{rec.reasoning}</p>
                    </div>
                  )}

                  <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Risk Level: <span className="font-bold">{rec.risk_level}</span></p>
                    {rec.action_items && (
                      <div>
                        <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Action Items:</p>
                        <ul className={`text-sm list-disc list-inside ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {Array.isArray(rec.action_items) ? (
                            rec.action_items.map((item, idx) => <li key={idx}>{item}</li>)
                          ) : (
                            <li>{rec.action_items}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Feedback */}
                  {!feedback[rec.id] && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFeedback(rec.id, 'helpful')}
                        className={`px-4 py-2 rounded-lg ${
                          darkMode
                            ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        👍 Helpful
                      </button>
                      <button
                        onClick={() => handleFeedback(rec.id, 'not_helpful')}
                        className={`px-4 py-2 rounded-lg ${
                          darkMode
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        👎 Not Helpful
                      </button>
                    </div>
                  )}
                  {feedback[rec.id] && (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>✓ Feedback recorded</p>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

function RecommendationBadge({ type, darkMode }) {
  const typeMap = {
    buy: {
      bg: darkMode ? 'bg-green-900/30' : 'bg-green-100',
      text: darkMode ? 'text-green-400' : 'text-green-800',
      icon: '📈',
    },
    sell: {
      bg: darkMode ? 'bg-red-900/30' : 'bg-red-100',
      text: darkMode ? 'text-red-400' : 'text-red-800',
      icon: '📉',
    },
    hold: {
      bg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
      text: darkMode ? 'text-gray-300' : 'text-gray-800',
      icon: '⏸️',
    },
    rebalance: {
      bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-100',
      text: darkMode ? 'text-blue-400' : 'text-blue-800',
      icon: '⚖️',
    },
    diversify: {
      bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-100',
      text: darkMode ? 'text-purple-400' : 'text-purple-800',
      icon: '🎯',
    },
  }
  
  const style = typeMap[type.toLowerCase()] || typeMap.hold
  
  return (
    <span className={`inline-block ${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-medium mt-2`}>
      {style.icon} {type.toUpperCase()}
    </span>
  )
}
