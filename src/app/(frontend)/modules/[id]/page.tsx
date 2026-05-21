import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { findModule } from '@/lib/data'

const FILE_ICONS: Record<string, string> = {
  pdf:        '📄',
  word:       '📝',
  excel:      '📊',
  powerpoint: '📋',
}

const FILE_LABELS: Record<string, string> = {
  pdf:        'PDF',
  word:       'Word Document',
  excel:      'Excel Spreadsheet',
  powerpoint: 'PowerPoint',
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireUser()

  const module = findModule(id)
  if (!module) notFound()

  return (
    <div className="shell">
      <nav className="mb-6">
        <Link href="/modules" className="btn btn--ghost btn--sm">
          ← Back to modules
        </Link>
      </nav>

      <header className="mb-8">
        <span className="eyebrow">Module {module.order}</span>
        <h1 className="t-h1 mt-3">{module.title}</h1>
        {module.description && (
          <p className="section__lede mt-3">{module.description}</p>
        )}
      </header>

      <section>
        <h2 className="t-h3 mb-4">Resources</h2>

        {module.documents.length === 0 ? (
          <div className="empty">
            <p className="empty__title">No resources yet</p>
            <p className="empty__body">
              Documents and resources for this module will appear here once they are uploaded.
            </p>
          </div>
        ) : (
          <div className="stack-3">
            {module.documents.map((doc) => (
              <div key={doc.id} className="card card--row">
                <div className="card__icon">
                  <span style={{ fontSize: '1.75rem' }}>
                    {FILE_ICONS[doc.fileType] ?? '📄'}
                  </span>
                </div>
                <div className="card__body">
                  <h3 className="card__title">{doc.title}</h3>
                  {doc.description && (
                    <p className="card__sub mt-1">{doc.description}</p>
                  )}
                  <span className="badge badge--neutral mt-2">
                    {FILE_LABELS[doc.fileType] ?? 'Document'}
                  </span>
                </div>
                <div className="card__action">
                  <button className="btn btn--sm btn--ghost" disabled>
                    Coming soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
