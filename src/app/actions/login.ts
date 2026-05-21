'use server'

import { cookies } from 'next/headers'

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (email === 'james.carlos@gmail.com' && password === 'jcarlos') {
    const store = await cookies()
    store.set('rsipf-session', '1', { httpOnly: true, path: '/', sameSite: 'lax' })
    return { ok: true }
  }
  return { ok: false, error: 'Invalid email or password' }
}
