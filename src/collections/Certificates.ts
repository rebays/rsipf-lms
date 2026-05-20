import type { CollectionConfig } from 'payload'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: {
    useAsTitle: 'certificateNumber',
    defaultColumns: ['certificateNumber', 'officer', 'course', 'issuedAt'],
  },
  access: {
    create: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'instructor',
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'instructor') return true
      return { officer: { equals: user.id } }
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'certificateNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Format: RSIPF-YYYY-XXXXXX' },
    },
    {
      name: 'officer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },
    { name: 'issuedAt', type: 'date', required: true },
    {
      name: 'pdfUrl',
      type: 'text',
      admin: { description: 'Generated on download via /api/certificates/[id]/pdf' },
    },
  ],
}
