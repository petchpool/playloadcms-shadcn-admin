import type { CollectionConfig } from 'payload'
import { hasAnyRoleSync } from '@/utils/check-role'

/**
 * Navigation Collection
 * 
 * Manage navigation menus and menu items for the application.
 * Supports nested menu items (up to 2 levels).
 */
export const Navigation: CollectionConfig = {
  slug: 'navigation',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'location', 'status', 'updatedAt'],
    description: 'Manage navigation menus and menu items',
    group: 'Configuration',
  },
  access: {
    read: () => true, // Public read access
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
      return hasAnyRoleSync(user, ['admin'])
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Navigation name (e.g., "Main Navigation", "Footer Menu")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique identifier (e.g., "main-nav", "footer-menu")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description for this navigation',
      },
    },
    {
      name: 'location',
      type: 'select',
      required: true,
      options: [
        { label: 'Main Navigation', value: 'main' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Top Bar', value: 'topbar' },
        { label: 'Footer', value: 'footer' },
        { label: 'Mobile Menu', value: 'mobile' },
        { label: 'Dashboard', value: 'dashboard' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Where this navigation should appear',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Navigation menu items (supports 2 levels of nesting)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Menu item title',
          },
        },
        {
          name: 'path',
          type: 'text',
          admin: {
            description: 'Link path (e.g., "/dashboard", "/users")',
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (e.g., "Home", "Users", "Settings")',
          },
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption/badge text (e.g., "New", "Beta")',
          },
        },
        {
          name: 'disabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Disable this menu item',
          },
        },
        {
          name: 'external',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open link in new tab (for external links)',
          },
        },
        {
          name: 'groupLabel',
          type: 'text',
          admin: {
            description: 'Group label for visual separation (e.g., "General", "Settings")',
          },
        },
        {
          name: 'order',
          type: 'number',
          admin: {
            description: 'Display order (lower numbers appear first)',
          },
        },
        {
          name: 'children',
          type: 'array',
          admin: {
            description: 'Sub-menu items (Level 2)',
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
              name: 'order',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        description: 'Navigation status',
      },
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      admin: {
        description: 'Assign this navigation to a specific site (optional)',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            if (operation === 'create' && !value) {
              return req.user?.id
            }
            return value
          },
        ],
      },
    },
  ],
  timestamps: true,
}

