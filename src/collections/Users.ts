import type { CollectionConfig } from 'payload'
import { hasAdminRoleSync } from '@/utils/check-role'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'status', 'createdAt'],
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      // Users can read their own profile
      if (user) return true
      return false
    },
    create: async ({ req }) => {
      // Only admins can create users
      if (!req.user) return false
      // Check if user has admin role
      return hasAdminRoleSync(req.user)
    },
    update: async ({ req, id }) => {
      // Users can update their own profile, admins can update anyone
      if (!req.user) return false
      if (req.user.id === id) return true
      // Check if user has admin role
      return hasAdminRoleSync(req.user)
    },
    delete: async ({ req }) => {
      // Only admins can delete users
      if (!req.user) return false
      // Check if user has admin role
      return hasAdminRoleSync(req.user)
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      required: true,
      defaultValue: [],
      admin: {
        description: 'Roles assigned to this user',
      },
      access: {
        update: ({ req: { user } }) => {
          // Only admins can update roles
          if (!user) return false
          return hasAdminRoleSync(user)
        },
      },
      hooks: {
        afterRead: [
          async ({ value, req }) => {
            // Expand roles to include permissions for JWT
            if (value && Array.isArray(value) && value.length > 0) {
              const roleIds = value.map((r) => (typeof r === 'object' && 'id' in r ? r.id : r))
              const roles = await req.payload.find({
                collection: 'roles',
                where: {
                  id: {
                    in: roleIds,
                  },
                },
                depth: 1,
              })

              return roles.docs
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
        {
          label: 'Suspended',
          value: 'suspended',
        },
      ],
      defaultValue: 'active',
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // Populate permissions from roles for fast access checks
        if (doc.roles && Array.isArray(doc.roles) && doc.roles.length > 0) {
          const roleIds = doc.roles.map((r: unknown) =>
            typeof r === 'object' && r !== null && 'id' in r ? (r as { id: string }).id : r,
          )
          const roles = await req.payload.find({
            collection: 'roles',
            where: {
              id: {
                in: roleIds,
              },
            },
            depth: 2, // Populate permissions and inheritedPermissions
          })

          // Store role slugs in a virtual field for JWT
          doc.roleSlugs = roles.docs.map((r: { slug: string }) => r.slug)

          // Collect all permissions from all roles
          const allPermissions: string[] = []
          for (const role of roles.docs) {
            const permissions = role.permissions || []
            const inheritedPermissions = role.inheritedPermissions || []
            const combined = [...permissions, ...inheritedPermissions]

            for (const perm of combined) {
              const permSlug =
                typeof perm === 'string'
                  ? perm
                  : typeof perm === 'object' && perm !== null && 'slug' in perm
                    ? (perm as { slug: string }).slug
                    : null

              if (permSlug && !allPermissions.includes(permSlug)) {
                allPermissions.push(permSlug)
              }
            }
          }

          // Store permissions in a virtual field for JWT
          doc.rolePermissions = allPermissions
        }
        return doc
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Save role slugs to JWT for fast access checks
        if (doc.roles && Array.isArray(doc.roles) && doc.roles.length > 0) {
          const roleIds = doc.roles.map((r: unknown) =>
            typeof r === 'object' && r !== null && 'id' in r ? (r as { id: string }).id : r,
          )
          const roles = await req.payload.find({
            collection: 'roles',
            where: {
              id: {
                in: roleIds,
              },
            },
            depth: 2, // Populate permissions
          })

          // Store role slugs in a virtual field for JWT
          doc.roleSlugs = roles.docs.map((r: { slug: string }) => r.slug)

          // Collect all permissions from all roles
          const allPermissions: string[] = []
          for (const role of roles.docs) {
            const permissions = role.permissions || []
            const inheritedPermissions = role.inheritedPermissions || []
            const combined = [...permissions, ...inheritedPermissions]

            for (const perm of combined) {
              const permSlug =
                typeof perm === 'string'
                  ? perm
                  : typeof perm === 'object' && perm !== null && 'slug' in perm
                    ? (perm as { slug: string }).slug
                    : null

              if (permSlug && !allPermissions.includes(permSlug)) {
                allPermissions.push(permSlug)
              }
            }
          }

          // Store permissions in a virtual field for JWT
          doc.rolePermissions = allPermissions
        }
        return doc
      },
    ],
  },
}
