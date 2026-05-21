'use client'

import { useState } from 'react'
import { setModuleStatus } from '@/app/actions/completeModule'

const UNDERSTAND_QUESTIONS = [
  'You must behave with integrity at work and at home.',
  'You must look for ways to do your job better.',
  'You must be a good example for other officers and for the community.',
  'You must be accountable for your behaviour.',
  'You must keep physically fit.',
  'You must find ways to keep stress low.',
]

const EXPLAIN_QUESTIONS = [
  'The RSIPF Code of Ethics?',
  'The RSIPF Sexual Harassment in the Workplace Policy?',
  'What ethics are?',
  'The purpose of the Probationary Constable Program?',
  'The importance of building close working relationships at work?',
  'How to build close working relationships at work?',
]

const ALL_QUESTIONS = [...UNDERSTAND_QUESTIONS, ...EXPLAIN_QUESTIONS]

interface Props {
  moduleId: string
  completed: boolean
}

export const SelfCheck = ({ moduleId, completed: initialCompleted }: Props) => {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(ALL_QUESTIONS.map((_, i) => [i, null]))
  )
  const [done, setDone] = useState(initialCompleted)
  const [attempted, setAttempted] = useState(false)
  const [loading, setLoading] = useState(false)

  const setAnswer = (index: number, value: boolean) =>
    setAnswers((prev) => ({ ...prev, [index]: value }))

  const allAnswered = ALL_QUESTIONS.every((_, i) => answers[i] !== null)
  const allYes = ALL_QUESTIONS.every((_, i) => answers[i] === true)
  const hasNo = ALL_QUESTIONS.some((_, i) => answers[i] === false)

  const handleSubmit = async () => {
    setAttempted(true)
    if (!allAnswered || !allYes) return
    setLoading(true)
    await setModuleStatus(moduleId, 'ready-for-assessment')
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="card" style={{ borderLeft: '4px solid #2d6a4f', background: '#f0faf4' }}>
        <span className="eyebrow" style={{ color: '#2d6a4f' }}>Self-Check Complete</span>
        <h3 className="card__title mt-2">You are ready for assessment.</h3>
        <p className="card__sub mt-1">
          This module is marked as <strong>Ready for assessment</strong> in your reports.
        </p>
      </div>
    )
  }

  const renderSection = (heading: string, questions: string[], offset: number) => (
    <div className="mb-6">
      <p className="font-semibold mb-3" style={{ color: '#0a1f3a', fontSize: '0.9375rem' }}>
        {heading}
      </p>
      {questions.map((q, i) => {
        const idx = offset + i
        const isYes = answers[idx] === true
        const isNo = answers[idx] === false
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '0.625rem 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <span style={{ flex: 1, fontSize: '0.9375rem', paddingTop: '0.125rem' }}>{q}</span>
            <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setAnswer(idx, true)}
                className="btn btn--sm"
                style={isYes ? { background: '#2d6a4f', color: '#fff', borderColor: '#2d6a4f' } : { opacity: 0.5 }}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setAnswer(idx, false)}
                className="btn btn--sm btn--secondary"
                style={isNo ? { opacity: 1 } : { opacity: 0.5 }}
              >
                NO
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="card">
      <span className="eyebrow">Activity</span>
      <h3 className="card__title mt-2 mb-6">Self-Check</h3>

      {renderSection('DO YOU UNDERSTAND that:', UNDERSTAND_QUESTIONS, 0)}
      {renderSection('CAN YOU EXPLAIN:', EXPLAIN_QUESTIONS, UNDERSTAND_QUESTIONS.length)}

      {attempted && !allAnswered && (
        <p className="t-mono mt-4" style={{ color: '#c1121f', fontSize: '0.875rem' }}>
          Please answer all questions before submitting.
        </p>
      )}
      {attempted && allAnswered && hasNo && (
        <p className="t-mono mt-4" style={{ color: '#c1121f', fontSize: '0.875rem' }}>
          You have answered NO to one or more questions. Ask your trainer for help before proceeding.
        </p>
      )}

      <div className="mt-6">
        <button type="button" className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
