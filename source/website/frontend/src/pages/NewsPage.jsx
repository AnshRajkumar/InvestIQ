import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { darkMode } = useAuth()

  const placeholderStories = [
    {
      id: 'sample-1',
      title: 'Market opens mixed as AI sector steadies',
      description: 'Large-cap tech stabilizes while financials remain cautious after mixed earnings.',
      sentiment: 'neutral',
      impact_score: 62,
      source: 'InvestIQ Insights',
      related_stocks: 'AAPL, MSFT, NVDA',
    },
    {
      id: 'sample-2',
      title: 'Energy rallies on demand outlook upgrade',
      description: 'Refined product demand shows early strength, lifting major energy producers.',
      sentiment: 'positive',
      impact_score: 74,
      source: 'Global Markets Desk',
      related_stocks: 'XOM, CVX',
    },
    {
      id: 'sample-3',
      title: 'Consumer discretionary faces margin pressure',
      description: 'Rising input costs weigh on near‑term guidance across mid‑cap retailers.',
      sentiment: 'negative',
      impact_score: 58,
      source: 'Retail Pulse',
      related_stocks: 'WMT, TGT',
    },
  ]

  const placeholderHighlights = [
    { label: 'Market Sentiment', value: 'Neutral', tone: 'neutral' },
    { label: 'Top Sector', value: 'Energy', tone: 'positive' },
    { label: 'Volatility', value: 'Moderate', tone: 'neutral' },
  ]

  useEffect(() => {
    fetchNews()
  }, [filter])

  const fetchNews = async () => {
    try {
      let endpoint = '/news/'
      if (filter === 'trending') {
        endpoint = '/news/trending/'
      } else if (filter !== 'all') {
        endpoint = `/news/by-sentiment/?sentiment=${filter}`
      }
      
      const response = await api.get(endpoint)
      setNews(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const isEmpty = !loading && news.length === 0
  const displayNews = news.length > 0 ? news : placeholderStories

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Financial News 📰</h1>

          {/* Filter */}
          <div className="flex gap-4 mb-8">
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
              darkMode={darkMode}
            >
              All News
            </FilterButton>
            <FilterButton 
              active={filter === 'trending'} 
              onClick={() => setFilter('trending')}
              darkMode={darkMode}
            >
              Trending
            </FilterButton>
            <FilterButton 
              active={filter === 'positive'} 
              onClick={() => setFilter('positive')}
              darkMode={darkMode}
            >
              Positive
            </FilterButton>
            <FilterButton 
              active={filter === 'negative'} 
              onClick={() => setFilter('negative')}
              darkMode={darkMode}
            >
              Negative
            </FilterButton>
            <FilterButton 
              active={filter === 'neutral'} 
              onClick={() => setFilter('neutral')}
              darkMode={darkMode}
            >
              Neutral
            </FilterButton>
          </div>

          {isEmpty && (
            <div className={`rounded-xl p-6 mb-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Market Brief</p>
                  <h2 className={`text-2xl font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Live news is syncing. Here’s a preview layout.
                  </h2>
                  <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    This section will populate automatically once feeds are available.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {placeholderHighlights.map((item) => (
                    <div
                      key={item.label}
                      className={`px-4 py-3 rounded-lg min-w-[160px] ${
                        darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.label}
                      </p>
                      <p className={`mt-1 text-sm font-semibold ${
                        item.tone === 'positive'
                          ? darkMode ? 'text-green-400' : 'text-green-700'
                          : item.tone === 'negative'
                            ? darkMode ? 'text-red-400' : 'text-red-700'
                            : darkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* News List */}
          {loading ? (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading news...</p>
          ) : (
            <div className="space-y-6">
              {displayNews.map((article) => (
                <div key={article.id} className={`rounded-lg shadow p-6 hover:shadow-lg transition ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{article.title}</h3>
                        {isEmpty && (
                          <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            Sample
                          </span>
                        )}
                      </div>
                      <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{article.description}</p>
                      
                      <div className="mt-4 flex items-center gap-4 flex-wrap">
                        <SentimentBadge sentiment={article.sentiment} darkMode={darkMode} />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Impact: {article.impact_score}/100</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Source: {article.source}</span>
                        {article.related_stocks && (
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            darkMode
                              ? 'bg-blue-900/30 text-blue-400'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {article.related_stocks}
                          </span>
                        )}
                      </div>
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

function FilterButton({ active, onClick, children, darkMode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        active
          ? darkMode
            ? 'bg-blue-700 text-white'
            : 'bg-blue-600 text-white'
          : darkMode
            ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  )
}

function SentimentBadge({ sentiment, darkMode }) {
  const sentimentMap = {
    positive: {
      bg: darkMode ? 'bg-green-900/30' : 'bg-green-100',
      text: darkMode ? 'text-green-400' : 'text-green-800',
      label: '😊 Positive',
    },
    negative: {
      bg: darkMode ? 'bg-red-900/30' : 'bg-red-100',
      text: darkMode ? 'text-red-400' : 'text-red-800',
      label: '😟 Negative',
    },
    neutral: {
      bg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
      text: darkMode ? 'text-gray-300' : 'text-gray-800',
      label: '😐 Neutral',
    },
  }
  
  const style = sentimentMap[sentiment] || sentimentMap.neutral
  
  return (
    <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-medium`}>
      {style.label}
    </span>
  )
}
