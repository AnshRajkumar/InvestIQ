import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { darkMode } = useAuth()

  useEffect(() => {
    const uid = searchParams.get('uid')
    const token = searchParams.get('token')

    if (!uid || !token) {
      setError('Invalid verification link')
      setLoading(false)
      return
    }

    const verify = async () => {
      try {
        const response = await api.post('/auth/verify-email/', { uid, token })
        setSuccess(response.data?.message || 'Email verified successfully.')
      } catch (err) {
        setError(err.response?.data?.error || 'Verification failed. Please request a new link.')
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [searchParams])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 to-blue-600'} flex items-center justify-center p-4`}>
      <div className={`${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'} rounded-lg shadow-2xl p-8 w-full max-w-md text-center`}>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Email Verification</h1>

        {loading && <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Verifying your email...</p>}

        {!loading && success && (
          <div className={`border ${darkMode ? 'bg-green-900/20 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700'} px-4 py-3 rounded-lg mt-6 flex items-center justify-center`}>
            <span className="mr-2">✓</span>
            <span>{success}</span>
          </div>
        )}

        {!loading && error && (
          <div className={`border ${darkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'} px-4 py-3 rounded-lg mt-6 flex items-center justify-center`}>
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6">
          <Link to="/login" className={`font-medium hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
