'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const LessonClient = ({
  lessonId,
  courseId,
}: {
  lessonId: string | number
  courseId: string | number
  userId: string | number
}) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const markComplete = async () => {
    setSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, courseId }),
      })
      if (!res.ok) throw new Error('Could not save progress')
      const body = await res.json()
      setMessage(`Progress saved — ${body.percentageComplete}% of course complete`)
      setDone(true)
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card" style={{ background: 'var(--navy-50)', borderColor: 'var(--navy-100)' }}>
      <div className="stage-nav" style={{ borderTop: 0, paddingTop: 0, marginTop: 0 }}>
        <div className="stage-nav__left">
          <p className="t-base" style={{ margin: 0, color: 'var(--gray-800)' }}>
            Finished this lesson? Mark it complete to update your progress.
          </p>
        </div>
        <div className="stage-nav__right">
          <button
            onClick={markComplete}
            disabled={submitting || done}
            className="btn"
          >
            {submitting ? 'Saving…' : done ? 'Saved' : 'Mark lesson complete'}
          </button>
        </div>
      </div>
      {message && (
        <p className="t-mono" style={{ marginTop: 'var(--sp-3)' }}>
          {message}
        </p>
      )}
    </div>
  )
}
