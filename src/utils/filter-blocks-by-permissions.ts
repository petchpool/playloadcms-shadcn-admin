import { hasAnyPermissionSync } from './check-permission'

/**
 * Extract permission slugs from relationship array
 * Handles both populated and unpopulated relationships
 */
async function extractPermissionSlugs(
  requiredPermissions: any,
  payload?: any,
): Promise<string[]> {
  if (!requiredPermissions) return []

  if (Array.isArray(requiredPermissions)) {
    const slugs: string[] = []

    for (const perm of requiredPermissions) {
      if (typeof perm === 'string') {
        slugs.push(perm)
      } else if (typeof perm === 'object' && perm !== null) {
        // If populated (has slug property)
        if ('slug' in perm) {
          slugs.push(perm.slug as string)
        }
        // If unpopulated (has id property) and payload provided, fetch permission
        else if ('id' in perm && payload) {
          try {
            const permDoc = await payload.findByID({
              collection: 'permissions',
              id: perm.id as string,
              depth: 0,
            })
            if (permDoc?.slug) {
              slugs.push(permDoc.slug)
            }
          } catch (error) {
            console.error('Error fetching permission:', error)
          }
        }
      }
    }

    return slugs
  }

  if (typeof requiredPermissions === 'string') {
    return [requiredPermissions]
  }

  return []
}

/**
 * Synchronous version - extracts permission slugs from populated relationships
 */
function extractPermissionSlugsSync(requiredPermissions: any): string[] {
  if (!requiredPermissions) return []

  if (Array.isArray(requiredPermissions)) {
    return requiredPermissions
      .map((perm) => {
        if (typeof perm === 'string') return perm
        if (typeof perm === 'object' && perm !== null && 'slug' in perm) {
          return perm.slug as string
        }
        return null
      })
      .filter((slug): slug is string => slug !== null)
  }

  if (typeof requiredPermissions === 'string') {
    return [requiredPermissions]
  }

  return []
}

/**
 * Filter blocks array based on user permissions
 * Removes blocks that require permissions the user doesn't have
 */
export function filterBlocksByPermissions(blocks: any[], user: any): any[] {
  if (!blocks || !Array.isArray(blocks)) return blocks || []

  // If no user, filter out all blocks that require permissions
  if (!user) {
    return blocks.filter((block) => {
      const requiredPermissions = block.requiredPermissions
      const permissionSlugs = extractPermissionSlugsSync(requiredPermissions)
      return permissionSlugs.length === 0
    })
  }

  // Admin has all permissions
  if (user.roleSlugs && Array.isArray(user.roleSlugs) && user.roleSlugs.includes('admin')) {
    return blocks
  }

  return blocks.filter((block) => {
    const requiredPermissions = block.requiredPermissions
    const permissionSlugs = extractPermissionSlugsSync(requiredPermissions)

    // If no required permissions, allow the block
    if (permissionSlugs.length === 0) {
      return true
    }

    // Check if user has any of the required permissions
    return hasAnyPermissionSync(user, permissionSlugs)
  })
}

/**
 * Recursively filter blocks in nested structures (e.g., grid items)
 */
export function filterBlocksRecursively(blocks: any[], user: any): any[] {
  if (!blocks || !Array.isArray(blocks)) return blocks || []

  return filterBlocksByPermissions(blocks, user).map((block) => {
    // Handle nested blocks in grid (e.g., grid.items.content)
    if (block.blockType === 'grid' && block.items && Array.isArray(block.items)) {
      return {
        ...block,
        items: block.items.map((item: any) => {
          if (item.content && Array.isArray(item.content)) {
            return {
              ...item,
              content: filterBlocksRecursively(item.content, user),
            }
          }
          return item
        }),
      }
    }

    return block
  })
}

