import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { LessonClient } from './LessonClient'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const { payload, user } = await requireUser()

  const courseResult = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    limit: 1,
    user,
  })
  const course = courseResult.docs[0]
  if (!course) notFound()

  let lesson
  try {
    lesson = await payload.findByID({
      collection: 'lessons',
      id: lessonId,
      depth: 2,
      user,
    })
  } catch {
    notFound()
  }

  const quizzes = await payload.find({
    collection: 'quizzes',
    where: { lesson: { equals: lessonId } },
    limit: 5,
    user,
  })

  return (
    <div className="shell">
      <nav className="crumbs crumbs--mb">
        <Link href="/courses">Courses</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <Link href={`/courses/${slug}`}>{course.title}</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="current">{lesson.title}</span>
      </nav>

      <header className="card card--accent mb-5">
        <span className="eyebrow">Lesson</span>
        <h1 className="t-h2 card__heading">{lesson.title}</h1>
        <p className="card__sub card__sub--mt">
          {lesson.type} · {lesson.duration || '—'} min
        </p>
      </header>

      <section className="card mb-5">
        {lesson.type === 'video' && lesson.videoUrl && (
          <div className="video-wrap">
            <iframe
              src={lesson.videoUrl}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}
        {lesson.type === 'text' && lesson.content && (
          <pre className="lesson-content">
            {(() => {
              const root = (lesson.content as any)?.root
              const paragraphs: string[] = []
              const walk = (node: any) => {
                if (!node) return
                if (node.text) paragraphs.push(node.text)
                if (Array.isArray(node.children)) node.children.forEach(walk)
              }
              walk(root)
              return paragraphs.join('\n\n')
            })()}
          </pre>
        )}
        {lesson.type === 'document' && lesson.attachments?.length > 0 && (
          <div className="stack-3">
            {lesson.attachments.map((a: any, i: number) => (
              <div key={i} className="doc-card">
                <div className="doc-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="doc-card__name">
                    {a.label || a.file?.filename || 'Document'}
                  </p>
                  <p className="doc-card__meta">
                    {a.file?.mimeType || 'application/pdf'}
                  </p>
                </div>
                <a
                  href={typeof a.file === 'object' ? a.file?.url : '#'}
                  className="btn btn--secondary btn--sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <LessonClient
        lessonId={lesson.id}
        courseId={course.id}
        userId={user.id}
      />

      {quizzes.docs.length > 0 && (
        <section className="card mt-5">
          <span className="eyebrow">Check your understanding</span>
          <h2 className="t-h3 section__title">
            Knowledge checks
          </h2>
          <div className="stack-3">
            {quizzes.docs.map((q: any) => (
              <div key={q.id} className="summary-row">
                <div>
                  <p className="summary-row__name">{q.title}</p>
                  <p className="summary-row__detail">
                    Pass mark {q.passMark || 70}% · {(q.questions || []).length} questions
                  </p>
                </div>
                <span />
                <Link
                  href={`/courses/${slug}/quiz/${q.id}`}
                  className="btn btn--gold btn--sm"
                >
                  Take quiz
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
