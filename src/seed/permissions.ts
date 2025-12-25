import { getPayload } from 'payload'
import config from '../payload.config'

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const basePermissions = [
  // Pages permissions
  {
    name: 'Create Pages',
    resource: 'pages' as const,
    action: 'create' as const,
    description: 'Create new pages',
  },
  {
    name: 'Read Pages',
    resource: 'pages' as const,
    action: 'read' as const,
    description: 'View pages',
  },
  {
    name: 'Update Pages',
    resource: 'pages' as const,
    action: 'update' as const,
    description: 'Edit pages',
  },
  {
    name: 'Delete Pages',
    resource: 'pages' as const,
    action: 'delete' as const,
    description: 'Delete pages',
  },
  {
    name: 'Admin Pages',
    resource: 'pages' as const,
    action: 'admin' as const,
    description: 'Full access to pages',
  },

  // Sites permissions
  {
    name: 'Create Sites',
    resource: 'sites' as const,
    action: 'create' as const,
    description: 'Create new sites',
  },
  {
    name: 'Read Sites',
    resource: 'sites' as const,
    action: 'read' as const,
    description: 'View sites',
  },
  {
    name: 'Update Sites',
    resource: 'sites' as const,
    action: 'update' as const,
    description: 'Edit sites',
  },
  {
    name: 'Delete Sites',
    resource: 'sites' as const,
    action: 'delete' as const,
    description: 'Delete sites',
  },
  {
    name: 'Admin Sites',
    resource: 'sites' as const,
    action: 'admin' as const,
    description: 'Full access to sites',
  },

  // Layouts permissions
  {
    name: 'Create Layouts',
    resource: 'layouts' as const,
    action: 'create' as const,
    description: 'Create new layouts',
  },
  {
    name: 'Read Layouts',
    resource: 'layouts' as const,
    action: 'read' as const,
    description: 'View layouts',
  },
  {
    name: 'Update Layouts',
    resource: 'layouts' as const,
    action: 'update' as const,
    description: 'Edit layouts',
  },
  {
    name: 'Delete Layouts',
    resource: 'layouts' as const,
    action: 'delete' as const,
    description: 'Delete layouts',
  },
  {
    name: 'Admin Layouts',
    resource: 'layouts' as const,
    action: 'admin' as const,
    description: 'Full access to layouts',
  },

  // Components permissions
  {
    name: 'Create Components',
    resource: 'components' as const,
    action: 'create' as const,
    description: 'Create new components',
  },
  {
    name: 'Read Components',
    resource: 'components' as const,
    action: 'read' as const,
    description: 'View components',
  },
  {
    name: 'Update Components',
    resource: 'components' as const,
    action: 'update' as const,
    description: 'Edit components',
  },
  {
    name: 'Delete Components',
    resource: 'components' as const,
    action: 'delete' as const,
    description: 'Delete components',
  },
  {
    name: 'Admin Components',
    resource: 'components' as const,
    action: 'admin' as const,
    description: 'Full access to components',
  },

  // Languages permissions
  {
    name: 'Create Languages',
    resource: 'languages' as const,
    action: 'create' as const,
    description: 'Create new languages',
  },
  {
    name: 'Read Languages',
    resource: 'languages' as const,
    action: 'read' as const,
    description: 'View languages',
  },
  {
    name: 'Update Languages',
    resource: 'languages' as const,
    action: 'update' as const,
    description: 'Edit languages',
  },
  {
    name: 'Delete Languages',
    resource: 'languages' as const,
    action: 'delete' as const,
    description: 'Delete languages',
  },
  {
    name: 'Admin Languages',
    resource: 'languages' as const,
    action: 'admin' as const,
    description: 'Full access to languages',
  },

  // Users permissions
  {
    name: 'Create Users',
    resource: 'users' as const,
    action: 'create' as const,
    description: 'Create new users',
  },
  {
    name: 'Read Users',
    resource: 'users' as const,
    action: 'read' as const,
    description: 'View users',
  },
  {
    name: 'Update Users',
    resource: 'users' as const,
    action: 'update' as const,
    description: 'Edit users',
  },
  {
    name: 'Delete Users',
    resource: 'users' as const,
    action: 'delete' as const,
    description: 'Delete users',
  },
  {
    name: 'Admin Users',
    resource: 'users' as const,
    action: 'admin' as const,
    description: 'Full access to users',
  },

  // Roles permissions
  {
    name: 'Create Roles',
    resource: 'roles' as const,
    action: 'create' as const,
    description: 'Create new roles',
  },
  {
    name: 'Read Roles',
    resource: 'roles' as const,
    action: 'read' as const,
    description: 'View roles',
  },
  {
    name: 'Update Roles',
    resource: 'roles' as const,
    action: 'update' as const,
    description: 'Edit roles',
  },
  {
    name: 'Delete Roles',
    resource: 'roles' as const,
    action: 'delete' as const,
    description: 'Delete roles',
  },
  {
    name: 'Admin Roles',
    resource: 'roles' as const,
    action: 'admin' as const,
    description: 'Full access to roles',
  },

  // Permissions permissions
  {
    name: 'Create Permissions',
    resource: 'permissions' as const,
    action: 'create' as const,
    description: 'Create new permissions',
  },
  {
    name: 'Read Permissions',
    resource: 'permissions' as const,
    action: 'read' as const,
    description: 'View permissions',
  },
  {
    name: 'Update Permissions',
    resource: 'permissions' as const,
    action: 'update' as const,
    description: 'Edit permissions',
  },
  {
    name: 'Delete Permissions',
    resource: 'permissions' as const,
    action: 'delete' as const,
    description: 'Delete permissions',
  },
  {
    name: 'Admin Permissions',
    resource: 'permissions' as const,
    action: 'admin' as const,
    description: 'Full access to permissions',
  },

  // Media permissions
  {
    name: 'Create Media',
    resource: 'media' as const,
    action: 'create' as const,
    description: 'Upload media files',
  },
  {
    name: 'Read Media',
    resource: 'media' as const,
    action: 'read' as const,
    description: 'View media files',
  },
  {
    name: 'Update Media',
    resource: 'media' as const,
    action: 'update' as const,
    description: 'Edit media files',
  },
  {
    name: 'Delete Media',
    resource: 'media' as const,
    action: 'delete' as const,
    description: 'Delete media files',
  },
  {
    name: 'Admin Media',
    resource: 'media' as const,
    action: 'admin' as const,
    description: 'Full access to media',
  },

  // All permissions
  {
    name: 'All Permissions',
    resource: 'all' as const,
    action: 'all' as const,
    description: 'Full access to all resources',
  },
]

export async function seedPermissions() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Permissions...')

  const createdPermissions: any[] = []

  for (const permData of basePermissions) {
    try {
      // Check if permission already exists
      const existing = await payload.find({
        collection: 'permissions',
        where: {
          slug: {
            equals: `${permData.resource}.${permData.action}`,
          },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Permission "${permData.name}" already exists, skipping...`)
        createdPermissions.push(existing.docs[0])
        continue
      }

      // Create permission
      const permission = await payload.create({
        collection: 'permissions',
        data: {
          ...permData,
          slug: generateSlug(permData.name),
          status: 'active' as const,
        },
        draft: false,
        overrideAccess: true,
      })

      createdPermissions.push(permission)
      console.log(`  ✅ Created permission: ${permission.name} (${permission.slug})`)
    } catch (error) {
      console.error(`  ❌ Error creating permission "${permData.name}":`, error)
    }
  }

  console.log(`✨ Created ${createdPermissions.length} permissions`)
  console.log('✨ Permissions seeding completed!')

  return createdPermissions
}
