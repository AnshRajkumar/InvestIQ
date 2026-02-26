import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, loginWithGoogle, isAuthenticated, darkMode } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const googleButtonRef = useRef(null)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
    if (searchParams.get('registered')) {
      setSuccess('Registration successful! Please login.')
    }
  }, [isAuthenticated, navigate, searchParams])

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current || !window.google?.accounts?.id) {
      return
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        setError('')
        setSuccess('')
        setLoading(true)
        try {
          await loginWithGoogle(response.credential)
          navigate('/dashboard')
        } catch (err) {
          const errorMsg = err.response?.data?.error || 'Google login failed. Please try again.'
          setError(errorMsg)
        } finally {
          setLoading(false)
        }
      },
    })

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: darkMode ? 'filled_black' : 'outline',
      size: 'large',
      width: 360,
    })
  }, [googleClientId, loginWithGoogle, navigate, darkMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Login failed. Check your credentials.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 to-blue-600'} flex items-center justify-center p-4`}>
      <div className={`${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'} rounded-lg shadow-2xl p-8 w-full max-w-md`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>InvestIQ</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AI-Powered Finance Education</p>
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

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-2.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className={`text-xs hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`w-full py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-blue-700 text-white hover:bg-blue-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block animate-spin">⚙️</span> Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {googleClientId && (
          <div className="mt-6">
            <div className={`flex items-center gap-3 text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <span>or continue with</span>
              <span className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
            <div ref={googleButtonRef} className="flex justify-center" />
          </div>
        )}

        <div className="mt-6 text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <Link to="/register" className={`font-medium hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Create one now
            </Link>
          </p>
        </div>

        <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs text-center mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Try with test account:</p>
          <div className={`p-3 rounded-lg space-y-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong>Email:</strong> admin@example.com</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
