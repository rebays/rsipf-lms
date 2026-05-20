import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { ReportsCharts } from './ReportsCharts'

export default async function AdminReportsPage() {
  const { payload, user } = await requireUser()
  if (user.role !== 'admin') redirect('/dashboard')

  const [users, progress, attempts, courses] = await Promise.all([
    payload.find({ collection: 'users', limit: 500, user }),
    payload.find({ collection: 'progress', depth: 1, limit: 1000, user }),
    payload.find({ collection: 'attempts', depth: 1, limit: 1000, user }),
    payload.find({ collection: 'courses', limit: 200, user }),
  ])

  const unitMap = new Map<string, { unit: string; total: number; completed: number }>()
  for (const p of progress.docs as any[]) {
    const officer = typeof p.officer === 'object' ? p.officer : null
    const unit = officer?.unit || 'Unassigned'
    const entry = unitMap.get(unit) || { unit, total: 0, completed: 0 }
    entry.total += 1
    if (p.percentageComplete === 100) entry.completed += 1
    unitMap.set(unit, entry)
  }
  const byUnit = Array.from(unitMap.values()).map((e) => ({
    unit: e.unit,
    completionRate: e.total ? Math.round((e.completed / e.total) * 100) : 0,
  }))

  const courseMap = new Map<string, { course: string; passed: number; total: number }>()
  for (const a of attempts.docs as any[]) {
    const quiz = typeof a.quiz === 'object' ? a.quiz : null
    const key = quiz?.title || 'Unknown quiz'
    const entry = courseMap.get(key) || { course: key, passed: 0, total: 0 }
    entry.total += 1
    if (a.passed) entry.passed += 1
    courseMap.set(key, entry)
  }
  const byCourse = Array.from(courseMap.values()).map((e) => ({
    course: e.course,
    passRate: e.total ? Math.round((e.passed / e.total) * 100) : 0,
  }))

  const activeUsers = (users.docs as any[]).filter((u) => u.isActive).length

  const stats = [
    { label: 'Active users', value: activeUsers },
    { label: 'Courses', value: courses.totalDocs },
    { label: 'Quiz attempts', value: attempts.totalDocs },
  ]

  return (
    <div className="shell">
      <header style={{ marginBottom: 'var(--sp-8)' }}>
        <span className="eyebrow">Insights</span>
        <h1 className="t-h1" style={{ marginTop: 'var(--sp-3)' }}>Reports</h1>
      </header>

      <section className="grid-3 stack-3" style={{ marginBottom: 'var(--sp-8)' }}>
        {stats.map((s) => (
          <div key={s.label} className="card card--accent">
            <p className="t-eyebrow">{s.label}</p>
            <p className="t-display" style={{ fontSize: 36, margin: 'var(--sp-2) 0 0' }}>
              {s.value}
            </p>
          </div>
        ))}
      </section>

      <ReportsCharts byUnit={byUnit} byCourse={byCourse} />
    </div>
  )
}
