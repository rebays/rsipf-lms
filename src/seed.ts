/**
 * Seed script for the RSIPF Academy.
 *
 * Run with: npm run seed
 *
 * Creates: 1 admin, 1 instructor, 2 officer users, 2 sample courses
 * with 2 modules and 3 lessons each, and 1 quiz on the first lesson.
 */
import { getPayload } from 'payload'
import config from './payload.config'

const richText = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
      },
    ],
  },
})

const seed = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding RSIPF LMS…')

  // 1. Users
  const admin = await payload.create({
    collection: 'users',
    data: {
      name: 'Sandra Admin',
      email: 'admin@rsipf.local',
      password: 'Password123!',
      role: 'admin',
      rank: 'Superintendent',
      unit: 'Honiara HQ',
      badgeNumber: 'A-0001',
      isActive: true,
    },
  })

  const instructor = await payload.create({
    collection: 'users',
    data: {
      name: 'Inspector James Tovua',
      email: 'instructor@rsipf.local',
      password: 'Password123!',
      role: 'instructor',
      rank: 'Inspector',
      unit: 'Training Academy',
      badgeNumber: 'I-0101',
      isActive: true,
    },
  })

  const officer1 = await payload.create({
    collection: 'users',
    data: {
      name: 'Constable Mary Kale',
      email: 'officer1@rsipf.local',
      password: 'Password123!',
      role: 'officer',
      rank: 'Constable',
      unit: 'Honiara Central',
      badgeNumber: 'O-1001',
      isActive: true,
    },
  })

  const officer2 = await payload.create({
    collection: 'users',
    data: {
      name: 'Sergeant Peter Manu',
      email: 'officer2@rsipf.local',
      password: 'Password123!',
      role: 'officer',
      rank: 'Sergeant',
      unit: 'Western Province',
      badgeNumber: 'O-1002',
      isActive: true,
    },
  })

  payload.logger.info(`Created users: admin, instructor, 2 officers`)

  // 2. Courses
  const course1 = await payload.create({
    collection: 'courses',
    data: {
      title: 'Community Policing Foundations',
      slug: 'community-policing-foundations',
      description: richText(
        'An introduction to community-focused policing for officers serving across the Solomon Islands. Covers principles, communication, and building trust with local communities.',
      ),
      status: 'published',
      assignedRoles: ['officer'],
      instructor: instructor.id,
      category: 'community-policing',
      duration: 90,
      tags: [{ tag: 'foundations' }, { tag: 'community' }],
    },
  })

  const course2 = await payload.create({
    collection: 'courses',
    data: {
      title: 'Evidence Handling and Chain of Custody',
      slug: 'evidence-handling',
      description: richText(
        'Practical guidance for officers and investigators on collecting, recording, and securing evidence so that cases hold up in court.',
      ),
      status: 'published',
      assignedRoles: ['officer'],
      instructor: instructor.id,
      category: 'investigations',
      duration: 120,
      tags: [{ tag: 'evidence' }, { tag: 'investigations' }],
    },
  })

  // 3. Modules + lessons + a quiz on the first lesson of course 1
  const buildCourseContent = async (courseId: string | number, prefix: string) => {
    const moduleA = await payload.create({
      collection: 'modules',
      data: { title: `${prefix} — Principles`, order: 1, course: courseId, description: 'Core concepts and context.' },
    })
    const moduleB = await payload.create({
      collection: 'modules',
      data: { title: `${prefix} — In Practice`, order: 2, course: courseId, description: 'Applying the principles on duty.' },
    })

    const lessons: { id: string | number }[] = []
    for (let i = 1; i <= 3; i += 1) {
      const l = await payload.create({
        collection: 'lessons',
        data: {
          title: `${prefix} Lesson ${i}`,
          order: i,
          module: i <= 2 ? moduleA.id : moduleB.id,
          type: 'text',
          content: richText(
            `This is lesson ${i} of ${prefix}. Read through the material carefully and complete any attached exercises.`,
          ),
          duration: 15,
        },
      })
      lessons.push({ id: l.id })
    }
    return { moduleA, moduleB, lessons }
  }

  const c1 = await buildCourseContent(course1.id, 'Community Policing')
  await buildCourseContent(course2.id, 'Evidence Handling')

  await payload.create({
    collection: 'quizzes',
    data: {
      title: 'Community Policing — Check Your Knowledge',
      lesson: c1.lessons[0].id,
      passMark: 70,
      maxAttempts: 3,
      questions: [
        {
          questionText: 'What is the primary aim of community policing?',
          options: [
            { text: 'To maximise the number of arrests' },
            { text: 'To build trust and solve problems together with the community' },
            { text: 'To replace traditional patrols entirely' },
            { text: 'To reduce paperwork' },
          ],
          correctAnswer: 1,
          points: 1,
        },
        {
          questionText: 'Which approach best supports community engagement?',
          options: [
            { text: 'Talking only with senior community leaders' },
            { text: 'Listening to a wide range of community voices, including youth and women' },
            { text: 'Avoiding informal interactions' },
            { text: 'Speaking only when an incident occurs' },
          ],
          correctAnswer: 1,
          points: 1,
        },
        {
          questionText: 'Why is chain of custody important when handling evidence?',
          options: [
            { text: 'It keeps stations tidy' },
            { text: 'It proves who handled the evidence and when, so it can be relied on in court' },
            { text: 'It is only required for serious crimes' },
            { text: 'It is optional for minor cases' },
          ],
          correctAnswer: 1,
          points: 1,
        },
      ],
    },
  })

  payload.logger.info('Seed complete.')
  payload.logger.info('Sign in as:')
  payload.logger.info('  admin@rsipf.local        / Password123!')
  payload.logger.info('  instructor@rsipf.local   / Password123!')
  payload.logger.info('  officer1@rsipf.local     / Password123!')
  payload.logger.info('  officer2@rsipf.local     / Password123!')

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
