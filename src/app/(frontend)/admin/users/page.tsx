import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'

export default async function AdminUsersPage() {
  const { payload, user } = await requireUser()
  if (user.role !== 'admin') redirect('/dashboard')

  const users = await payload.find({ collection: 'users', limit: 500, user })

  return (
    <div className="shell">
      <header className="stage-nav stage-nav--header">
        <div className="stage-nav__left">
          <span className="eyebrow">Management</span>
          <h1 className="t-h1 m-0">Manage users</h1>
        </div>
        <div className="stage-nav__right">
          <a href="/admin/collections/users/create" className="btn">New user</a>
        </div>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Rank</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.docs.map((u: any) => (
              <tr key={u.id}>
                <td>
                  <a
                    href={`/admin/collections/users/${u.id}`}
                    className="font-semibold text-navy-800"
                  >
                    {u.name}
                  </a>
                </td>
                <td className="mono">{u.email}</td>
                <td>
                  <span
                    className={`badge ${
                      u.role === 'admin'
                        ? 'badge--gold'
                        : u.role === 'instructor'
                          ? 'badge--info'
                          : 'badge--neutral'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td>{u.rank || '—'}</td>
                <td>{u.unit || '—'}</td>
                <td>
                  <span
                    className={`badge ${u.isActive ? 'badge--success' : 'badge--danger'}`}
                  >
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
