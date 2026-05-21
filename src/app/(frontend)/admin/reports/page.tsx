import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'

export default async function AdminReportsPage() {
  const { payload, user } = await requireUser()
  if (user.role !== 'admin') redirect('/dashboard')

  const [usersResult, modulesResult] = await Promise.all([
    payload.find({ collection: 'users', limit: 500, user }),
    payload.find({ collection: 'modules', limit: 0, user }),
  ])

  const activeUsers = (usersResult.docs as any[]).filter((u) => u.isActive).length
  const officers = (usersResult.docs as any[]).filter((u) => u.role === 'officer').length

  const stats = [
    { label: 'Active users', value: activeUsers },
    { label: 'Officers', value: officers },
    { label: 'Modules', value: modulesResult.totalDocs },
  ]

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">Insights</span>
        <h1 className="t-h1 mt-3">Reports</h1>
      </header>

      <section className="grid-3 stack-3">
        {stats.map((s) => (
          <div key={s.label} className="card card--accent">
            <p className="t-eyebrow">{s.label}</p>
            <p className="t-display text-4xl mt-2">{s.value}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
