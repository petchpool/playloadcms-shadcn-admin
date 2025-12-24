import type { CollectionConfig } from 'payload'

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'resource', 'action', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: async ({ req: { user } }) => {
      if (!user) return false
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
        description: 'Permission display name (e.g., Create Pages, Update Sites)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Permission identifier (e.g., pages.create, sites.update)',
      },
    },
    {
      name: 'resource',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Pages',
          value: 'pages',
        },
        {
          label: 'Sites',
          value: 'sites',
        },
        {
          label: 'Layouts',
          value: 'layouts',
        },
        {
          label: 'Components',
          value: 'components',
        },
        {
          label: 'Languages',
          value: 'languages',
        },
        {
          label: 'Users',
          value: 'users',
        },
        {
          label: 'Roles',
          value: 'roles',
        },
        {
          label: 'Permissions',
          value: 'permissions',
        },
        {
          label: 'Media',
          value: 'media',
        },
        {
          label: 'All',
          value: 'all',
        },
      ],
      admin: {
        description: 'Resource this permission applies to',
      },
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Create',
          value: 'create',
        },
        {
          label: 'Read',
          value: 'read',
        },
        {
          label: 'Update',
          value: 'update',
        },
        {
          label: 'Delete',
          value: 'delete',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'All',
          value: 'all',
        },
      ],
      admin: {
        description: 'Action this permission allows',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of what this permission allows',
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
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Auto-generate slug from resource and action if not provided
        if (operation === 'create' && !data.slug && data.resource && data.action) {
          data.slug = `${data.resource}.${data.action}`
        }
        return data
      },
    ],
  },
  timestamps: true,
}

