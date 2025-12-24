import type { CollectionConfig } from 'payload'

export const Layouts: CollectionConfig = {
  slug: 'layouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor'))
    },
    update: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor'))
    },
    delete: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('editor'))
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., main-layout, simple-layout)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Main',
          value: 'main',
        },
        {
          label: 'Simple',
          value: 'simple',
        },
        {
          label: 'Auth',
          value: 'auth',
        },
        {
          label: 'Blank',
          value: 'blank',
        },
      ],
      admin: {
        description: 'Layout type based on next-ts patterns',
      },
    },
    {
      name: 'components',
      type: 'blocks',
      blocks: [
        {
          slug: 'header',
          labels: {
            singular: 'Header',
            plural: 'Headers',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'config',
              type: 'json',
              admin: {
                description: 'Header configuration JSON',
              },
            },
          ],
        },
        {
          slug: 'footer',
          labels: {
            singular: 'Footer',
            plural: 'Footers',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'config',
              type: 'json',
              admin: {
                description: 'Footer configuration JSON',
              },
            },
          ],
        },
        {
          slug: 'sidebar',
          labels: {
            singular: 'Sidebar',
            plural: 'Sidebars',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'config',
              type: 'json',
              admin: {
                description: 'Sidebar configuration JSON',
              },
            },
          ],
        },
        {
          slug: 'navigation',
          labels: {
            singular: 'Navigation',
            plural: 'Navigations',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'config',
              type: 'json',
              admin: {
                description: 'Navigation configuration JSON',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'header',
          type: 'group',
          fields: [
            {
              name: 'config',
              type: 'json',
              admin: {
                description: 'Header configuration',
              },
            },
          ],
        },
        {
          name: 'footer',
          type: 'group',
          fields: [
            {
              name: 'config',
              type: 'json',
              admin: {
                description: 'Footer configuration',
              },
            },
          ],
        },
        {
          name: 'sidebar',
          type: 'group',
          fields: [
            {
              name: 'config',
              type: 'json',
              admin: {
                description: 'Sidebar configuration',
              },
            },
          ],
        },
        {
          name: 'themeOverrides',
          type: 'group',
          admin: {
            description: 'Layout-specific theme overrides (optional)',
          },
          fields: [
            {
              name: 'colors',
              type: 'json',
              admin: {
                description: 'Override specific colors for this layout',
              },
            },
            {
              name: 'spacing',
              type: 'json',
              admin: {
                description: 'Override spacing values',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'preview',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Preview image for this layout',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Validate component structure if needed
        // Add validation logic here
        return data
      },
    ],
  },
  timestamps: true,
}

