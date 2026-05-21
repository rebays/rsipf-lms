import type { CollectionConfig } from 'payload'

export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['order', 'title', 'status'],
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
    { name: 'description', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
    },
    {
      name: 'documents',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'fileType',
          type: 'select',
          defaultValue: 'pdf',
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'Word Document', value: 'word' },
            { label: 'Excel Spreadsheet', value: 'excel' },
            { label: 'PowerPoint', value: 'powerpoint' },
          ],
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
