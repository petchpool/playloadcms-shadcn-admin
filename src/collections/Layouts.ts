import type { CollectionConfig } from 'payload'
import { hasAnyRoleSync } from '@/utils/check-role'

/**
 * Layouts Collection (Block-based Architecture)
 *
 * Philosophy:
 * - Layouts reference Blocks instead of containing content directly
 * - Layout components (header, footer, sidebar, etc.) are managed as Blocks
 * - Layouts become simple composition layers
 */
export const Layouts: CollectionConfig = {
  slug: 'layouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'status', 'createdAt'],
    description: 'Layout templates composed of block references',
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
      admin: {
        description: 'Layout components - Use Block References for reusable components',
      },
      blocks: [
        // ============================================
        // BLOCK REFERENCE (Primary Method)
        // ============================================
        {
          slug: 'blockRef',
          labels: {
            singular: 'Block Reference',
            plural: 'Block References',
          },
          fields: [
            {
              name: 'block',
              type: 'relationship',
              relationTo: 'blocks',
              required: true,
              admin: {
                description: 'Reference a reusable block (e.g., Header, Footer, Sidebar)',
              },
            },
            {
              name: 'props',
              type: 'json',
              admin: {
                description:
                  'Props to pass to the block (JSON object). Example: { "variant": "dark", "sticky": true }',
              },
            },
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable/disable this component',
              },
            },
            {
              name: 'position',
              type: 'select',
              required: true,
              defaultValue: 'content',
              options: [
                { label: 'Before Content', value: 'before' },
                { label: 'Content Area', value: 'content' },
                { label: 'After Content', value: 'after' },
                { label: 'Header', value: 'header' },
                { label: 'Navigation', value: 'navigation' },
                { label: 'Footer', value: 'footer' },
                { label: 'Sidebar', value: 'sidebar' },
              ],
              admin: {
                description: 'Where this component should be rendered in the layout',
              },
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
