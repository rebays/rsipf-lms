import { requireUser } from '@/lib/auth'
import { MODULES, MODULE_GRADES } from '@/lib/data'

export default async function ReportsPage() {
  await requireUser()

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">Assessment results</span>
        <h1 className="t-h1 mt-3">Reports</h1>
        <p className="section__lede mt-3">
          Scores, grades, and instructor feedback for each module.
        </p>
      </header>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>Module</th>
              <th className="text-center">Score</th>
              <th className="text-center">Grade</th>
              <th>Instructor</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m) => {
              const grade = MODULE_GRADES[m.id]
              return (
                <tr key={m.id}>
                  <td className="mono num text-gray-400">{String(m.order).padStart(2, '0')}</td>
                  <td className="font-semibold text-navy-800">{m.title}</td>
                  <td className="text-center mono num">{grade?.score ?? '—'}</td>
                  <td className="text-center">
                    {grade ? (
                      <span className="badge badge--success">{grade.grade}</span>
                    ) : (
                      <span className="badge badge--neutral">Pending</span>
                    )}
                  </td>
                  <td>{grade?.instructor ?? '—'}</td>
                  <td style={{ maxWidth: '280px', fontSize: '0.875rem', color: '#4b5563' }}>
                    {grade?.comments ?? '—'}
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
