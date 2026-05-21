'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Question = {
  questionText: string
  options: { text: string }[]
  correctAnswer: number
  points?: number
}

type Quiz = {
  id: string
  title: string
  passMark: number
  questions: Question[]
}

export const QuizClient = ({ quiz, courseSlug }: { quiz: Quiz; courseSlug: string }) => {
  const TIME_LIMIT_SECONDS = (quiz.questions.length || 1) * 60
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT_SECONDS)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t)
          void submit()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted])

  const submit = async () => {
    if (submitted) return
    setSubmitted(true)
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz.id, answers }),
      })
      if (!res.ok) throw new Error('Submission failed')
      const body = await res.json()
      setResult({ score: body.score, passed: body.passed })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  if (result) {
    return (
      <div className={`card card--accent ${result.passed ? 'card--passed' : 'card--failed'}`}>
        <span className={`badge ${result.passed ? 'badge--success' : 'badge--danger'}`}>
          {result.passed ? 'Passed' : 'Not passed'}
        </span>
        <h2 className="t-h2 mt-3">You scored {result.score}%</h2>
        {!result.passed && (
          <p className="card__sub mt-3">
            Review the lesson and try again when you are ready. Each attempt counts
            toward your maximum.
          </p>
        )}
        <div className="mt-5">
          <Link href={`/courses/${courseSlug}`} className="btn">
            Return to course
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="stack-5">
      <div className="card card--timer">
        <span className="t-eyebrow">Time remaining</span>
        <span className="t-mono quiz-timer__time">{formatTime(secondsLeft)}</span>
      </div>

      {quiz.questions.map((q, qi) => (
        <div key={qi} className="card">
          <p className="t-h4 m-0 mb-3">
            {qi + 1}. {q.questionText}
          </p>
          <div className="stack-3">
            {q.options.map((opt, oi) => (
              <label key={oi} className="radio">
                <input
                  type="radio"
                  name={`q-${qi}`}
                  value={oi}
                  checked={answers[qi] === oi}
                  onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                />
                <span className="radio__box" />
                <span className="check__label">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="field__err">{error}</p>}

      <div className="stage-nav stage-nav--flush">
        <div className="stage-nav__left" />
        <div className="stage-nav__right">
          <button onClick={submit} disabled={submitted} className="btn">
            Submit quiz
          </button>
        </div>
      </div>
    </div>
  )
}
