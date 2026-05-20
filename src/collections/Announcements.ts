import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'audience', 'publishedAt', 'author'],
  },
  access: {
    create: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'instructor',
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        or: [
          { audience: { equals: 'all' } },
          { audience: { equals: user.role === 'instructor' ? 'instructors' : 'officers' } },
        ],
      }
    },
    update: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'instructor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user && !data.author) {
          data.author = req.user.id
        }
        if (operation === 'create' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({}),
      required: true,
    },
    {
      name: 'audience',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'Everyone', value: 'all' },
        { label: 'Officers only', value: 'officers' },
        { label: 'Instructors only', value: 'instructors' },
      ],
    },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}
