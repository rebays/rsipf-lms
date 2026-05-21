import Image from 'next/image'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { logout } from '@/app/actions/logout'

export const NavBar = async () => {
  const user = await getCurrentUser().then((r) => r.user).catch(() => null)

  return (
    <header className="brandbar">
      <Link href={user ? '/dashboard' : '/login'} className="brandbar__id">
        <Image
          src="/rsipf-logo.png"
          alt="RSIPF crest"
          width={44}
          height={52}
          priority
          className="brandbar__shield"
        />
        <span>
          <span className="brandbar__name">
            Academy
          </span>
          <span className="brandbar__sub">Royal Solomon Islands Police Force</span>
        </span>
      </Link>

      {user && (
        <div className="brandbar__nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/certificates">Certificates</Link>
          {(user.role === 'admin' || user.role === 'instructor') && (
            <Link href="/admin/courses">Manage</Link>
          )}
          {user.role === 'admin' && (
            <>
              <Link href="/admin/users">Users</Link>
              <Link href="/admin/reports">Reports</Link>
            </>
          )}
          <span className="brandbar__user hidden sm:inline">
            {user.name} · {user.role}
          </span>
          <form action={logout}>
            <button type="submit" className="btn btn--sm btn--gold">
              Sign out
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
