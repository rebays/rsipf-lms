import Image from 'next/image'
import Link from 'next/link'

export default function ServiceUnavailablePage() {
  return (
    <div className="auth-stage">
      <div className="auth-card">
        <div className="auth-card__head auth-card__head--center">
          <Image
            src="/rsipf-logo.png"
            alt="RSIPF crest"
            width={84}
            height={100}
            priority
            className="auth-logo"
          />
          <h1 className="auth-card__title">Service Unavailable</h1>
          <p className="auth-card__sub">
            The system cannot connect to the database. Please try again in a moment.
          </p>
        </div>
        <Link href="/" className="btn btn--gold btn--lg btn--full">
          Try again
        </Link>
      </div>
    </div>
  )
}
