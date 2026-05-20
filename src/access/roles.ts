import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  user?.role === 'admin'

export const isAdminOrInstructor: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'instructor'

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return user.id === id
}

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)
