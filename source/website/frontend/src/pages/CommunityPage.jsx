import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import CommentsSection from '../components/CommentsSection'

export default function CommunityPage() {
  const { user, darkMode } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [trendingPosts, setTrendingPosts] = useState([])
  const [content, setContent] = useState('')
  const [activeTab, setActiveTab] = useState('latest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareNotice, setShareNotice] = useState({ postId: null, message: '' })

  const isPremium = Boolean(user?.is_premium)

  const extractResults = (data) => data?.results || data || []

  const loadPosts = async (tab) => {
    setLoading(true)
    try {
      const endpoint = tab === 'trending' ? '/community/trending/' : '/community/posts/'
      const response = await api.get(endpoint)
      setPosts(extractResults(response.data))
      setError('')
    } catch (err) {
      if (err.response?.status === 403) {
        setError('💎 Community is a Premium feature. Upgrade to access.')
      } else {
        setError('Unable to load community posts.')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadTrending = async () => {
    try {
      const response = await api.get('/community/trending/')
      setTrendingPosts(extractResults(response.data).slice(0, 5))
    } catch (err) {
      setTrendingPosts([])
    }
  }

  useEffect(() => {
    loadPosts(activeTab)
    loadTrending()
  }, [activeTab])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!content.trim()) {
      return
    }

    try {
      const response = await api.post('/community/posts/', { content })
      setPosts((prev) => [response.data, ...prev])
      setContent('')
      setError('')
      loadTrending()
    } catch (err) {
      setError('Unable to publish your post.')
    }
  }

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await api.delete(`/community/posts/${postId}/like/`)
      } else {
        await api.post(`/community/posts/${postId}/like/`)
      }

      const updatePost = (post) => {
        if (post.id !== postId) return post
        return {
          ...post,
          is_liked: !post.is_liked,
          like_count: post.is_liked ? post.like_count - 1 : post.like_count + 1
        }
      }

      setPosts((prev) => prev.map(updatePost))
      setTrendingPosts((prev) => prev.map(updatePost))
      loadTrending()
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  const handleShare = async (postId) => {
    const link = `${window.location.origin}/community?post=${postId}`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link)
      } else {
        window.prompt('Copy this link:', link)
      }
      setShareNotice({ postId, message: 'Link copied' })
      setTimeout(() => setShareNotice({ postId: null, message: '' }), 2000)
    } catch (err) {
      window.prompt('Copy this link:', link)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  const renderBadge = (label, colorClass) => (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
      {label}
    </span>
  )

  const renderVerifiedIcon = () => (
    <span title="Verified" className="inline-flex items-center">
      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </span>
  )

  const renderPremiumIcon = () => (
    <span className="inline-flex items-center" title="Premium">
      <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 16l-3-9 6 4 4-6 4 6 6-4-3 9H5zm1.5 4a1.5 1.5 0 010-3h11a1.5 1.5 0 010 3h-11z" />
      </svg>
    </span>
  )

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} px-4 sm:px-6 lg:px-8 py-10`}
      style={{
        backgroundImage: darkMode
          ? 'radial-gradient(circle at top, rgba(59, 130, 246, 0.16), transparent 45%)'
          : 'radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 50%)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Community Pulse
            </h1>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700'}`}>
              💎 Premium
            </span>
          </div>
          <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 max-w-2xl`}>
            Track the most active market conversations, follow verified traders, and dive into trending insights.
          </p>
        </div>

        {!isPremium ? (
          <div className={`${darkMode ? 'bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border-yellow-800' : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'} border rounded-2xl p-8 mb-8`}>
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-yellow-500 mb-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16l-3-9 6 4 4-6 4 6 6-4-3 9H5zm1.5 4a1.5 1.5 0 010-3h11a1.5 1.5 0 010 3h-11z" />
              </svg>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'} mb-2`}>
                Unlock Community Premium
              </h2>
              <p className={`${darkMode ? 'text-yellow-100' : 'text-yellow-700'} mb-6 max-w-md`}>
                Access exclusive community discussions, engage with verified traders, and gain premium insights.
              </p>
              <button
                onClick={() => navigate('/settings?tab=subscription')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold rounded-full hover:from-yellow-600 hover:to-amber-600 transition"
              >
                Upgrade Now →
              </button>
            </div>
          </div>
        ) : null}

        <div className={`lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8 ${!isPremium ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            {/* Tabs */}
            <div className={`flex gap-2 mb-6 p-1 rounded-full ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveTab('latest')}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeTab === 'latest'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeTab === 'trending'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trending
              </button>
            </div>

            {/* Post Composer */}
            {isPremium ? (
            <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 mb-6 sticky top-20 z-10`}> 
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <span className={`text-lg font-bold ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share a market insight, a chart, or a question..."
                    rows={3}
                    className={`w-full text-lg resize-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <div className="flex justify-between items-center gap-4 mt-4">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button
                      type="submit"
                      disabled={!content.trim()}
                      className="ml-auto px-6 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </form>
            ) : null}

            {/* Posts Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'} rounded-2xl p-8 text-center`}>
                  <div className="inline-block">
                    <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
                  </div>
                  <p className="mt-4">Loading community posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className={`${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} border ${darkMode ? 'border-gray-800' : 'border-gray-200'} rounded-2xl p-8 text-center`}>
                  <p className="text-lg">No posts yet</p>
                  <p className="text-sm mt-2">Be the first to share your market insights!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className={`${darkMode ? 'bg-gray-900 hover:bg-gray-800 border-gray-800' : 'bg-white hover:bg-gray-50 border-gray-200'} border rounded-2xl p-6 transition`}
                  >
                    {/* Post Header */}
                    <div className="flex gap-4">
                      <Link
                        to={`/community/user/${post.author}`}
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}
                      >
                        <span className={`font-bold text-lg ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                          {post.author_name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            to={`/community/user/${post.author}`}
                            className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} hover:underline`}
                          >
                            {post.author_name || 'Community Member'}
                          </Link>
                          <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
                            @{post.author_name?.toLowerCase().replace(/\s/g, '')}
                          </p>
                          <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
                            · {formatDate(post.created_at)}
                          </p>
                          {post.author_is_verified && renderVerifiedIcon()}
                          {post.author_is_premium && renderPremiumIcon()}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mt-3 ml-16">
                      <p className={`text-base leading-normal ${darkMode ? 'text-gray-100' : 'text-gray-900'} whitespace-pre-wrap break-words`}>
                        {post.content}
                      </p>
                    </div>

                    {/* Post Actions */}
                    <div className={`mt-4 ml-16 flex items-center gap-8 ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} pt-3`}>
                      <button
                        onClick={() => handleLike(post.id, post.is_liked)}
                        className={`flex items-center gap-2 group transition ${
                          post.is_liked
                            ? 'text-red-500'
                            : 'hover:text-red-500'
                        }`}
                      >
                        {post.is_liked ? (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                        <span className={`${post.like_count > 0 ? 'group-hover:text-red-400' : ''}`}>
                          {post.like_count > 0 ? post.like_count : ''}
                        </span>
                      </button>

                      <button
                        onClick={() => handleShare(post.id)}
                        className={`flex items-center gap-2 transition ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Share</span>
                      </button>

                      {shareNotice.postId === post.id && (
                        <span className="text-xs text-green-500">{shareNotice.message}</span>
                      )}
                    </div>

                    {/* Comments Section */}
                    <CommentsSection postId={post.id} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="mt-10 lg:mt-0">
            <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 sticky top-24`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Trending Chats
                </h2>
                <span className={`text-xs uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Hot
                </span>
              </div>

              {trendingPosts.length === 0 ? (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  No trending posts yet. Like a post to boost it here.
                </p>
              ) : (
                <div className="space-y-4">
                  {trendingPosts.map((post, index) => (
                    <Link
                      to={`/community/user/${post.author}`}
                      key={post.id}
                      className={`block p-3 rounded-xl transition ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-xs uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            #{index + 1} Trending
                          </p>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-sm mt-1`}>
                            {post.author_name}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 overflow-hidden`}>
                            {post.content}
                          </p>
                        </div>
                        <div className={`text-xs font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                          {post.like_count} likes
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
