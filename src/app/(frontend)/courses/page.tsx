import Link from 'next/link'
import { requireUser } from '@/lib/auth'

export default async function CoursesPage() {
  const { payload, user } = await requireUser()

  const courses = await payload.find({
    collection: 'courses',
    where: { status: { equals: 'published' } },
    limit: 200,
    user,
  })

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">Catalogue</span>
        <h1 className="t-h1 mt-3">Course catalogue</h1>
        <p className="section__lede mt-3">
          Choose a course to begin training. Your progress is saved automatically.
        </p>
      </header>

      {courses.docs.length === 0 ? (
        <div className="empty">
          <p className="empty__title">No courses available</p>
          <p className="empty__body">
            Courses will appear here once your training team has published them.
          </p>
        </div>
      ) : (
        <div className="grid-3 stack-3">
          {courses.docs.map((c: any) => (
            <div key={c.id} className="card card--accent">
              <div className="card__head">
                <div>
                  <h2 className="card__title">{c.title}</h2>
                  <p className="card__sub">{c.category || 'General'}</p>
                </div>
                <span className="badge badge--solid">{c.duration || '—'} min</span>
              </div>
              <div className="mt-4">
                <Link href={`/courses/${c.slug}`} className="btn btn--sm">
                  View course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
