import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { payload, user } = await requireUser()

  const courseResult = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    limit: 1,
    user,
  })
  const course = courseResult.docs[0]
  if (!course) notFound()

  const modules = await payload.find({
    collection: 'modules',
    where: { course: { equals: course.id } },
    sort: 'order',
    limit: 100,
    user,
  })

  const moduleIds = modules.docs.map((m) => m.id)
  const lessons = moduleIds.length
    ? await payload.find({
        collection: 'lessons',
        where: { module: { in: moduleIds } },
        sort: 'order',
        limit: 500,
        user,
      })
    : { docs: [] }

  const progressResult = await payload.find({
    collection: 'progress',
    where: {
      and: [{ officer: { equals: user.id } }, { course: { equals: course.id } }],
    },
    limit: 1,
    user,
  })
  const progress = progressResult.docs[0]
  const completedIds = new Set<string>(
    (progress?.completedLessons || []).map((cl: any) =>
      typeof cl.lesson === 'object' ? cl.lesson.id : cl.lesson,
    ),
  )
  const pct = progress?.percentageComplete || 0

  return (
    <div className="shell">
      <nav className="crumbs mb-4">
        <Link href="/courses">Courses</Link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="current">{course.title}</span>
      </nav>

      <header className="card card--accent mb-6">
        <span className="eyebrow">{course.category || 'Training'}</span>
        <h1 className="t-h2 mt-2">{course.title}</h1>
        <p className="card__sub mt-2">
          {course.duration || '—'} minutes · {modules.docs.length} module
          {modules.docs.length === 1 ? '' : 's'} · {lessons.docs.length} lesson
          {lessons.docs.length === 1 ? '' : 's'}
        </p>
        {progress && (
          <div className="mt-5">
            <div className="progress-bar">
              <div
                className="progress-bar__fill"
                style={{ '--fill-width': `${pct}%` } as React.CSSProperties}
              />
            </div>
            <p className="t-mono">{pct}% complete</p>
          </div>
        )}
      </header>

      <div className="stack-5">
        {modules.docs.map((m: any) => {
          const moduleLessons = lessons.docs.filter(
            (l: any) =>
              (typeof l.module === 'object' ? l.module?.id : l.module) === m.id,
          )
          return (
            <section key={m.id} className="eligibility">
              <div className="eligibility__head">
                <div>
                  <h4>
                    Module {m.order}: {m.title}
                  </h4>
                  {m.description && (
                    <p className="module-desc">{m.description}</p>
                  )}
                </div>
                <span className="eligibility__progress">
                  {moduleLessons.filter((l: any) => completedIds.has(l.id)).length}/
                  {moduleLessons.length}
                </span>
              </div>
              <div className="eligibility__list">
                {moduleLessons.map((l: any) => {
                  const done = completedIds.has(l.id)
                  return (
                    <div
                      key={l.id}
                      className={`eligibility__row ${done ? 'met' : ''}`}
                    >
                      <span className="eligibility__check">
                        {done ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                          </svg>
                        )}
                      </span>
                      <div>
                        <p className="eligibility__name">
                          {l.order}. {l.title}
                        </p>
                        <p className="eligibility__detail">
                          {l.type} · {l.duration || '—'} min
                        </p>
                      </div>
                      <Link
                        href={`/courses/${course.slug}/lessons/${l.id}`}
                        className="btn btn--secondary btn--sm"
                      >
                        {done ? 'Review' : 'Open'}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
