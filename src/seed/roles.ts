import { getPayload } from 'payload'
import config from '../payload.config'
import { batchSeed } from './utils/batch-seeder'

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

  // Use batch seed with transform to add permission IDs
  const result = await batchSeed(payload, {
    collection: 'roles',
    data: roles,
    uniqueField: 'slug',
    batchSize: 10,
    transform: (roleData) => ({
      name: roleData.name,
      slug: roleData.slug,
      description: roleData.description,
      level: roleData.level,
      isSystemRole: roleData.isSystemRole,
      permissions: getPermissionIds(roleData.permissions),
      status: 'active',
    }),
  })

  console.log('✨ Roles seeding completed!')

  return [...result.created, ...result.skipped]
}

