import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    fetchCourse()
    fetchProgress()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/learning/courses/${courseId}/`)
      setCourse(response.data)
      setLessons(response.data.lessons || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProgress = async () => {
    try {
      const response = await api.get(`/learning/courses/${courseId}/progress/`)
      setProgress(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading course...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/learning/courses')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← Back to Courses
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-80 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-6xl">📚</span>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{course.description}</p>

            {progress && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">Progress</span>
                  <span className="text-blue-600 font-bold">{progress.completion_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress.completion_percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {progress.lessons_completed} of {progress.total_lessons} lessons completed
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => navigate(`/learning/lessons/${lesson.id}`)}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.content_preview || 'Click to view lesson'}</p>
                  </div>
                  {lesson.completed && <span className="text-green-600 text-lg">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
