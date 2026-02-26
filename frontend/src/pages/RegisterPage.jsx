import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    experience_level: 'beginner',
    risk_tolerance: 'medium',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register, loginWithGoogle, darkMode } = useAuth()
  const navigate = useNavigate()
  const googleButtonRef = useRef(null)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current || !window.google?.accounts?.id) {
      return
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        setErrors({})
        setSuccess('')
        setLoading(true)
        try {
          await loginWithGoogle(response.credential)
          navigate('/dashboard')
        } catch (err) {
          const errorMsg = err.response?.data?.error || 'Google sign up failed. Please try again.'
          setErrors({ form: errorMsg })
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
  }, [googleClientId, loginWithGoogle, navigate])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = (newErrors.password || '') + ' (needs uppercase)'
    }

    if (!/[0-9]/.test(formData.password)) {
      newErrors.password = (newErrors.password || '') + ' (needs number)'
    }

    if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = (newErrors.password || '') + ' (needs special char: !@#$%^&*)'
    }

    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match'
    }

    if (!formData.first_name || formData.first_name.length < 2) {
      newErrors.first_name = 'First name is required (min 2 chars)'
    }

    if (!formData.last_name || formData.last_name.length < 2) {
      newErrors.last_name = 'Last name is required (min 2 chars)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const passwordStrength = useMemo(() => {
    let strength = 0
    const pwd = formData.password
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[!@#$%^&*]/.test(pwd)) strength++
    return { score: strength, text: ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength] }
  }, [formData.password])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await register(formData)
      setSuccess('Account created! Please verify your email. Redirecting to login...')
      setTimeout(() => {
        navigate('/login?registered=true')
      }, 2500)
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Registration failed. Please try again.'
      setErrors({ form: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-500 to-blue-600'} flex items-center justify-center p-4`}>
      <div className={`${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'} rounded-lg shadow-2xl p-8 w-full max-w-lg`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>InvestIQ</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create Your Account</p>
        </div>

        {errors.form && (
          <div className={`border ${darkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'} px-4 py-3 rounded-lg mb-6 flex items-center`}>
            <span className="mr-2">⚠️</span>
            <span>{errors.form}</span>
          </div>
        )}

        {success && (
          <div className={`border ${darkMode ? 'bg-green-900/20 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700'} px-4 py-3 rounded-lg mb-6 flex items-center`}>
            <span className="mr-2">✓</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } ${errors.first_name ? (darkMode ? 'border-red-700' : 'border-red-500') : ''}`}
                placeholder="John"
              />
              {errors.first_name && <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.first_name}</p>}
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } ${errors.last_name ? (darkMode ? 'border-red-700' : 'border-red-500') : ''}`}
                placeholder="Doe"
              />
              {errors.last_name && <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.last_name}</p>}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } ${errors.username ? (darkMode ? 'border-red-700' : 'border-red-500') : ''}`}
              placeholder="johndoe123"
            />
            {errors.username && <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } ${errors.email ? (darkMode ? 'border-red-700' : 'border-red-500') : ''}`}
              placeholder="john@example.com"
            />
            {errors.email && <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } ${errors.password ? (darkMode ? 'border-red-700' : 'border-red-500') : ''}`}
                placeholder="Min 8 chars, uppercase, number, special char"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-2.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className={`flex-1 rounded h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded transition-all ${
                      passwordStrength.score === 1 ? 'bg-red-500 w-1/4' :
                      passwordStrength.score === 2 ? 'bg-yellow-500 w-1/2' :
                      passwordStrength.score === 3 ? 'bg-blue-500 w-3/4' :
                      'bg-green-500 w-full'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{passwordStrength.text}</span>
              </div>
            )}
            {errors.password && <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } ${errors.password2 ? (darkMode ? 'border-red-700' : 'border-red-500') : ''}`}
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`absolute right-3 top-2.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password2 && <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{errors.password2}</p>}
            {formData.password && formData.password2 && formData.password === formData.password2 && (
              <p className={`text-xs mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>✓ Passwords match</p>
            )}
          </div>

          {/* Profile Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Experience Level</label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Risk Tolerance</label>
              <select
                name="risk_tolerance"
                value={formData.risk_tolerance}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className={`w-full py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed mt-6 ${
              darkMode
                ? 'bg-blue-700 text-white hover:bg-blue-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block animate-spin">⚙️</span> Creating Account...
              </span>
            ) : (
              'Create Account'
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
            <p className={`text-xs text-center mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Google sign-up auto-fills your profile and uses secure OAuth (no password needed).
            </p>
          </div>
        )}

        {/* Login Link */}
        <div className={`mt-6 text-center border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-medium hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
