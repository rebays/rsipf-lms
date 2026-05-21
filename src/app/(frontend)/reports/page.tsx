import { cookies } from 'next/headers'
import { requireUser } from '@/lib/auth'
import { MODULES } from '@/lib/data'

const STATUS_LABEL: Record<string, string> = {
  'ready-for-assessment': 'Ready for assessment',
}

const STATUS_BADGE: Record<string, string> = {
  'ready-for-assessment': 'badge--success',
}

export default async function ReportsPage() {
  await requireUser()
  const store = await cookies()

  const getStatus = (id: string) =>
    store.get(`module-${id}-status`)?.value ?? 'not-started'

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">My progress</span>
        <h1 className="t-h1 mt-3">Reports</h1>
        <p className="section__lede mt-3">
          Your score and status for each training module.
        </p>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Module</th>
              <th className="text-center">Score</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m) => {
              const status = getStatus(m.id)
              return (
                <tr key={m.id}>
                  <td className="mono num text-gray-400">{String(m.order).padStart(2, '0')}</td>
                  <td className="font-semibold text-navy-800">{m.title}</td>
                  <td className="text-center mono num text-gray-400">—</td>
                  <td className="text-center">
                    <span className={`badge ${STATUS_BADGE[status] ?? 'badge--neutral'}`}>
                      {STATUS_LABEL[status] ?? 'Not started'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
