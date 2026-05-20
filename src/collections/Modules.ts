import type { CollectionConfig } from 'payload'

export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'course'],
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    read: ({ req: { user } }) => Boolean(user),
    update: async ({ req: { user, payload }, id }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'instructor' && id) {
        const mod = await payload.findByID({ collection: 'modules', id, depth: 1 })
        const courseInstructorId =
          typeof mod?.course === 'object' ? mod.course?.instructor : null
        const instructorId =
          typeof courseInstructorId === 'object' ? courseInstructorId?.id : courseInstructorId
        return instructorId === user.id
      }
      return false
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 1 },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },
    { name: 'description', type: 'textarea' },
  ],
}
