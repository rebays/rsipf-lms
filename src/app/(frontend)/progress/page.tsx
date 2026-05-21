import { cookies } from 'next/headers'
import { requireUser } from '@/lib/auth'
import { MODULES, MODULE_GRADES } from '@/lib/data'

function getStatusLabel(id: string, cookieStatus: string): { label: string; badge: string } {
  if (MODULE_GRADES[id]) return { label: 'Assessment complete', badge: 'badge--info' }
  if (cookieStatus === 'ready-for-assessment') return { label: 'Ready for assessment', badge: 'badge--success' }
  return { label: 'Not started', badge: 'badge--neutral' }
}

export default async function ProgressPage() {
  await requireUser()
  const store = await cookies()

  const getCookieStatus = (id: string) =>
    store.get(`module-${id}-status`)?.value ?? 'not-started'

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">My progress</span>
        <h1 className="t-h1 mt-3">Progress</h1>
        <p className="section__lede mt-3">
          Your status for each training module.
        </p>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Module</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m) => {
              const { label, badge } = getStatusLabel(m.id, getCookieStatus(m.id))
              return (
                <tr key={m.id}>
                  <td className="mono num text-gray-400">{String(m.order).padStart(2, '0')}</td>
                  <td className="font-semibold text-navy-800">{m.title}</td>
                  <td className="text-center">
                    <span className={`badge ${badge}`}>{label}</span>
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
