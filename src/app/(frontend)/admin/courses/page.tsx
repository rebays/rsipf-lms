import type { Where } from 'payload'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'

export default async function AdminCoursesPage() {
  const { payload, user } = await requireUser()
  if (user.role !== 'admin' && user.role !== 'instructor') redirect('/dashboard')

  const where: Where =
    user.role === 'admin' ? {} : { instructor: { equals: user.id } }
  const courses = await payload.find({ collection: 'courses', where, limit: 200, user })

  return (
    <div className="shell">
      <header className="stage-nav stage-nav--header">
        <div className="stage-nav__left">
          <span className="eyebrow">Management</span>
          <h1 className="t-h1 m-0">Manage courses</h1>
        </div>
        <div className="stage-nav__right">
          <a href="/admin/collections/courses/create" className="btn">
            New course
          </a>
        </div>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Category</th>
              <th>Duration</th>
              <th className="w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.docs.map((c: any) => (
              <tr key={c.id}>
                <td className="font-semibold text-navy-800">{c.title}</td>
                <td>
                  <span
                    className={`badge ${
                      c.status === 'published' ? 'badge--success' : 'badge--neutral'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td>{c.category || '—'}</td>
                <td className="mono num">{c.duration || '—'}</td>
                <td>
                  <div className="btn-row">
                    <Link href={`/courses/${c.slug}`} className="btn btn--ghost btn--sm">
                      View
                    </Link>
                    <a
                      href={`/admin/collections/courses/${c.id}`}
                      className="btn btn--secondary btn--sm"
                    >
                      Edit
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
