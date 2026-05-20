import type { CollectionConfig } from 'payload'
import { generateCertificateNumber } from '../lib/certificate'
import { sendCertificateIssuedEmail } from '../lib/email'

export const Progress: CollectionConfig = {
  slug: 'progress',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['officer', 'course', 'percentageComplete', 'completedAt'],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'instructor') return true
      return { officer: { equals: user.id } }
    },
    update: ({ req: { user }, data }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Officer may update their own record
      return { officer: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user && !data.officer) {
          data.officer = req.user.id
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const justCompleted =
          doc.percentageComplete === 100 &&
          previousDoc?.percentageComplete !== 100 &&
          !doc.certificateIssued

        if (!justCompleted) return

        try {
          const certificateNumber = generateCertificateNumber()
          const certificate = await req.payload.create({
            collection: 'certificates',
            data: {
              officer: typeof doc.officer === 'object' ? doc.officer.id : doc.officer,
              course: typeof doc.course === 'object' ? doc.course.id : doc.course,
              issuedAt: new Date().toISOString(),
              certificateNumber,
            },
          })

          await req.payload.update({
            collection: 'progress',
            id: doc.id,
            data: {
              certificateIssued: true,
              completedAt: new Date().toISOString(),
            },
          })

          const officer =
            typeof doc.officer === 'object'
              ? doc.officer
              : await req.payload.findByID({ collection: 'users', id: doc.officer })
          const course =
            typeof doc.course === 'object'
              ? doc.course
              : await req.payload.findByID({ collection: 'courses', id: doc.course })

          if (officer?.email) {
            await sendCertificateIssuedEmail({
              to: officer.email,
              officerName: officer.name,
              courseTitle: course?.title || 'your course',
              certificateNumber,
            })
          }
        } catch (err) {
          req.payload.logger.error(`Certificate issue error: ${String(err)}`)
        }
      },
    ],
  },
  fields: [
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
    {
      name: 'completedLessons',
      type: 'array',
      fields: [
        {
          name: 'lesson',
          type: 'relationship',
          relationTo: 'lessons',
          required: true,
        },
      ],
    },
    {
      name: 'percentageComplete',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 100,
    },
    { name: 'completedAt', type: 'date' },
    { name: 'certificateIssued', type: 'checkbox', defaultValue: false },
  ],
}
