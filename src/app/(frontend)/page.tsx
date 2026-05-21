import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function Home() {
  const result = await getCurrentUser()
  if (result.dbUnavailable) redirect('/service-unavailable')
  redirect(result.user ? '/dashboard' : '/login')
}
