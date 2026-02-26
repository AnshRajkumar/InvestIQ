import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function QuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/learning/quizzes/${quizId}/`)
      setQuiz(response.data)
      setQuestions(response.data.questions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    })
  }

  const handleSubmitQuiz = async () => {
    try {
      const response = await api.post(`/learning/quizzes/${quizId}/submit/`, {
        answers: Object.entries(answers).map(([questionId, answerId]) => ({
          question_id: parseInt(questionId),
          answer_id: answerId
        }))
      })
      setResult(response.data)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert('Failed to submit quiz')
    }
  }

  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    )
  }

  if (submitted && result) {
    const percentage = (result.score / result.total_questions) * 100
    const passed = percentage >= (quiz.passing_score || 70)

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className={`text-6xl mb-4 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {passed ? '🎉' : '📊'}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {passed ? 'Quiz Passed!' : 'Quiz Completed'}
            </h1>
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {percentage.toFixed(1)}%
            </div>
            <p className="text-gray-600 mb-8">
              You got {result.score} out of {result.total_questions} questions correct
            </p>

            {passed && (
              <p className="text-green-600 font-semibold mb-8">✓ You passed this quiz!</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/learning/quizzes')}
                className="bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => navigate('/learning/courses')}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No questions in this quiz</p>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-blue-600 h-1" style={{ width: `${progress}%` }}></div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-8">{question.question_text}</h3>

            <div className="space-y-4 mb-8">
              {question.answers && question.answers.map((answer) => (
                <label
                  key={answer.id}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={answer.id}
                    checked={answers[question.id] === answer.id}
                    onChange={() => handleSelectAnswer(question.id, answer.id)}
                    className="w-5 h-5"
                  />
                  <span className="text-gray-900">{answer.answer_text}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                ← Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
