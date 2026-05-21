'use server'

import { cookies } from 'next/headers'

export async function setModuleStatus(moduleId: string, status: string) {
  const store = await cookies()
  store.set(`module-${moduleId}-status`, status, { httpOnly: true, path: '/' })
}
