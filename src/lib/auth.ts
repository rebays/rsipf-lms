import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getCurrentUser = async () => {
  try {
    const payload = await getPayload({ config })
    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })
    return { payload, user: user || null, dbUnavailable: false }
  } catch (err) {
    if ((err as any)?.payloadInitError || isDbError(err)) {
      return { payload: null, user: null, dbUnavailable: true }
    }
    throw err
  }
}

function isDbError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return /cannot connect to Postgres|ECONNREFUSED|ETIMEDOUT|ENOTFOUND/i.test(msg)
}

export const requireUser = async () => {
  const { redirect } = await import('next/navigation')
  const result = await getCurrentUser()
  if (result.dbUnavailable) redirect('/service-unavailable')
  if (!result.user) redirect('/login')
  return result as { payload: Awaited<ReturnType<typeof getPayload>>; user: NonNullable<typeof result.user> }
}
