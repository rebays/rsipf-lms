import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from './LoginForm'

export default async function LoginPage() {
  const { user } = await getCurrentUser()
  if (user) redirect('/dashboard')

  return (
    <div className="auth-stage">
      <div className="auth-card">
        <div className="auth-card__head" style={{ textAlign: 'center' }}>
          <Image
            src="/rsipf-logo.png"
            alt="RSIPF crest"
            width={84}
            height={100}
            priority
            style={{ margin: '0 auto var(--sp-4)', width: 'auto', height: 100 }}
          />
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Sign in</span>
          <h1 className="auth-card__title">RSIPF Learning Portal</h1>
          <p className="auth-card__sub">
            Use your training portal credentials. Contact your training officer if
            you can&apos;t sign in.
          </p>
        </div>
        <LoginForm />
        <div className="auth-card__foot">
          <span>Need help?</span>
          <span className="t-mono">training@rsipf.gov.sb</span>
        </div>
      </div>
    </div>
  )
}
