'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/login'

export const LoginForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await login(email, password)
    if (result.ok) {
      router.push('/dashboard')
    } else {
      setError(result.error ?? 'Sign in failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="stack-4">
      <div className="field">
        <label className="field__label" htmlFor="email">
          Email<span className="req">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          autoComplete="email"
        />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="password">
          Password<span className="req">*</span>
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          autoComplete="current-password"
        />
      </div>
      {error && (
        <div className="alert alert--danger">
          <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="alert__title">Sign in failed</p>
            <p className="alert__body">{error}</p>
          </div>
          <span />
        </div>
      )}
      <button type="submit" disabled={loading} className="btn btn--lg flex w-full">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
