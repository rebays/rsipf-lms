import type { CollectionConfig } from 'payload'
import { isAdminOrInstructor, isLoggedIn } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isAdminOrInstructor,
    read: isLoggedIn,
    update: isAdminOrInstructor,
    delete: isAdminOrInstructor,
  },
  upload: {
    mimeTypes: ['image/*', 'video/*', 'application/pdf', 'application/msword'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
