import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const previewMessages = [
  { id: 1, sender: 'AnalystPro', content: 'Your chart setup looks strong today. Watching the breakout.' },
  { id: 2, sender: 'You', content: 'Nice, what levels are you targeting?' },
  { id: 3, sender: 'AnalystPro', content: 'Looking at 4.8% upside with tight risk.' }
]

export default function PersonalChatPage() {
  const { user, darkMode } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isPremium = Boolean(user?.is_premium)
  const targetUserId = searchParams.get('user')

  const previewConversations = useMemo(() => [
    {
      id: 'preview-1',
      other_user: { username: 'AnalystPro', is_email_verified: true, is_premium: true },
      last_message: 'Your chart setup looks strong today.'
    }
  ], [])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await api.get('/direct-messages/conversations/')
      const data = response.data.results || response.data
      setConversations(data)
      setError('')
    } catch (err) {
      setError('Unable to load conversations.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/direct-messages/conversations/${conversationId}/messages/`)
      setMessages(response.data.results || response.data)
    } catch (err) {
      setError('Unable to load messages.')
    }
  }

  const startConversation = async (userId) => {
    try {
      const response = await api.post('/direct-messages/conversations/', { user_id: userId })
      setActiveConversation(response.data)
      await fetchMessages(response.data.id)
    } catch (err) {
      setError('Unable to start conversation.')
    }
  }

  const handleSendMessage = async (event) => {
    event.preventDefault()
    if (!messageText.trim() || !activeConversation) return

    try {
      const response = await api.post(
        `/direct-messages/conversations/${activeConversation.id}/messages/`,
        { content: messageText }
      )
      setMessages((prev) => [...prev, response.data])
      setMessageText('')
      fetchConversations()
    } catch (err) {
      setError('Unable to send message.')
    }
  }

  const handleDeleteMessage = async (messageId, conversationId) => {
    if (!window.confirm('Delete this message?')) return
    
    try {
      await api.delete(`/direct-messages/conversations/${conversationId}/messages/${messageId}/`)
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
    } catch (err) {
      setError('Unable to delete message.')
    }
  }

  useEffect(() => {
    if (!isPremium) return
    fetchConversations()
  }, [isPremium])

  useEffect(() => {
    if (!isPremium) return
    if (targetUserId) {
      startConversation(targetUserId)
    }
  }, [isPremium, targetUserId])

  const displayConversations = isPremium ? conversations : previewConversations
  const displayMessages = isPremium ? messages : previewMessages

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} px-4 sm:px-6 lg:px-8 py-10`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Personal Chat
            </h1>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>
              💎 Premium
            </span>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 max-w-2xl`}>
            One-to-one conversations with traders and mentors. Premium subscribers unlock full access.
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-4 h-full`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Chats</h2>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700'}`}>
                Premium
              </span>
            </div>

            {loading && isPremium ? (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading chats...</p>
            ) : displayConversations.length === 0 ? (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No conversations yet.</p>
            ) : (
              <div className="space-y-3">
                {displayConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => isPremium && setActiveConversation(conversation)}
                    className={`w-full text-left p-3 rounded-xl transition ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {conversation.other_user?.username || 'Chat'}
                      </p>
                      {conversation.other_user?.is_email_verified && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>
                          Verified
                        </span>
                      )}
                    </div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1 overflow-hidden`}>
                      {conversation.last_message || 'Start a conversation'}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 flex flex-col min-h-[420px] relative`}>
            {!isPremium && (
              <div className={`absolute inset-0 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-blue-900/90 to-cyan-900/90 border-blue-800' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'} flex items-center justify-center z-10 border`}>
                <div className="text-center p-8">
                  <svg className="w-16 h-16 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 1z" />
                  </svg>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-blue-200' : 'text-blue-800'} mb-2`}>
                    Unlock Personal Chat Premium
                  </h2>
                  <p className={`${darkMode ? 'text-blue-100' : 'text-blue-700'} mb-6 max-w-md mx-auto`}>
                    Connect directly with verified traders and mentors for exclusive one-to-one conversations.
                  </p>
                  <button
                    onClick={() => navigate('/settings?tab=subscription')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full hover:from-blue-600 hover:to-cyan-600 transition"
                  >
                    Upgrade Now →
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-bold">{activeConversation?.other_user?.username || 'Chat Preview'}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Private messages</p>
              </div>
            </div>

            <div className="flex-1 overflow-auto space-y-4 pr-2">
              {displayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 max-w-[75%] rounded-2xl group ${
                    message.sender === 'You' || message.sender === user?.id
                      ? 'ml-auto'
                      : ''
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 flex-1 ${
                      message.sender === 'You' || message.sender === user?.id
                        ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {isPremium && (message.sender === user?.id || user?.email === 'sunitpanda680@gmail.com') && (
                    <button
                      onClick={() => handleDeleteMessage(message.id, activeConversation?.id)}
                      className="hidden group-hover:block px-2 py-2 text-red-500 hover:text-red-600 text-sm mt-auto"
                      title="Delete message"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Write a message..."
                className={`flex-1 rounded-full px-4 py-2 border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={!isPremium}
              />
              <button
                type="submit"
                disabled={!isPremium || !messageText.trim()}
                className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>

            {error && (
              <p className="text-sm text-red-500 mt-3">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
