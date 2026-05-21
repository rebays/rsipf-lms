import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { findModule } from '@/lib/data'
import { PDFViewer } from '@/components/PDFViewer'

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
              <PDFViewer key={doc.id} title={doc.title} url={doc.url} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
