import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null)
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    stock_symbol: '',
    quantity: '',
    purchase_price: '',
  })
  const { darkMode } = useAuth()

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const [portfolioRes, holdingsRes] = await Promise.all([
        api.get('/portfolio/overview/'),
        api.get('/portfolio/holdings/'),
      ])
      setPortfolio(portfolioRes.data)
      setHoldings(holdingsRes.data.results || [])
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHolding = async (e) => {
    e.preventDefault()
    try {
      await api.post('/portfolio/add_holding/', formData)
      setFormData({ stock_symbol: '', quantity: '', purchase_price: '' })
      fetchPortfolioData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to add holding')
    }
  }

  const handleRemoveHolding = async (symbol) => {
    if (confirm(`Remove ${symbol} from portfolio?`)) {
      try {
        await api.delete(`/portfolio/remove_holding/?stock_symbol=${symbol}`)
        fetchPortfolioData()
      } catch (error) {
        alert('Failed to remove holding')
      }
    }
  }

  if (loading) {
    return <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>Loading...</div>
  }

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Portfolio 💼</h1>

          {/* Portfolio Summary */}
          {portfolio && (
            <div className="grid grid-cols-3 gap-6 mb-8">
              <SummaryCard title="Total Value" value={`$${portfolio.total_value.toFixed(2)}`} icon="💰" darkMode={darkMode} />
              <SummaryCard title="Cash Available" value={`$${portfolio.cash_available.toFixed(2)}`} icon="💵" darkMode={darkMode} />
              <SummaryCard title="Risk Score" value={portfolio.risk_score.toFixed(1)} icon="⚠️" darkMode={darkMode} />
            </div>
          )}

          {/* Add Holding Form */}
          <div className={`rounded-lg shadow p-6 mb-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Holding</h2>
            <form onSubmit={handleAddHolding} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Stock Symbol (e.g., AAPL)"
                  value={formData.stock_symbol}
                  onChange={(e) => setFormData({...formData, stock_symbol: e.target.value.toUpperCase()})}
                  required
                  className={`px-4 py-2 border rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                  className={`px-4 py-2 border rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <input
                  type="number"
                  placeholder="Purchase Price"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
                  required
                  step="0.01"
                  className={`px-4 py-2 border rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg text-white ${
                  darkMode
                    ? 'bg-blue-700 hover:bg-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Add Holding
              </button>
            </form>
          </div>

          {/* Holdings List */}
          <div className="space-y-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Holdings</h2>
            {holdings.length === 0 ? (
              <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No holdings yet. Add your first stock above!</p>
              </div>
            ) : (
              holdings.map((holding) => (
                <div key={holding.id} className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{holding.stock_symbol}</h3>
                      <div className={`mt-2 space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>Quantity: {holding.quantity} shares</p>
                        <p>Purchase Price: ${holding.purchase_price}</p>
                        <p>Current Price: ${holding.current_price}</p>
                        <p>P/L: <span className={holding.profit_loss >= 0 ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}>
                          ${holding.profit_loss.toFixed(2)}
                        </span></p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveHolding(holding.stock_symbol)}
                      className={`text-white px-4 py-2 rounded-lg ${
                        darkMode
                          ? 'bg-red-700 hover:bg-red-600'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, icon, darkMode }) {
  return (
    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  )
}
