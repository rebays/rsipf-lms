import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getCurrentUser = async () => {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()
  const { user } = await payload.auth({ headers })
  return { payload, user: user || null }
}

export const requireUser = async () => {
  const result = await getCurrentUser()
  if (!result.user) {
    const { redirect } = await import('next/navigation')
    redirect('/login')
  }
  return result as { payload: Awaited<ReturnType<typeof getPayload>>; user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>['user']> }
}
