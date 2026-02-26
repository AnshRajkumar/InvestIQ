import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/learning/quizzes/')
      setQuizzes(response.data.results || response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading quizzes...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessment Quizzes</h1>
        <p className="text-gray-600 mb-8">Test your knowledge and track your progress</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-lg flex items-center justify-center">
                <span className="text-white text-3xl">📝</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>❓ {quiz.questions_count || 0} Questions</p>
                  <p>⏱️ {quiz.time_limit || 30} minutes</p>
                  <p>⭐ Pass Score: {quiz.passing_score || 70}%</p>
                </div>

                <button
                  onClick={() => navigate(`/learning/quizzes/${quiz.id}`)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Start Quiz →
                </button>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No quizzes available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
