import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DEMO_USER, type DemoUser } from '@/lib/data'

export const getCurrentUser = async (): Promise<DemoUser | null> => {
  const store = await cookies()
  return store.get('rsipf-session') ? DEMO_USER : null
}

export const requireUser = async (): Promise<DemoUser> => {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}
