import type { CollectionConfig } from 'payload'

export const Components: CollectionConfig = {
  slug: 'components',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'category', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('developer'))
    },
    update: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('developer'))
    },
    delete: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('developer'))
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
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Block',
          value: 'block',
        },
        {
          label: 'Section',
          value: 'section',
        },
        {
          label: 'Widget',
          value: 'widget',
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Content',
          value: 'content',
        },
        {
          label: 'Media',
          value: 'media',
        },
        {
          label: 'Form',
          value: 'form',
        },
        {
          label: 'Navigation',
          value: 'navigation',
        },
        {
          label: 'Layout',
          value: 'layout',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'code',
      type: 'code',
      admin: {
        language: 'tsx',
        description: 'Component code (React/TSX) or configuration JSON',
      },
    },
    {
      name: 'props',
      type: 'json',
      admin: {
        description: 'Component props schema',
      },
    },
    {
      name: 'preview',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Preview image for this component',
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
  ],
  timestamps: true,
}
