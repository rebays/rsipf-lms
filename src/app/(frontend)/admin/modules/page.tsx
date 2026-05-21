import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'

export default async function AdminModulesPage() {
  const { payload, user } = await requireUser()
  if (user.role !== 'admin' && user.role !== 'instructor') redirect('/dashboard')

  const modules = await payload.find({
    collection: 'modules',
    sort: 'order',
    limit: 200,
  })

  return (
    <div className="shell">
      <header className="stage-nav stage-nav--header">
        <div className="stage-nav__left">
          <span className="eyebrow">Management</span>
          <h1 className="t-h1 m-0">Manage modules</h1>
        </div>
        <div className="stage-nav__right">
          <a href="/admin/collections/modules/create" className="btn">
            New module
          </a>
        </div>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="w-16">#</th>
              <th>Title</th>
              <th>Status</th>
              <th className="w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.docs.map((m: any) => (
              <tr key={m.id}>
                <td className="mono num">{m.order}</td>
                <td className="font-semibold text-navy-800">{m.title}</td>
                <td>
                  <span className={`badge ${m.status === 'published' ? 'badge--success' : 'badge--neutral'}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <a
                    href={`/admin/collections/modules/${m.id}`}
                    className="btn btn--secondary btn--sm"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
