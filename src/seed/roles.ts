import { getPayload } from 'payload'
import config from '../payload.config'

export async function seedRoles(permissions: any[]) {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Roles...')

  // Helper function to find permission by slug
  const findPermission = (resource: string, action: string) => {
    return permissions.find((p) => p.slug === `${resource}.${action}`)
  }

  // Helper function to get permission IDs
  const getPermissionIds = (perms: any[]) => {
    return perms.filter(Boolean).map((p) => p.id)
  }

  const roles = [
    {
      name: 'Administrator',
      slug: 'admin',
      description: 'Full system access with all permissions',
      level: 10,
      isSystemRole: true,
      permissions: [
        findPermission('all', 'all'), // Full access
      ],
    },
    {
      name: 'Editor',
      slug: 'editor',
      description: 'Can create, read, and update content but cannot manage users or system settings',
      level: 7,
      isSystemRole: true,
      permissions: [
        // Pages
        findPermission('pages', 'create'),
        findPermission('pages', 'read'),
        findPermission('pages', 'update'),
        findPermission('pages', 'delete'),
        // Sites
        findPermission('sites', 'read'),
        findPermission('sites', 'update'),
        // Layouts
        findPermission('layouts', 'create'),
        findPermission('layouts', 'read'),
        findPermission('layouts', 'update'),
        // Components
        findPermission('components', 'create'),
        findPermission('components', 'read'),
        findPermission('components', 'update'),
        // Languages
        findPermission('languages', 'read'),
        // Media
        findPermission('media', 'create'),
        findPermission('media', 'read'),
        findPermission('media', 'update'),
        findPermission('media', 'delete'),
      ],
    },
    {
      name: 'Author',
      slug: 'author',
      description: 'Can create and edit their own content',
      level: 5,
      isSystemRole: true,
      permissions: [
        // Pages
        findPermission('pages', 'create'),
        findPermission('pages', 'read'),
        findPermission('pages', 'update'),
        // Sites
        findPermission('sites', 'read'),
        // Layouts
        findPermission('layouts', 'read'),
        // Components
        findPermission('components', 'read'),
        // Languages
        findPermission('languages', 'read'),
        // Media
        findPermission('media', 'create'),
        findPermission('media', 'read'),
        findPermission('media', 'update'),
      ],
    },
    {
      name: 'Viewer',
      slug: 'viewer',
      description: 'Read-only access to content',
      level: 3,
      isSystemRole: true,
      permissions: [
        // Read-only permissions
        findPermission('pages', 'read'),
        findPermission('sites', 'read'),
        findPermission('layouts', 'read'),
        findPermission('components', 'read'),
        findPermission('languages', 'read'),
        findPermission('media', 'read'),
      ],
    },
  ]

  const createdRoles: any[] = []

  for (const roleData of roles) {
    try {
      // Check if role already exists
      const existing = await payload.find({
        collection: 'roles',
        where: {
          slug: {
            equals: roleData.slug,
          },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        console.log(`  ⏭️  Role "${roleData.name}" already exists, skipping...`)
        createdRoles.push(existing.docs[0])
        continue
      }

      // Get permission IDs
      const permissionIds = getPermissionIds(roleData.permissions)

      // Create role
      const role = await payload.create({
        collection: 'roles',
        data: {
          name: roleData.name,
          slug: roleData.slug,
          description: roleData.description,
          level: roleData.level,
          isSystemRole: roleData.isSystemRole,
          permissions: permissionIds,
          status: 'active',
        },
        overrideAccess: true,
      })

      createdRoles.push(role)
      console.log(`  ✅ Created role: ${role.name} (${role.slug}) - Level ${role.level}`)
      console.log(`     - Permissions: ${permissionIds.length}`)
    } catch (error) {
      console.error(`  ❌ Error creating role "${roleData.name}":`, error)
    }
  }

  console.log(`✨ Created ${createdRoles.length} roles`)
  console.log('✨ Roles seeding completed!')

  return createdRoles
}

