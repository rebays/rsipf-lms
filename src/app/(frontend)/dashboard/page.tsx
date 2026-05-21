import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { MODULES } from '@/lib/data'

export default async function DashboardPage() {
  const user = await requireUser()

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">Officer dashboard</span>
        <h1 className="t-h1 mt-3">Welcome, {user.name}</h1>
        <p className="t-mono mt-2">
          {user.rank} · {user.unit}
        </p>
      </header>

      <section>
        <h2 className="t-h3 mb-4">Training modules</h2>
        <div className="module-list">
          {MODULES.map((m) => (
            <Link key={m.id} href={`/modules/${m.id}`} className="module-item">
              <span className="module-item__badge">{String(m.order).padStart(2, '0')}</span>
              <span className="module-item__body">
                <span className="module-item__title">{m.title}</span>
                {m.documents.length > 0 && (
                  <span className="module-item__meta">
                    {m.documents.length} {m.documents.length === 1 ? 'document' : 'documents'}
                  </span>
                )}
              </span>
              <span className="module-item__arrow">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
