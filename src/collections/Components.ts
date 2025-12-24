import type { CollectionConfig } from 'payload'
import { hasAdminRoleSync } from '@/utils/check-role'

export const Components: CollectionConfig = {
  slug: 'components',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'category', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasAdminRoleSync(user)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return hasAdminRoleSync(user)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasAdminRoleSync(user)
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
