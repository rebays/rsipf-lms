import { requireUser } from '@/lib/auth'

export default async function CertificatesPage() {
  const { payload, user } = await requireUser()

  const certs = await payload.find({
    collection: 'certificates',
    where: { officer: { equals: user.id } },
    depth: 1,
    limit: 100,
    user,
  })

  return (
    <div className="shell">
      <header className="page-header">
        <span className="eyebrow">Awarded</span>
        <h1 className="t-h1 mt-3">My certificates</h1>
      </header>

      {certs.docs.length === 0 ? (
        <div className="empty">
          <svg className="empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="6" />
            <polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88" />
          </svg>
          <p className="empty__title">No certificates yet</p>
          <p className="empty__body">
            Once you complete a course, your certificate will appear here ready to download.
          </p>
        </div>
      ) : (
        <div className="grid-2 stack-3">
          {certs.docs.map((c: any) => (
            <article key={c.id} className="card card--accent">
              <div className="card__head">
                <div>
                  <p className="t-eyebrow">{c.certificateNumber}</p>
                  <h2 className="card__title card__heading">
                    {c.course?.title}
                  </h2>
                  <p className="card__sub card__sub--mt">
                    Issued {new Date(c.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="badge badge--gold">Awarded</span>
              </div>
              <div className="mt-4">
                <a
                  href={`/api/certificates/${c.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--gold btn--sm"
                >
                  Download PDF
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
