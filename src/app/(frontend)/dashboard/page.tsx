import Link from 'next/link'
import { requireUser } from '@/lib/auth'


export default async function DashboardPage() {
  const { payload, user } = await requireUser()

  if (user.role === 'officer') {
    const modules = await payload.find({
      collection: 'modules',
      where: { status: { equals: 'published' } },
      sort: 'order',
      limit: 100,
    })

    return (
      <div className="shell">
        <header className="mb-8">
          <span className="eyebrow">Officer dashboard</span>
          <h1 className="t-h1 mt-3">Welcome, {user.name}</h1>
          <p className="t-mono mt-2">
            {user.rank ? `${user.rank} · ` : ''}
            {user.unit || 'RSIPF'}
          </p>
        </header>

        <section>
          <h2 className="t-h3 mb-4">Training modules</h2>
          {modules.docs.length === 0 ? (
            <div className="empty">
              <svg className="empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" />
                <line x1="8" y1="7" x2="16" y2="7" />
                <line x1="8" y1="11" x2="16" y2="11" />
              </svg>
              <p className="empty__title">No modules available</p>
              <p className="empty__body">
                Modules will appear here once your training team has published them.
              </p>
            </div>
          ) : (
            <div className="module-list">
              {modules.docs.map((m: any) => {
                const docCount = m.documents?.length ?? 0
                return (
                  <Link key={m.id} href={`/modules/${m.id}`} className="module-item">
                    <span className="module-item__badge">{String(m.order).padStart(2, '0')}</span>
                    <span className="module-item__body">
                      <span className="module-item__title">{m.title}</span>
                      {docCount > 0 && (
                        <span className="module-item__meta">
                          {docCount} {docCount === 1 ? 'document' : 'documents'}
                        </span>
                      )}
                    </span>
                    <span className="module-item__arrow">→</span>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    )
  }

  if (user.role === 'instructor') {
    const modules = await payload.find({
      collection: 'modules',
      sort: 'order',
      limit: 100,
    })

    return (
      <div className="shell">
        <header className="mb-8">
          <span className="eyebrow">Instructor dashboard</span>
          <h1 className="t-h1 mt-3">Training modules</h1>
        </header>
        <div className="grid-3 stack-3">
          {modules.docs.map((m: any) => (
            <div key={m.id} className="card">
              <div className="card__head">
                <span className="eyebrow">Module {m.order}</span>
                <span className={`badge ${m.status === 'published' ? 'badge--success' : 'badge--neutral'}`}>
                  {m.status}
                </span>
              </div>
              <h3 className="card__title mt-2">{m.title}</h3>
              <div className="mt-4">
                <a href={`/admin/collections/modules/${m.id}`} className="btn btn--secondary btn--sm">
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // admin
  const [usersResult, modulesResult] = await Promise.all([
    payload.find({ collection: 'users', limit: 0 }),
    payload.find({ collection: 'modules', limit: 0 }),
  ])

  const stats = [
    { label: 'Officers & staff', value: usersResult.totalDocs },
    { label: 'Modules', value: modulesResult.totalDocs },
  ]

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">Administrator dashboard</span>
        <h1 className="t-h1 mt-3">System overview</h1>
      </header>
      <div className="grid-4 stack-3">
        {stats.map((s) => (
          <div key={s.label} className="card card--accent">
            <p className="t-eyebrow">{s.label}</p>
            <p className="t-display text-4xl mt-2">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <Link href="/admin/modules" className="btn">
          Manage modules
        </Link>
        <Link href="/admin/users" className="btn btn--secondary">
          Manage users
        </Link>
      </div>
    </div>
  )
}
