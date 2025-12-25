import type { CollectionConfig } from 'payload'
import { hasAnyRoleSync } from '@/utils/check-role'

/**
 * Themes Collection
 * 
 * Centralized theme configurations that can be applied to sites.
 * Each theme defines colors, typography, spacing, and other design tokens.
 */
export const Themes: CollectionConfig = {
  slug: 'themes',
  labels: {
    singular: 'Theme',
    plural: 'Themes',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'mode', 'status', 'updatedAt'],
    group: 'Configuration',
    description: 'Theme configurations for sites',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasAnyRoleSync(user, ['admin'])
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
        description: 'Theme name (e.g., "Dark Professional", "Light Minimal")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "dark-professional")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of this theme',
      },
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'dark',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Auto (System)', value: 'auto' },
      ],
      admin: {
        description: 'Default color mode for this theme',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Colors',
          fields: [
            {
              type: 'collapsible',
              label: 'Primary Colors',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  required: true,
                  defaultValue: '#3b82f6',
                  admin: {
                    description: 'Primary brand color (hex, rgb, or hsl)',
                  },
                },
                {
                  name: 'primaryForeground',
                  type: 'text',
                  defaultValue: '#ffffff',
                  admin: {
                    description: 'Text color on primary background',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Secondary Colors',
              fields: [
                {
                  name: 'secondaryColor',
                  type: 'text',
                  defaultValue: '#6366f1',
                },
                {
                  name: 'secondaryForeground',
                  type: 'text',
                  defaultValue: '#ffffff',
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Background Colors',
              fields: [
                {
                  name: 'backgroundColor',
                  type: 'text',
                  defaultValue: '#ffffff',
                  admin: {
                    description: 'Main background color',
                  },
                },
                {
                  name: 'foregroundColor',
                  type: 'text',
                  defaultValue: '#0a0a0a',
                  admin: {
                    description: 'Main text color',
                  },
                },
                {
                  name: 'mutedColor',
                  type: 'text',
                  defaultValue: '#f1f5f9',
                  admin: {
                    description: 'Muted background color',
                  },
                },
                {
                  name: 'mutedForeground',
                  type: 'text',
                  defaultValue: '#64748b',
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'UI Colors',
              fields: [
                {
                  name: 'borderColor',
                  type: 'text',
                  defaultValue: '#e2e8f0',
                },
                {
                  name: 'inputColor',
                  type: 'text',
                  defaultValue: '#ffffff',
                },
                {
                  name: 'ringColor',
                  type: 'text',
                  defaultValue: '#3b82f6',
                  admin: {
                    description: 'Focus ring color',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Semantic Colors',
              fields: [
                {
                  name: 'successColor',
                  type: 'text',
                  defaultValue: '#10b981',
                },
                {
                  name: 'warningColor',
                  type: 'text',
                  defaultValue: '#f59e0b',
                },
                {
                  name: 'errorColor',
                  type: 'text',
                  defaultValue: '#ef4444',
                },
                {
                  name: 'infoColor',
                  type: 'text',
                  defaultValue: '#3b82f6',
                },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            {
              name: 'fontFamily',
              type: 'group',
              fields: [
                {
                  name: 'sans',
                  type: 'text',
                  defaultValue: 'Inter, system-ui, sans-serif',
                  admin: {
                    description: 'Sans-serif font stack',
                  },
                },
                {
                  name: 'serif',
                  type: 'text',
                  defaultValue: 'Georgia, serif',
                },
                {
                  name: 'mono',
                  type: 'text',
                  defaultValue: 'Menlo, Monaco, monospace',
                },
              ],
            },
            {
              name: 'fontSize',
              type: 'group',
              fields: [
                {
                  name: 'base',
                  type: 'text',
                  defaultValue: '16px',
                  admin: {
                    description: 'Base font size',
                  },
                },
                {
                  name: 'scale',
                  type: 'select',
                  defaultValue: '1.25',
                  options: [
                    { label: 'Minor Third (1.2)', value: '1.2' },
                    { label: 'Major Third (1.25)', value: '1.25' },
                    { label: 'Perfect Fourth (1.333)', value: '1.333' },
                    { label: 'Golden Ratio (1.618)', value: '1.618' },
                  ],
                  admin: {
                    description: 'Type scale ratio',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Spacing',
          fields: [
            {
              name: 'spacing',
              type: 'group',
              fields: [
                {
                  name: 'unit',
                  type: 'select',
                  defaultValue: '4',
                  options: [
                    { label: '4px', value: '4' },
                    { label: '8px', value: '8' },
                    { label: '16px', value: '16' },
                  ],
                  admin: {
                    description: 'Base spacing unit',
                  },
                },
                {
                  name: 'containerMaxWidth',
                  type: 'text',
                  defaultValue: '1280px',
                },
                {
                  name: 'contentMaxWidth',
                  type: 'text',
                  defaultValue: '768px',
                },
              ],
            },
          ],
        },
        {
          label: 'Advanced',
          fields: [
            {
              name: 'borderRadius',
              type: 'group',
              fields: [
                {
                  name: 'sm',
                  type: 'text',
                  defaultValue: '0.25rem',
                },
                {
                  name: 'md',
                  type: 'text',
                  defaultValue: '0.5rem',
                },
                {
                  name: 'lg',
                  type: 'text',
                  defaultValue: '1rem',
                },
              ],
            },
            {
              name: 'shadow',
              type: 'group',
              fields: [
                {
                  name: 'sm',
                  type: 'text',
                  defaultValue: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                },
                {
                  name: 'md',
                  type: 'text',
                  defaultValue: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                },
                {
                  name: 'lg',
                  type: 'text',
                  defaultValue: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                },
              ],
            },
            {
              name: 'customCSS',
              type: 'code',
              admin: {
                language: 'css',
                description: 'Additional custom CSS variables',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Set as default theme for new sites',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

