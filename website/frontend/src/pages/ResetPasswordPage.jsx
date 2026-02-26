import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { darkMode } = useAuth()

  const uid = searchParams.get('uid')
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!uid || !token) {
      setError('Invalid reset link')
      return
    }

    if (!password || !password2) {
      setError('Both password fields are required')
      return
    }

    if (password !== password2) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/reset-password/', {
        uid,
        token,
        password,
        password2,
      })
      setSuccess(response.data?.message || 'Password reset successful. Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. Please request a new link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 to-blue-600'} flex items-center justify-center p-4`}>
      <div className={`${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'} rounded-lg shadow-2xl p-8 w-full max-w-md`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Set New Password</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose a strong password</p>
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
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Confirm Password</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-blue-700 text-white hover:bg-blue-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update password'}
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
