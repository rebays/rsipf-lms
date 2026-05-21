import Link from 'next/link'
import { requireUser } from '@/lib/auth'

export default async function ModulesPage() {
  const { payload } = await requireUser()

  const modules = await payload.find({
    collection: 'modules',
    where: { status: { equals: 'published' } },
    sort: 'order',
    limit: 100,
  })

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">Catalogue</span>
        <h1 className="t-h1 mt-3">Training modules</h1>
        <p className="section__lede mt-3">
          {modules.totalDocs} modules in the RSIPF training programme.
        </p>
      </header>

      {modules.docs.length === 0 ? (
        <div className="empty">
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
    </div>
  )
}
