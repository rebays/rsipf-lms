import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { MODULES } from '@/lib/data'

export default async function DashboardPage() {
  const user = await requireUser()

  return (
    <div className="shell">
      <header className="mb-8">
        <span className="eyebrow">Cadet dashboard</span>
        <h1 className="t-h1 mt-3">Welcome, {user.name}</h1>
        <p className="t-mono mt-2">
          {user.rank} · {user.unit}
        </p>
      </header>

      <section className="mb-8">
        <div className="card card--accent" style={{ maxWidth: '280px' }}>
          <p className="t-eyebrow">Progress</p>
          <p className="t-display text-4xl mt-2">0 / {MODULES.length}</p>
          <p className="t-mono mt-1">modules completed</p>
        </div>
      </section>

      <Link href="/modules" className="btn">
        View all modules →
      </Link>
    </div>
  )
}
