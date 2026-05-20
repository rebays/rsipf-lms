import type { CollectionConfig } from 'payload'
import { sendQuizFailedEmail } from '../lib/email'

export const Attempts: CollectionConfig = {
  slug: 'attempts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['officer', 'quiz', 'score', 'passed', 'takenAt'],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'instructor') return true // can see attempts for their courses (filtered downstream)
      return { officer: { equals: user.id } }
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create') {
          if (req.user && !data.officer) data.officer = req.user.id
          if (!data.takenAt) data.takenAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        if (doc.passed) return
        try {
          const officer =
            typeof doc.officer === 'object'
              ? doc.officer
              : await req.payload.findByID({ collection: 'users', id: doc.officer })
          const quiz =
            typeof doc.quiz === 'object'
              ? doc.quiz
              : await req.payload.findByID({ collection: 'quizzes', id: doc.quiz })
          if (officer?.email) {
            await sendQuizFailedEmail({
              to: officer.email,
              officerName: officer.name,
              quizTitle: quiz?.title || 'a quiz',
              score: doc.score,
            })
          }
        } catch (err) {
          req.payload.logger.error(`Quiz fail email error: ${String(err)}`)
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
      name: 'quiz',
      type: 'relationship',
      relationTo: 'quizzes',
      required: true,
    },
    {
      name: 'answers',
      type: 'array',
      fields: [
        { name: 'questionIndex', type: 'number', required: true },
        { name: 'selectedOption', type: 'number', required: true },
      ],
    },
    { name: 'score', type: 'number', required: true, min: 0, max: 100 },
    { name: 'passed', type: 'checkbox', required: true, defaultValue: false },
    { name: 'takenAt', type: 'date', required: true },
  ],
}
