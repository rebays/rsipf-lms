import Image from 'next/image'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { logout } from '@/app/actions/logout'

export const NavBar = async () => {
  const user = await getCurrentUser()

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
          <span className="brandbar__name">Academy</span>
          <span className="brandbar__sub">Royal Solomon Islands Police Force</span>
        </span>
      </Link>

      {user && (
        <div className="brandbar__nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/modules">Modules</Link>
          <Link href="/reports">Reports</Link>
          <span className="brandbar__user hidden sm:inline">
            {user.name} · {user.rank}
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
