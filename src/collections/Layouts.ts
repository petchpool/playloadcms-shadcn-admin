import type { CollectionConfig } from 'payload'
import { hasAnyRoleSync } from '@/utils/check-role'

export const Layouts: CollectionConfig = {
  slug: 'layouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasAnyRoleSync(user, ['admin', 'editor'])
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return hasAnyRoleSync(user, ['admin', 'editor'])
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasAnyRoleSync(user, ['admin', 'editor'])
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
              name: 'menu',
              type: 'group',
              fields: [
                {
                  name: 'items',
                  type: 'array',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'path',
                      type: 'text',
                      admin: {
                        description: 'URL path (e.g., /dashboard, /settings)',
                      },
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      admin: {
                        description: 'Icon name or identifier (e.g., home, settings)',
                      },
                    },
                    {
                      name: 'caption',
                      type: 'text',
                      admin: {
                        description: 'Optional caption or description',
                      },
                    },
                    {
                      name: 'disabled',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                    {
                      name: 'external',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'External link (opens in new tab)',
                      },
                    },
                    {
                      name: 'level2Items',
                      type: 'array',
                      admin: {
                        description: 'Sub menu items (Level 2)',
                      },
                      fields: [
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'path',
                          type: 'text',
                        },
                        {
                          name: 'icon',
                          type: 'text',
                        },
                        {
                          name: 'caption',
                          type: 'text',
                        },
                        {
                          name: 'disabled',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'external',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'level3Items',
                          type: 'array',
                          admin: {
                            description: 'Sub menu items (Level 3)',
                          },
                          fields: [
                            {
                              name: 'title',
                              type: 'text',
                              required: true,
                            },
                            {
                              name: 'path',
                              type: 'text',
                            },
                            {
                              name: 'icon',
                              type: 'text',
                            },
                            {
                              name: 'caption',
                              type: 'text',
                            },
                            {
                              name: 'disabled',
                              type: 'checkbox',
                              defaultValue: false,
                            },
                            {
                              name: 'external',
                              type: 'checkbox',
                              defaultValue: false,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'config',
              type: 'json',
              admin: {
                description: 'Sidebar configuration JSON (optional)',
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
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'path',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'text',
                  admin: {
                    description: 'Icon name or identifier',
                  },
                },
              ],
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
        {
          slug: 'component',
          labels: {
            singular: 'Component',
            plural: 'Components',
          },
          fields: [
            {
              name: 'component',
              type: 'relationship',
              relationTo: 'components',
              required: true,
              admin: {
                description: 'Select a reusable component from Components collection',
              },
            },
            {
              name: 'props',
              type: 'json',
              admin: {
                description: 'Component props/configuration (overrides component default props)',
              },
            },
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
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
