import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Modules } from './collections/Modules'
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
    Modules,
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
