/**
 * Seed script for the RSIPF Academy
 * .
 *
 * Run with: npm run seed
 *
 * Creates: 1 admin, 1 instructor, 2 officer users + 30 training modules.
 */
import { getPayload } from 'payload'
import config from './payload.config'

const MODULE_TITLES = [
  'Being a Professional Police Officer',
  'Police Administrative Duties',
  'Community and Police Working Together',
  'Useful Communication at Work',
  'Maintain Operational Equipment',
  'Address Community Needs',
  'Introduction to Criminal Law',
  'Police Powers of Arrest',
  'Conduct Initial Police Investigation',
  'Gather, Collate and Record Information',
  'Use Police Methods',
  'Assist in the Judicial',
  'Attempts to Commit Offences',
  'Parties to Offences',
  'Criminal Responsibility',
  'Public Order Offences',
  'Offences Against Property',
  'Offences Against Persons',
  'Family Violence',
  'Common Firearms Offences for General Duties Police',
  'Common Drug Offences for General Duties Police',
  'Common Liquor Offences for General Duties Police',
  'Traffic Offences',
  'Cell and Custody Procedures',
  'Give Evidence in Court',
  'Leadership',
  'First Response – Incident Management',
  'First Aid',
  'People Skills and Conflict Resolution',
  'Operational Safety Training',
]

const seed = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding RSIPF LMS…')

  // 1. Users
  const users = [
    // Admin
    {
      name: 'Commissioner David Teva',
      email: 'commissioner@rsipf.gov.sb',
      password: 'Password123!',
      role: 'admin',
      rank: 'Commissioner',
      unit: 'RSIPF Headquarters',
      badgeNumber: 'HQ-0001',
      isActive: true,
    },
    // Instructors
    {
      name: 'Inspector Grace Suri',
      email: 'grace.suri@rsipf.gov.sb',
      password: 'Password123!',
      role: 'instructor',
      rank: 'Inspector',
      unit: 'Training Academy – Kukum',
      badgeNumber: 'TR-0101',
      isActive: true,
    },
    {
      name: 'Senior Sergeant Paul Wale',
      email: 'paul.wale@rsipf.gov.sb',
      password: 'Password123!',
      role: 'instructor',
      rank: 'Senior Sergeant',
      unit: 'Training Academy – Kukum',
      badgeNumber: 'TR-0102',
      isActive: true,
    },
    // Officers
    {
      name: 'Constable Ruth Fono',
      email: 'ruth.fono@rsipf.gov.sb',
      password: 'Password123!',
      role: 'officer',
      rank: 'Constable',
      unit: 'Honiara Central',
      badgeNumber: 'HC-2001',
      isActive: true,
    },
    {
      name: 'Constable John Maetia',
      email: 'john.maetia@rsipf.gov.sb',
      password: 'Password123!',
      role: 'officer',
      rank: 'Constable',
      unit: 'Honiara Central',
      badgeNumber: 'HC-2002',
      isActive: true,
    },
    {
      name: 'Sergeant Alice Toata',
      email: 'alice.toata@rsipf.gov.sb',
      password: 'Password123!',
      role: 'officer',
      rank: 'Sergeant',
      unit: 'Western Province',
      badgeNumber: 'WP-3001',
      isActive: true,
    },
    {
      name: 'Constable Ben Houaniwell',
      email: 'ben.houaniwell@rsipf.gov.sb',
      password: 'Password123!',
      role: 'officer',
      rank: 'Constable',
      unit: 'Malaita Province',
      badgeNumber: 'MP-4001',
      isActive: true,
    },
    {
      name: 'James Carlos',
      email: 'james.carlos@gmail.com',
      password: 'jcarlos',
      role: 'officer',
      rank: 'Senior Constable',
      unit: 'Guadalcanal Province',
      badgeNumber: 'GP-5001',
      isActive: true,
    },
  ]

  for (const u of users) {
    await payload.create({ collection: 'users', data: u as any })
  }

  payload.logger.info(`Created ${users.length} users`)

  // 2. Modules
  const makeDocuments = (title: string) => [
    {
      title: `${title} – Study Guide`,
      description: 'Core reading material covering the key concepts and procedures for this module.',
      fileType: 'pdf',
    },
    {
      title: `${title} – Reference Sheet`,
      description: 'Quick-reference summary designed for field use.',
      fileType: 'pdf',
    },
    {
      title: `${title} – Assessment Criteria`,
      description: 'Outlines the standards and competencies required to pass this module.',
      fileType: 'word',
    },
  ]

  for (let i = 0; i < MODULE_TITLES.length; i++) {
    await payload.create({
      collection: 'modules',
      data: {
        order: i + 1,
        title: MODULE_TITLES[i],
        status: 'published',
        documents: makeDocuments(MODULE_TITLES[i]),
      },
    })
  }

  payload.logger.info(`Created ${MODULE_TITLES.length} modules with documents`)

  payload.logger.info('Seed complete.')
  payload.logger.info('Sign in as any seeded user with: Password123!')

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
