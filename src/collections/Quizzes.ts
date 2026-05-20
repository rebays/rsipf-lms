import type { CollectionConfig } from 'payload'

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'lesson', 'passMark'],
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
    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
      required: true,
    },
    {
      name: 'passMark',
      type: 'number',
      required: true,
      defaultValue: 70,
      min: 0,
      max: 100,
      admin: { description: 'Minimum percentage required to pass' },
    },
    {
      name: 'maxAttempts',
      type: 'number',
      defaultValue: 3,
      min: 1,
    },
    {
      name: 'questions',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'questionText', type: 'textarea', required: true },
        {
          name: 'options',
          type: 'array',
          required: true,
          minRows: 2,
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        {
          name: 'correctAnswer',
          type: 'number',
          required: true,
          min: 0,
          admin: { description: 'Zero-indexed position of the correct option' },
        },
        { name: 'points', type: 'number', defaultValue: 1, min: 1 },
      ],
    },
  ],
}
