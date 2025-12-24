/**
 * Check if user has a specific permission
 * Checks user's roles and their associated permissions
 */
export async function hasPermission(
  user: any,
  permissionSlug: string,
  payload?: any,
): Promise<boolean> {
  if (!user || !permissionSlug) return false

  // Admin has all permissions
  if (user.roleSlugs && Array.isArray(user.roleSlugs)) {
    if (user.roleSlugs.includes('admin')) return true
  }

  // Check roles if populated
  if (user.roles && Array.isArray(user.roles)) {
    const roleSlugs: string[] = []

    // Extract role slugs
    for (const role of user.roles) {
      if (typeof role === 'string') {
        roleSlugs.push(role)
      } else if (typeof role === 'object' && role !== null) {
        if ('slug' in role) {
          roleSlugs.push(role.slug as string)
        } else if ('id' in role && payload) {
          // Need to fetch role
          try {
            const roleDoc = await payload.findByID({
              collection: 'roles',
              id: role.id as string,
              depth: 1,
            })
            if (roleDoc?.slug) {
              roleSlugs.push(roleDoc.slug)
            }
          } catch (error) {
            console.error('Error fetching role:', error)
          }
        }
      }
    }

    // Admin role has all permissions
    if (roleSlugs.includes('admin')) return true

    // Fetch permissions for all roles
    if (payload && roleSlugs.length > 0) {
      try {
        const roles = await payload.find({
          collection: 'roles',
          where: {
            slug: {
              in: roleSlugs,
            },
          },
          depth: 2, // Populate permissions
          limit: 100,
        })

        // Check all permissions from all roles
        for (const role of roles.docs) {
          const permissions = role.permissions || []
          const inheritedPermissions = role.inheritedPermissions || []
          const allPermissions = [...permissions, ...inheritedPermissions]

          for (const perm of allPermissions) {
            const permSlug =
              typeof perm === 'string'
                ? perm
                : typeof perm === 'object' && perm !== null && 'slug' in perm
                  ? (perm as { slug: string }).slug
                  : null

            if (permSlug === permissionSlug) {
              return true
            }

            // Check for wildcard permissions (e.g., "pages.all" matches "pages.create")
            if (permSlug && permSlug.endsWith('.all')) {
              const resource = permSlug.split('.')[0]
              if (permissionSlug.startsWith(resource + '.')) {
                return true
              }
            }

            // Check for "all.all" permission (super admin)
            if (permSlug === 'all.all') {
              return true
            }
          }
        }
      } catch (error) {
        console.error('Error checking permissions:', error)
      }
    }
  }

  return false
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(
  user: any,
  permissionSlugs: string[],
  payload?: any,
): Promise<boolean> {
  if (!user || !permissionSlugs.length) return false

  for (const permissionSlug of permissionSlugs) {
    if (await hasPermission(user, permissionSlug, payload)) {
      return true
    }
  }

  return false
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(
  user: any,
  permissionSlugs: string[],
  payload?: any,
): Promise<boolean> {
  if (!user || !permissionSlugs.length) return false

  for (const permissionSlug of permissionSlugs) {
    if (!(await hasPermission(user, permissionSlug, payload))) {
      return false
    }
  }

  return true
}

/**
 * Synchronous version for access control (works with populated roles from JWT)
 * This version checks permissions from user.rolePermissions array (set in afterRead hook)
 */
export function hasPermissionSync(user: any, permissionSlug: string): boolean {
  if (!user || !permissionSlug) return false

  // Admin has all permissions
  if (user.roleSlugs && Array.isArray(user.roleSlugs)) {
    if (user.roleSlugs.includes('admin')) return true
  }

  // Check rolePermissions array (set in afterRead hook)
  if (user.rolePermissions && Array.isArray(user.rolePermissions)) {
    if (user.rolePermissions.includes(permissionSlug)) return true

    // Check for wildcard permissions
    for (const perm of user.rolePermissions) {
      if (typeof perm === 'string') {
        // Check for wildcard (e.g., "pages.all" matches "pages.create")
        if (perm.endsWith('.all')) {
          const resource = perm.split('.')[0]
          if (permissionSlug.startsWith(resource + '.')) {
            return true
          }
        }

        // Check for "all.all" permission
        if (perm === 'all.all') {
          return true
        }
      }
    }
  }

  return false
}

/**
 * Synchronous version - check if user has any of the specified permissions
 */
export function hasAnyPermissionSync(user: any, permissionSlugs: string[]): boolean {
  if (!user || !permissionSlugs.length) return false

  for (const permissionSlug of permissionSlugs) {
    if (hasPermissionSync(user, permissionSlug)) {
      return true
    }
  }

  return false
}

/**
 * Synchronous version - check if user has all of the specified permissions
 */
export function hasAllPermissionsSync(user: any, permissionSlugs: string[]): boolean {
  if (!user || !permissionSlugs.length) return false

  for (const permissionSlug of permissionSlugs) {
    if (!hasPermissionSync(user, permissionSlug)) {
      return false
    }
  }

  return true
}
