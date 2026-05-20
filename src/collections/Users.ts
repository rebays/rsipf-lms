import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrSelf } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'rank', 'unit'],
  },
  access: {
    create: isAdmin,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'officer',
      access: {
        update: isAdminFieldLevel,
      },
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Instructor', value: 'instructor' },
        { label: 'Officer', value: 'officer' },
      ],
    },
    {
      name: 'rank',
      type: 'text',
      admin: { description: 'e.g. Constable, Sergeant, Inspector' },
    },
    {
      name: 'unit',
      type: 'text',
      admin: { description: 'Unit or division (e.g. Honiara HQ, Western Province)' },
    },
    {
      name: 'badgeNumber',
      type: 'text',
      unique: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      access: {
        update: isAdminFieldLevel,
      },
    },
  ],
}
