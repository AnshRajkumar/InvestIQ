import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true)
    return
  }

  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

export default function SettingsPage() {
  const { user, darkMode, setDarkMode, fetchUserProfile } = useAuth()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('account')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [changePasswordForm, setChangePasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [changePasswordError, setChangePasswordError] = useState('')
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('')
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      newsletterEmails: true,
      portfolioUpdates: true,
      priceAlerts: true,
    },
    privacy: {
      profilePublic: false,
      showActivity: false,
      allowMessages: true,
    },
  })

  const [savedMessage, setSavedMessage] = useState('')
  const premiumUntilLabel = user?.premium_until ? new Date(user.premium_until).toLocaleDateString() : null

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [location.search])

  const handleToggle = (section, key) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: !settings[section][key],
      },
    })
    setSavedMessage('Settings updated!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleUpgrade = async () => {
    setPaymentError('')
    setPaymentStatus('')
    setProcessingPayment(true)

    try {
      const response = await api.post('/payments/create-order/', { amount: 1 })
      const { razorpay_key_id, razorpay_order_id, amount, currency, is_demo_mode } = response.data

      if (is_demo_mode) {
        // Demo mode: auto-verify immediately
        try {
          await api.post('/payments/verify/', {
            razorpay_order_id,
            razorpay_payment_id: `pay_demo_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_signature: `sig_demo_${Math.random().toString(36).substr(2, 9)}`,
          })
          await fetchUserProfile()
          setPaymentStatus('🎉 Demo payment processed successfully! Premium is now active.')
        } catch (error) {
          setPaymentError('Demo payment verification failed.')
        }
        setProcessingPayment(false)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setPaymentError('Razorpay checkout failed to load.')
        setProcessingPayment(false)
        return
      }

      const options = {
        key: razorpay_key_id,
        amount: amount * 100,
        currency,
        name: 'InvestIQ Premium',
        description: 'Premium membership (prototype)',
        order_id: razorpay_order_id,
        prefill: {
          name: user?.first_name || 'InvestIQ User',
          email: user?.email || '',
        },
        handler: async (paymentResult) => {
          try {
            await api.post('/payments/verify/', paymentResult)
            await fetchUserProfile()
            setPaymentStatus('🎉 Payment verified! Premium is now active.')
          } catch (error) {
            setPaymentError('Payment verification failed. Please try again.')
          }
        },
        theme: {
          color: '#2563eb',
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      setPaymentError('Unable to create payment order. Please try again.')
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setChangePasswordError('')
    setChangePasswordSuccess('')

    // Validation
    if (!changePasswordForm.old_password || !changePasswordForm.new_password || !changePasswordForm.confirm_password) {
      setChangePasswordError('All fields are required')
      return
    }

    if (changePasswordForm.new_password !== changePasswordForm.confirm_password) {
      setChangePasswordError('New passwords do not match')
      return
    }

    if (changePasswordForm.new_password.length < 8) {
      setChangePasswordError('New password must be at least 8 characters')
      return
    }

    setChangePasswordLoading(true)

    try {
      await api.post('/auth/change-password/', {
        old_password: changePasswordForm.old_password,
        new_password: changePasswordForm.new_password,
        confirm_password: changePasswordForm.confirm_password,
      })
      setChangePasswordSuccess('✅ Password changed successfully!')
      setChangePasswordForm({ old_password: '', new_password: '', confirm_password: '' })
      setTimeout(() => {
        setShowChangePasswordModal(false)
        setChangePasswordSuccess('')
      }, 2000)
    } catch (error) {
      setChangePasswordError(error.response?.data?.error || 'Failed to change password')
    } finally {
      setChangePasswordLoading(false)
    }
  }

  const tabs = [
    { id: 'account', label: 'Account Settings', icon: 'user' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'privacy', label: 'Privacy', icon: 'lock' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'subscription', label: 'Subscription', icon: 'star' },
  ]

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 h-fit`}>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Account Settings
                </h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className={`w-full px-4 py-2 border rounded-lg ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-gray-400'
                          : 'bg-white border-gray-300 text-gray-600'
                      }`}
                    />
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Contact support to change your email address
                    </p>
                  </div>

                  {/* Password */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Password
                    </label>
                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Two-Factor Authentication
                        </label>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Add an extra layer of security
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                        Enable
                      </button>
                    </div>
                  </div>

                  {/* Session Management */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                      Active Sessions
                    </label>
                    <div className={`p-3 rounded border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-300 bg-gray-100'} mb-3`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Session</p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>macOS Chrome • Now</p>
                    </div>
                    <button className="text-red-600 dark:text-red-400 text-sm hover:underline">
                      Logout from all other sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {key === 'emailNotifications' && 'Email Notifications'}
                          {key === 'newsletterEmails' && 'Newsletter Emails'}
                          {key === 'portfolioUpdates' && 'Portfolio Updates'}
                          {key === 'priceAlerts' && 'Price Alerts'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggle('notifications', key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          value ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === 'privacy' && (
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Privacy Settings
                </h2>

                <div className="space-y-4">
                  {Object.entries(settings.privacy).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {key === 'profilePublic' && 'Make Profile Public'}
                          {key === 'showActivity' && 'Show Activity Status'}
                          {key === 'allowMessages' && 'Allow Messages from Others'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggle('privacy', key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          value ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Data Management */}
                <div className="mt-8 pt-8 border-t dark:border-gray-700">
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Data Management
                  </h3>
                  <button className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
                    Download Your Data
                  </button>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Appearance
                </h2>

                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    Theme
                  </label>

                  <div className="space-y-3">
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        !darkMode
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414-1.414l-.707-.707zM5 8a1 1 0 100-2H4a1 1 0 100 2h1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Light</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Comfortable for daytime</p>
                        </div>
                        {!darkMode && (
                          <svg className="w-5 h-5 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setDarkMode(true)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        darkMode
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dark</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Easy on the eyes</p>
                        </div>
                        {darkMode && (
                          <svg className="w-5 h-5 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {savedMessage && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                    {savedMessage}
                  </div>
                )}
              </div>
            )}

            {/* Subscription */}
            {activeTab === 'subscription' && (
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Subscription Management
                </h2>

                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className={`p-6 rounded-lg border-2 ${
                    user?.is_premium 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user?.is_premium ? 'Premium Plan' : 'Free Plan'}
                        </h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user?.is_premium 
                            ? 'You have access to all premium features' 
                            : 'Upgrade to unlock premium features'}
                        </p>
                      </div>
                      {user?.is_premium && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                          Active
                        </span>
                      )}
                    </div>

                    {user?.is_premium && (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Next billing date: {premiumUntilLabel || 'Not available'}
                      </p>
                    )}
                  </div>

                  {/* Plan Features */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Plan Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Advanced Analytics
                          </span>
                        </div>
                        {user?.is_premium ? (
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Full access to analytics
                          </p>
                        ) : (
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Limited analytics
                          </p>
                        )}
                      </div>

                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Real-time Alerts
                          </span>
                        </div>
                        {user?.is_premium ? (
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Instant price alerts
                          </p>
                        ) : (
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Delayed alerts
                          </p>
                        )}
                      </div>

                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Priority Support
                          </span>
                        </div>
                        {user?.is_premium ? (
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            24/7 dedicated support
                          </p>
                        ) : (
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Email support only
                          </p>
                        )}
                      </div>

                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Custom Portfolios
                          </span>
                        </div>
                        {user?.is_premium ? (
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Unlimited portfolios
                          </p>
                        ) : (
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            1 portfolio only
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!user?.is_premium && (
                    <div className="pt-6 border-t dark:border-gray-700 space-y-3">
                      <button
                        onClick={handleUpgrade}
                        disabled={processingPayment}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{processingPayment ? 'Processing...' : 'Upgrade to Premium (Rs 1)'}</span>
                      </button>
                      {paymentStatus && (
                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm">
                          {paymentStatus}
                        </div>
                      )}
                      {paymentError && (
                        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm">
                          {paymentError}
                        </div>
                      )}
                    </div>
                  )}

                  {user?.is_premium && (
                    <div className="pt-6 border-t dark:border-gray-700 space-y-3">
                      <button className="w-full px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        View Billing History
                      </button>
                      <button className="w-full px-6 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                        Cancel Subscription
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-lg p-6 w-full max-w-md mx-4`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Old Password */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={changePasswordForm.old_password}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, old_password: e.target.value })}
                  placeholder="Enter your current password"
                  className={`w-full px-4 py-2 border rounded-lg ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={changePasswordForm.new_password}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, new_password: e.target.value })}
                  placeholder="Enter new password (min 8 characters)"
                  className={`w-full px-4 py-2 border rounded-lg ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={changePasswordForm.confirm_password}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirm_password: e.target.value })}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-2 border rounded-lg ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Error Message */}
              {changePasswordError && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                  <p className="text-sm text-red-400">{changePasswordError}</p>
                </div>
              )}

              {/* Success Message */}
              {changePasswordSuccess && (
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <p className="text-sm text-green-400">{changePasswordSuccess}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={changePasswordLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition"
                >
                  {changePasswordLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(false)
                    setChangePasswordForm({ old_password: '', new_password: '', confirm_password: '' })
                    setChangePasswordError('')
                    setChangePasswordSuccess('')
                  }}
                  className={`flex-1 px-4 py-2 border rounded-lg transition ${
                    darkMode
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
