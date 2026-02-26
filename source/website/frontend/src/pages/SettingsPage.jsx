import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user, darkMode, setDarkMode } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
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
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
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
                        Next billing date: March 27, 2026
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
                    <div className="pt-6 border-t dark:border-gray-700">
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold">
                        Upgrade to Premium
                      </button>
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
    </div>
  )
}
