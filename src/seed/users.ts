import { getPayload } from 'payload'
import config from '../payload.config'

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
      status: 'active',
    },
    {
      email: 'editor@example.com',
      password: 'editor123',
      firstName: 'Editor',
      lastName: 'User',
      roles: [findRole('editor')],
      status: 'active',
    },
    {
      email: 'author@example.com',
      password: 'author123',
      firstName: 'Author',
      lastName: 'User',
      roles: [findRole('author')],
      status: 'active',
    },
    {
      email: 'viewer@example.com',
      password: 'viewer123',
      firstName: 'Viewer',
      lastName: 'User',
      roles: [findRole('viewer')],
      status: 'active',
    },
  ]

  const createdUsers: any[] = []

  for (const userData of users) {
    try {
      // Check if user already exists
      const existing = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: userData.email,
          },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  User "${userData.email}" already exists, skipping...`)
        createdUsers.push(existing.docs[0])
        continue
      }

      // Get role IDs
      const roleIds = userData.roles.filter(Boolean).map((r) => r.id)

      // Create user
      const user = await payload.create({
        collection: 'users',
        data: {
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          roles: roleIds,
          status: userData.status,
        },
        overrideAccess: true,
      })

      createdUsers.push(user)
      const roleNames = userData.roles.map((r) => r.name).join(', ')
      console.log(`  ✅ Created user: ${user.email} (${roleNames})`)
    } catch (error) {
      console.error(`  ❌ Error creating user "${userData.email}":`, error)
    }
  }

  console.log(`✨ Created ${createdUsers.length} users`)
  console.log('✨ Users seeding completed!')

  return createdUsers
}

