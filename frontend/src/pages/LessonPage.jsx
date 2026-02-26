import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const response = await api.get(`/learning/lessons/${lessonId}/`)
      setLesson(response.data)
      setCompleted(response.data.completed || false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteLesson = async () => {
    try {
      await api.post(`/learning/lessons/${lessonId}/complete/`)
      setCompleted(true)
      alert('Lesson completed! Great progress!')
    } catch (err) {
      console.error(err)
      alert('Failed to mark lesson as complete')
    }
  }

  if (loading || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading lesson...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
            <span className="text-white text-5xl">📖</span>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{lesson.title}</h1>

            <div className="prose max-w-none mb-8">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>

            {lesson.learning_objectives && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Learning Objectives</h3>
                <ul className="space-y-2">
                  {lesson.learning_objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!completed && (
              <button
                onClick={handleCompleteLesson}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Mark as Complete ✓
              </button>
            )}

            {completed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-semibold">✓ You have completed this lesson</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate('/learning/courses')}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Courses
              </button>
              <button
                onClick={() => navigate('/learning/quizzes')}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Take a Quiz →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
