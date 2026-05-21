import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Courses } from './collections/Courses'
import { Modules } from './collections/Modules'
import { Lessons } from './collections/Lessons'
import { Quizzes } from './collections/Quizzes'
import { Attempts } from './collections/Attempts'
import { Progress } from './collections/Progress'
import { Certificates } from './collections/Certificates'
import { Announcements } from './collections/Announcements'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— RSIPF Academy',
    },
  },
  collections: [
    Users,
    Media,
    Courses,
    Modules,
    Lessons,
    Quizzes,
    Attempts,
    Progress,
    Certificates,
    Announcements,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      // Uploads go directly from the browser to the bucket via a signed URL,
      // bypassing the Next/Vercel function (and its 4.5MB body cap on Hobby).
      // Works locally against MinIO too — bucket just needs CORS configured.
      clientUploads: true,
      bucket: process.env.S3_BUCKET || 'rsipf-lms-media',
      config: {
        endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
        region: process.env.S3_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || 'minio',
          secretAccessKey: process.env.S3_SECRET_KEY || 'minio12345',
        },
        forcePathStyle: true,
      },
    }),
  ],
  sharp: undefined,
})
