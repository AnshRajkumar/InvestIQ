import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function CommunityProfilePage() {
  const { userId } = useParams()
  const { darkMode } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileResponse, postsResponse] = await Promise.all([
          api.get(`/auth/profile/${userId}/`),
          api.get(`/community/posts/user/${userId}/`)
        ])
        setProfile(profileResponse.data)
        setPosts(postsResponse.data.results || postsResponse.data)
        setError('')
      } catch (err) {
        setError('Unable to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'} mx-auto`}></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error || 'Profile not found.'}</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} px-4 sm:px-6 lg:px-8 py-10`}>
      <div className="max-w-4xl mx-auto">
        <Link to="/community" className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
          Back to Community
        </Link>

        {/* Profile Header */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-8 mt-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <span className={`text-3xl font-bold ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                {profile.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profile.first_name || profile.last_name ? `${profile.first_name} ${profile.last_name}`.trim() : profile.username}
                </h1>
                <span className={`${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>@{profile.username}</span>
                {profile.is_email_verified && (
                  <span title="Verified" className="inline-flex items-center">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {profile.is_premium && (
                  <span className={`inline-flex items-center`} title="Premium">
                    <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16l-3-9 6 4 4-6 4 6 6-4-3 9H5zm1.5 4a1.5 1.5 0 010-3h11a1.5 1.5 0 010 3h-11z" />
                    </svg>
                  </span>
                )}
                <Link
                  to={`/personal-chat?user=${profile.id}`}
                  className="ml-auto px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Message
                </Link>
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Joined {formatDate(profile.created_at)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{profile.total_posts}</p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Posts</p>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{profile.total_likes}</p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Likes Received</p>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posts.length}</p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Chats</p>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="mt-8 space-y-4">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Chats
          </h2>
          {posts.length === 0 ? (
            <div className={`${darkMode ? 'bg-gray-900 text-gray-400 border-gray-800' : 'bg-white text-gray-600 border-gray-200'} border rounded-2xl p-6`}>
              No posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
                <p className={`${darkMode ? 'text-gray-100' : 'text-gray-900'} whitespace-pre-wrap`}>{post.content}</p>
                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-3`}>
                  {formatDate(post.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
