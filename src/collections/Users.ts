import type { CollectionConfig } from 'payload'

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
      const userRoles = await req.payload.find({
        collection: 'users',
        where: { id: { equals: req.user.id } },
        depth: 1,
      })
      const roles = userRoles.docs[0]?.roles || []
      return roles.some((r: any) => {
        const roleSlug = typeof r === 'object' && 'slug' in r ? r.slug : r
        return roleSlug === 'admin'
      })
    },
    update: async ({ req, id }) => {
      // Users can update their own profile, admins can update anyone
      if (!req.user) return false
      if (req.user.id === id) return true
      // Check if user has admin role
      const userRoles = await req.payload.find({
        collection: 'users',
        where: { id: { equals: req.user.id } },
        depth: 1,
      })
      const roles = userRoles.docs[0]?.roles || []
      return roles.some((r: any) => {
        const roleSlug = typeof r === 'object' && 'slug' in r ? r.slug : r
        return roleSlug === 'admin'
      })
    },
    delete: async ({ req }) => {
      // Only admins can delete users
      if (!req.user) return false
      // Check if user has admin role
      const userRoles = await req.payload.find({
        collection: 'users',
        where: { id: { equals: req.user.id } },
        depth: 1,
      })
      const roles = userRoles.docs[0]?.roles || []
      return roles.some((r: any) => {
        const roleSlug = typeof r === 'object' && 'slug' in r ? r.slug : r
        return roleSlug === 'admin'
      })
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
        update: async ({ req }) => {
          // Only admins can update roles
          if (!req.user) return false
          // Check if user has admin role
          const userRoles = await req.payload.find({
            collection: 'users',
            where: { id: { equals: req.user.id } },
            depth: 1,
          })
          const roles = userRoles.docs[0]?.roles || []
          return roles.some((r: any) => {
            const roleSlug = typeof r === 'object' && 'slug' in r ? r.slug : r
            return roleSlug === 'admin'
          })
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
    afterChange: [
      async ({ doc, req, operation }) => {
        // Save role slugs to JWT for fast access checks
        if (doc.roles && Array.isArray(doc.roles) && doc.roles.length > 0) {
          const roleIds = doc.roles.map((r) => (typeof r === 'object' && 'id' in r ? r.id : r))
          const roles = await req.payload.find({
            collection: 'roles',
            where: {
              id: {
                in: roleIds,
              },
            },
            depth: 0,
          })

          // Store role slugs in a virtual field for JWT
          doc.roleSlugs = roles.docs.map((r) => r.slug)
        }
        return doc
      },
    ],
  },
}
