/**
 * Check if user has a specific role
 * Handles both relationship array and select array formats
 */
export async function hasRole(user: any, roleSlug: string, payload?: any): Promise<boolean> {
  if (!user) return false

  // If roles is already an array of strings (select field)
  if (Array.isArray(user.roles)) {
    return user.roles.some((r: any) => {
      if (typeof r === 'string') return r === roleSlug
      if (typeof r === 'object' && 'slug' in r) return r.slug === roleSlug
      return false
    })
  }

  // If roles is a relationship array (need to fetch)
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    // Check if already populated
    const firstRole = user.roles[0]
    if (typeof firstRole === 'object' && 'slug' in firstRole) {
      return user.roles.some((r: any) => r.slug === roleSlug)
    }

    // If not populated and payload is provided, fetch roles
    if (payload) {
      try {
        const roleIds = user.roles.map((r: any) => (typeof r === 'object' && 'id' in r ? r.id : r))
        const roles = await payload.find({
          collection: 'roles',
          where: {
            id: {
              in: roleIds,
            },
          },
          limit: 100,
          depth: 0,
        })

        return roles.docs.some((r: { slug: string }) => r.slug === roleSlug)
      } catch (error) {
        console.error('Error checking role:', error)
        return false
      }
    }
  }

  return false
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(user: any, roleSlugs: string[], payload?: any): Promise<boolean> {
  if (!user || !roleSlugs.length) return false

  for (const roleSlug of roleSlugs) {
    if (await hasRole(user, roleSlug, payload)) {
      return true
    }
  }

  return false
}

/**
 * Check if user has admin role (synchronous version for access control)
 * This version works with populated roles from JWT or afterRead hook
 */
export function hasAdminRoleSync(user: any): boolean {
  if (!user) return false

  // Check roleSlugs from JWT (set in afterChange hook)
  if (user.roleSlugs && Array.isArray(user.roleSlugs)) {
    return user.roleSlugs.includes('admin')
  }

  // Check roles if populated
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.some((r: any) => {
      if (typeof r === 'string') return r === 'admin'
      if (typeof r === 'object' && 'slug' in r) return r.slug === 'admin'
      return false
    })
  }

  return false
}

/**
 * Check if user has any of the specified roles (synchronous version)
 */
export function hasAnyRoleSync(user: any, roleSlugs: string[]): boolean {
  if (!user || !roleSlugs.length) return false

  // Check roleSlugs from JWT
  if (user.roleSlugs && Array.isArray(user.roleSlugs)) {
    return roleSlugs.some((slug) => user.roleSlugs.includes(slug))
  }

  // Check roles if populated
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.some((r: unknown) => {
      const roleSlug =
        typeof r === 'string'
          ? r
          : typeof r === 'object' && r !== null && 'slug' in r
            ? (r as { slug: string }).slug
            : null
      return roleSlug && roleSlugs.includes(roleSlug)
    })
  }

  return false
}
