import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { MODULES } from '@/lib/data'

export default async function ModulesPage() {
  await requireUser()

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">Catalogue</span>
        <h1 className="t-h1 mt-3">Training modules</h1>
        <p className="section__lede mt-3">
          {MODULES.length} modules in the RSIPF training programme.
        </p>
      </header>

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
    </div>
  )
}
