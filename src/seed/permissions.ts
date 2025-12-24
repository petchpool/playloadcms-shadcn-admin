import { getPayload } from 'payload'
import config from '../payload.config'

const basePermissions = [
  // Pages permissions
  { name: 'Create Pages', resource: 'pages', action: 'create', description: 'Create new pages' },
  { name: 'Read Pages', resource: 'pages', action: 'read', description: 'View pages' },
  { name: 'Update Pages', resource: 'pages', action: 'update', description: 'Edit pages' },
  { name: 'Delete Pages', resource: 'pages', action: 'delete', description: 'Delete pages' },
  { name: 'Admin Pages', resource: 'pages', action: 'admin', description: 'Full access to pages' },

  // Sites permissions
  { name: 'Create Sites', resource: 'sites', action: 'create', description: 'Create new sites' },
  { name: 'Read Sites', resource: 'sites', action: 'read', description: 'View sites' },
  { name: 'Update Sites', resource: 'sites', action: 'update', description: 'Edit sites' },
  { name: 'Delete Sites', resource: 'sites', action: 'delete', description: 'Delete sites' },
  { name: 'Admin Sites', resource: 'sites', action: 'admin', description: 'Full access to sites' },

  // Layouts permissions
  { name: 'Create Layouts', resource: 'layouts', action: 'create', description: 'Create new layouts' },
  { name: 'Read Layouts', resource: 'layouts', action: 'read', description: 'View layouts' },
  { name: 'Update Layouts', resource: 'layouts', action: 'update', description: 'Edit layouts' },
  { name: 'Delete Layouts', resource: 'layouts', action: 'delete', description: 'Delete layouts' },
  { name: 'Admin Layouts', resource: 'layouts', action: 'admin', description: 'Full access to layouts' },

  // Components permissions
  { name: 'Create Components', resource: 'components', action: 'create', description: 'Create new components' },
  { name: 'Read Components', resource: 'components', action: 'read', description: 'View components' },
  { name: 'Update Components', resource: 'components', action: 'update', description: 'Edit components' },
  { name: 'Delete Components', resource: 'components', action: 'delete', description: 'Delete components' },
  { name: 'Admin Components', resource: 'components', action: 'admin', description: 'Full access to components' },

  // Languages permissions
  { name: 'Create Languages', resource: 'languages', action: 'create', description: 'Create new languages' },
  { name: 'Read Languages', resource: 'languages', action: 'read', description: 'View languages' },
  { name: 'Update Languages', resource: 'languages', action: 'update', description: 'Edit languages' },
  { name: 'Delete Languages', resource: 'languages', action: 'delete', description: 'Delete languages' },
  { name: 'Admin Languages', resource: 'languages', action: 'admin', description: 'Full access to languages' },

  // Users permissions
  { name: 'Create Users', resource: 'users', action: 'create', description: 'Create new users' },
  { name: 'Read Users', resource: 'users', action: 'read', description: 'View users' },
  { name: 'Update Users', resource: 'users', action: 'update', description: 'Edit users' },
  { name: 'Delete Users', resource: 'users', action: 'delete', description: 'Delete users' },
  { name: 'Admin Users', resource: 'users', action: 'admin', description: 'Full access to users' },

  // Roles permissions
  { name: 'Create Roles', resource: 'roles', action: 'create', description: 'Create new roles' },
  { name: 'Read Roles', resource: 'roles', action: 'read', description: 'View roles' },
  { name: 'Update Roles', resource: 'roles', action: 'update', description: 'Edit roles' },
  { name: 'Delete Roles', resource: 'roles', action: 'delete', description: 'Delete roles' },
  { name: 'Admin Roles', resource: 'roles', action: 'admin', description: 'Full access to roles' },

  // Permissions permissions
  { name: 'Create Permissions', resource: 'permissions', action: 'create', description: 'Create new permissions' },
  { name: 'Read Permissions', resource: 'permissions', action: 'read', description: 'View permissions' },
  { name: 'Update Permissions', resource: 'permissions', action: 'update', description: 'Edit permissions' },
  { name: 'Delete Permissions', resource: 'permissions', action: 'delete', description: 'Delete permissions' },
  { name: 'Admin Permissions', resource: 'permissions', action: 'admin', description: 'Full access to permissions' },

  // Media permissions
  { name: 'Create Media', resource: 'media', action: 'create', description: 'Upload media files' },
  { name: 'Read Media', resource: 'media', action: 'read', description: 'View media files' },
  { name: 'Update Media', resource: 'media', action: 'update', description: 'Edit media files' },
  { name: 'Delete Media', resource: 'media', action: 'delete', description: 'Delete media files' },
  { name: 'Admin Media', resource: 'media', action: 'admin', description: 'Full access to media' },

  // All permissions
  { name: 'All Permissions', resource: 'all', action: 'all', description: 'Full access to all resources' },
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
          status: 'active',
        },
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

