import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function DashboardPage() {
  const { user, darkMode } = useAuth()
  const [stats, setStats] = useState({
    portfolio_value: 0,
    predictions_made: 0,
    accuracy: 0,
    news_count: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [portfolio, predictions, news] = await Promise.all([
        api.get('/portfolio/overview/'),
        api.get('/prediction/stats/'),
        api.get('/news/'),
      ])

      setStats({
        portfolio_value: portfolio.data?.total_value || 0,
        predictions_made: predictions.data?.total_predictions || 0,
        accuracy: predictions.data?.accuracy_percentage || 0,
        news_count: news.data?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome, {user?.first_name || 'User'}! 👋
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's your financial intelligence dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Portfolio Value"
            value={`$${stats.portfolio_value.toFixed(2)}`}
            icon="💼"
            color={darkMode ? 'from-blue-900 to-blue-800' : 'from-blue-50 to-blue-100'}
            darkMode={darkMode}
          />
          <StatCard
            title="Predictions Made"
            value={stats.predictions_made}
            icon="🎯"
            color={darkMode ? 'from-green-900 to-green-800' : 'from-green-50 to-green-100'}
            darkMode={darkMode}
          />
          <StatCard
            title="Accuracy Rate"
            value={`${stats.accuracy.toFixed(1)}%`}
            icon="📈"
            color={darkMode ? 'from-purple-900 to-purple-800' : 'from-purple-50 to-purple-100'}
            darkMode={darkMode}
          />
          <StatCard
            title="News Articles"
            value={stats.news_count}
            icon="📰"
            color={darkMode ? 'from-orange-900 to-orange-800' : 'from-orange-50 to-orange-100'}
            darkMode={darkMode}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickAction
            title="Make a Prediction"
            description="Analyze stocks and make predictions"
            link="/predictions"
            icon="🔮"
            darkMode={darkMode}
          />
          <QuickAction
            title="Manage Portfolio"
            description="View and manage your holdings"
            link="/portfolio"
            icon="💎"
            darkMode={darkMode}
          />
          <QuickAction
            title="Read News"
            description="Get latest market news and insights"
            link="/news"
            icon="📰"
            darkMode={darkMode}
          />
          <QuickAction
            title="AI Advisor"
            description="Get personalized recommendations"
            link="/advisor"
            icon="🤖"
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, darkMode }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-lg p-6 dark:text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  )
}

function QuickAction({ title, description, link, icon, darkMode }) {
  return (
    <a
      href={link}
      className={`rounded-lg p-6 hover:shadow-lg transition-shadow border ${
        darkMode
          ? 'bg-gray-900 border-gray-700 hover:bg-gray-800'
          : 'bg-white border-gray-200 hover:shadow-lg'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </a>
  )
}
