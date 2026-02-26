import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { darkMode } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/request-password-reset/', { email })
      setSuccess(response.data?.message || 'If the email exists, a reset link has been sent.')
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to send reset email. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 to-blue-600'} flex items-center justify-center p-4`}>
      <div className={`${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'} rounded-lg shadow-2xl p-8 w-full max-w-md`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Reset Password</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>We will email you a reset link</p>
        </div>

        {error && (
          <div className={`border ${darkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'} px-4 py-3 rounded-lg mb-6 flex items-center`}>
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={`border ${darkMode ? 'bg-green-900/20 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700'} px-4 py-3 rounded-lg mb-6 flex items-center`}>
            <span className="mr-2">✓</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className={`w-full py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-blue-700 text-white hover:bg-blue-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className={`font-medium hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
