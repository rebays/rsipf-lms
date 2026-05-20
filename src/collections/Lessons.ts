import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'module', 'type'],
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'instructor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 1 },
    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Document', value: 'document' },
        { label: 'Text', value: 'text' },
      ],
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (data) => data?.type === 'video',
        description: 'YouTube, Vimeo, or direct .mp4 URL',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: { condition: (data) => data?.type === 'text' },
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'duration',
      type: 'number',
      admin: { description: 'Duration in minutes' },
    },
  ],
}
