import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'level', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: async ({ req: { user } }) => {
      if (!user) return false
      // Check if user has admin role - simplified for now
      // Will be improved with proper role checking utility
      return true // Allow for initial setup
    },
    update: async ({ req: { user } }) => {
      if (!user) return false
      return true // Allow for initial setup
    },
    delete: async ({ req: { user } }) => {
      if (!user) return false
      return true // Allow for initial setup
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Role display name (e.g., Administrator, Editor, Author)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Role identifier (e.g., admin, editor, author)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of this role',
      },
    },
    {
      name: 'level',
      type: 'number',
      required: true,
      defaultValue: 1,
      admin: {
        description: 'Role level (1-10, higher number = more permissions)',
      },
      validate: (value: number | number[] | null | undefined) => {
        if (typeof value === 'number' && (value < 1 || value > 10)) {
          return 'Role level must be between 1 and 10'
        }
        return true
      },
    },
    {
      name: 'parentRole',
      type: 'relationship',
      relationTo: 'roles',
      admin: {
        description: 'Parent role for role inheritance (optional)',
      },
    },
    {
      name: 'permissions',
      type: 'relationship',
      relationTo: 'permissions',
      hasMany: true,
      admin: {
        description: 'Permissions assigned to this role',
      },
    },
    {
      name: 'inheritedPermissions',
      type: 'relationship',
      relationTo: 'permissions',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'Permissions inherited from parent role (auto-calculated)',
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
      ],
      defaultValue: 'active',
    },
    {
      name: 'isSystemRole',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'System roles cannot be deleted',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data

        // Auto-generate slug from name if not provided
        if (operation === 'create' && !data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Calculate inherited permissions from parent role
        if (data.parentRole && typeof data.parentRole === 'object' && 'id' in data.parentRole) {
          const parentRole = await req.payload.findByID({
            collection: 'roles',
            id: data.parentRole.id as string,
            depth: 1,
          })

          if (parentRole) {
            // Combine parent permissions with inherited permissions
            const parentPerms = parentRole.permissions || []
            const parentInheritedPerms = parentRole.inheritedPermissions || []
            const allParentPerms = [...parentPerms, ...parentInheritedPerms]

            // Get unique permission IDs
            const uniquePermIds = Array.from(
              new Set(allParentPerms.map((p) => (typeof p === 'object' && 'id' in p ? p.id : p))),
            )

            data.inheritedPermissions = uniquePermIds
          }
        } else {
          // No parent role, clear inherited permissions
          data.inheritedPermissions = []
        }

        return data
      },
    ],
    beforeDelete: [
      ({ id, req }) => {
        // Prevent deletion of system roles
        return req.payload
          .findByID({
            collection: 'roles',
            id: id as string,
          })
          .then((role) => {
            if (role?.isSystemRole) {
              throw new Error('Cannot delete system roles')
            }
          })
      },
    ],
  },
  timestamps: true,
}
