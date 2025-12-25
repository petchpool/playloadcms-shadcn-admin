import { getPayload } from 'payload'
import config from '../payload.config'
import { batchSeed } from './utils/batch-seeder'

export async function seedUsers(roles: any[]) {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Users...')

  // Helper function to find role by slug
  const findRole = (slug: string) => {
    return roles.find((r) => r.slug === slug)
  }

  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      roles: [findRole('admin')],
      status: 'active' as const,
    },
    {
      email: 'editor@example.com',
      password: 'editor123',
      firstName: 'Editor',
      lastName: 'User',
      roles: [findRole('editor')],
      status: 'active' as const,
    },
    {
      email: 'author@example.com',
      password: 'author123',
      firstName: 'Author',
      lastName: 'User',
      roles: [findRole('author')],
      status: 'active' as const,
    },
    {
      email: 'viewer@example.com',
      password: 'viewer123',
      firstName: 'Viewer',
      lastName: 'User',
      roles: [findRole('viewer')],
      status: 'active' as const,
    },
  ]

  // Use batch seed with updateExisting to handle existing users
  const result = await batchSeed(payload, {
    collection: 'users',
    data: users,
    uniqueField: 'email',
    updateExisting: true, // Update existing users with new data
    batchSize: 10,
    transform: (userData, existing) => {
      // Get role IDs
      const roleIds = userData.roles.filter(Boolean).map((r: any) => r.id)

      // For new users, include password. For existing, only update fields without password
      if (existing) {
        return {
          firstName: userData.firstName,
          lastName: userData.lastName,
          roles: roleIds,
          status: userData.status,
        }
      }

      return {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: roleIds,
        status: userData.status,
      }
    },
  })

  console.log('✨ Users seeding completed!')

  return [...result.created, ...result.updated, ...result.skipped]
}
