import Link from 'next/link'
import { requireUser } from '@/lib/auth'

export default async function DashboardPage() {
  const { payload, user } = await requireUser()

  if (user.role === 'officer') {
    const progressList = await payload.find({
      collection: 'progress',
      where: { officer: { equals: user.id } },
      depth: 2,
      limit: 100,
    })
    const courses = await payload.find({
      collection: 'courses',
      where: { status: { equals: 'published' } },
      limit: 50,
    })

    return (
      <div className="shell">
        <header className="page-header">
          <span className="eyebrow">Officer dashboard</span>
          <h1 className="t-h1 mt-3">
            Welcome, {user.name}
          </h1>
          <p className="t-mono mt-2">
            {user.rank ? `${user.rank} · ` : ''}
            {user.unit || 'RSIPF'}
          </p>
        </header>

        <section>
          <h2 className="t-h3 mb-4">Your training</h2>
          {progressList.docs.length === 0 ? (
            <div className="empty">
              <svg className="empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" />
                <line x1="8" y1="7" x2="16" y2="7" />
                <line x1="8" y1="11" x2="16" y2="11" />
              </svg>
              <p className="empty__title">No courses started yet</p>
              <p className="empty__body">
                Browse the catalogue below and open a course to begin your training.
              </p>
            </div>
          ) : (
            <div className="grid-2 stack-3">
              {progressList.docs.map((p: any) => (
                <div key={p.id} className="progress-card">
                  <div className="card__head">
                    <div>
                      <h3 className="card__title">{p.course?.title}</h3>
                      <p className="card__sub">{p.course?.category || '—'}</p>
                    </div>
                    <span className={`badge ${p.percentageComplete === 100 ? 'badge--success' : 'badge--info'}`}>
                      {p.percentageComplete || 0}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar__fill"
                      style={{ width: `${p.percentageComplete || 0}%` }}
                    />
                  </div>
                  {p.course?.slug && (
                    <Link href={`/courses/${p.course.slug}`} className="btn btn--secondary btn--sm">
                      Continue training
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="t-h3 mb-4">
            Available courses
          </h2>
          <div className="grid-3">
            {courses.docs.map((c: any) => (
              <div key={c.id} className="card card--accent">
                <h3 className="card__title">{c.title}</h3>
                <p className="card__sub">
                  {c.category || 'General'}
                  {c.duration ? ` · ${c.duration} min` : ''}
                </p>
                <div className="mt-4">
                  <Link href={`/courses/${c.slug}`} className="btn btn--sm">
                    View course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  if (user.role === 'instructor') {
    const courses = await payload.find({
      collection: 'courses',
      where: { instructor: { equals: user.id } },
      limit: 100,
    })
    const courseIds = courses.docs.map((c) => c.id)
    const progress = courseIds.length
      ? await payload.find({
          collection: 'progress',
          where: { course: { in: courseIds } },
          limit: 500,
        })
      : { docs: [] }

    return (
      <div className="shell">
        <header className="page-header">
          <span className="eyebrow">Instructor dashboard</span>
          <h1 className="t-h1 mt-3">Your courses</h1>
        </header>
        <div className="grid-2 stack-3">
          {courses.docs.map((c: any) => {
            const enrolled = progress.docs.filter(
              (p: any) =>
                (typeof p.course === 'object' ? p.course?.id : p.course) === c.id,
            )
            const completed = enrolled.filter(
              (p: any) => p.percentageComplete === 100,
            ).length
            return (
              <div key={c.id} className="card">
                <div className="card__head">
                  <div>
                    <h3 className="card__title">{c.title}</h3>
                    <p className="card__sub">Status: {c.status}</p>
                  </div>
                  <span className={`badge ${c.status === 'published' ? 'badge--success' : 'badge--neutral'}`}>
                    {c.status}
                  </span>
                </div>
                <div className="app-card__meta app-card__meta--flush">
                  <span>{enrolled.length} enrolled</span>
                  <span>{completed} completed</span>
                </div>
                <div className="mt-4">
                  <Link href="/admin/courses" className="btn btn--secondary btn--sm">
                    Manage
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // admin
  const [usersResult, coursesResult, progressResult, certsResult] = await Promise.all([
    payload.find({ collection: 'users', limit: 0 }),
    payload.find({ collection: 'courses', limit: 0 }),
    payload.find({ collection: 'progress', limit: 0 }),
    payload.find({ collection: 'certificates', limit: 0 }),
  ])

  const stats = [
    { label: 'Officers & staff', value: usersResult.totalDocs },
    { label: 'Courses', value: coursesResult.totalDocs },
    { label: 'In-progress enrolments', value: progressResult.totalDocs },
    { label: 'Certificates issued', value: certsResult.totalDocs },
  ]

  return (
    <div className="shell">
      <header className="page-header">
        <span className="eyebrow">Administrator dashboard</span>
        <h1 className="t-h1 mt-3">
          System overview
        </h1>
      </header>
      <div className="grid-4 stack-3">
        {stats.map((s) => (
          <div key={s.label} className="card card--accent">
            <p className="t-eyebrow">{s.label}</p>
            <p className="t-display stat__value">
              {s.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/admin/reports" className="btn">
          View detailed reports
        </Link>
      </div>
    </div>
  )
}
