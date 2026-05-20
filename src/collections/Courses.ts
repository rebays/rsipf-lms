import type { CollectionConfig, Where } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sendCourseAssignedEmail } from '../lib/email'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'instructor', 'category'],
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'instructor') {
        const where: Where = {
          or: [
            { instructor: { equals: user.id } },
            { status: { equals: 'published' } },
          ],
        }
        return where
      }
      // officer: only published courses assigned to their role
      const where: Where = {
        and: [
          { status: { equals: 'published' } },
          {
            or: [
              { assignedRoles: { contains: 'officer' } },
              { assignedRoles: { equals: null } },
            ],
          },
        ],
      }
      return where
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'instructor') {
        const where: Where = { instructor: { equals: user.id } }
        return where
      }
      return false
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Notify officers when a course transitions to published
        if (
          operation === 'update' &&
          doc.status === 'published' &&
          previousDoc?.status !== 'published'
        ) {
          try {
            const officers = await req.payload.find({
              collection: 'users',
              where: { role: { equals: 'officer' }, isActive: { equals: true } },
              limit: 200,
            })
            for (const officer of officers.docs) {
              await sendCourseAssignedEmail({
                to: officer.email,
                officerName: officer.name,
                courseTitle: doc.title,
                courseSlug: doc.slug,
              })
            }
          } catch (err) {
            req.payload.logger.error(`Course assignment email failed: ${String(err)}`)
          }
        }
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly identifier, e.g. firearms-safety-2026' },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'assignedRoles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Officer', value: 'officer' },
        { label: 'Instructor', value: 'instructor' },
        { label: 'Administrator', value: 'admin' },
      ],
    },
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: () => ({
        role: { in: ['instructor', 'admin'] },
      }),
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Operations', value: 'operations' },
        { label: 'Investigations', value: 'investigations' },
        { label: 'Community Policing', value: 'community-policing' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Compliance & Ethics', value: 'compliance' },
        { label: 'Technical Skills', value: 'technical' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'duration',
      type: 'number',
      admin: { description: 'Estimated total duration in minutes' },
    },
  ],
}
