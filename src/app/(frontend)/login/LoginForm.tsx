'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Sign in failed')
      }
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
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
      <button type="submit" disabled={loading} className="btn btn--lg" style={{ width: '100%' }}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
