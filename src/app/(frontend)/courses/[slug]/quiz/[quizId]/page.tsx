import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { QuizClient } from './QuizClient'

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; quizId: string }>
}) {
  const { slug, quizId } = await params
  const { payload, user } = await requireUser()

  let quiz
  try {
    quiz = await payload.findByID({ collection: 'quizzes', id: quizId, user })
  } catch {
    notFound()
  }

  const attempts = await payload.find({
    collection: 'attempts',
    where: {
      and: [{ officer: { equals: user.id } }, { quiz: { equals: quizId } }],
    },
    limit: 50,
    user,
  })

  const remaining = (quiz.maxAttempts || 3) - attempts.docs.length

  return (
    <div className="shell">
      <nav className="crumbs mb-4">
        <Link href={`/courses/${slug}`}>Back to course</Link>
      </nav>

      <header className="card card--accent mb-5">
        <span className="eyebrow">Knowledge check</span>
        <h1 className="t-h2 mt-2">{quiz.title}</h1>
        <p className="card__sub mt-2">
          Pass mark {quiz.passMark}% · Attempts remaining: {Math.max(0, remaining)}
        </p>
      </header>

      {remaining <= 0 ? (
        <div className="alert alert--warn">
          <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="alert__title">No attempts remaining</p>
            <p className="alert__body">
              You have used all your attempts for this quiz. Speak with your
              instructor to discuss next steps.
            </p>
          </div>
          <span />
        </div>
      ) : (
        <QuizClient quiz={quiz as unknown as Parameters<typeof QuizClient>[0]['quiz']} courseSlug={slug} />
      )}
    </div>
  )
}
