import type { CollectionConfig } from 'payload'
import { hasAdminRoleSync } from '@/utils/check-role'

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domain', 'status', 'createdAt'],
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
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Main domain (e.g., example.com)',
      },
    },
    {
      name: 'subdomains',
      type: 'array',
      fields: [
        {
          name: 'subdomain',
          type: 'text',
        },
      ],
      admin: {
        description: 'Supported subdomains (e.g., blog.example.com)',
      },
    },
    {
      name: 'defaultLayout',
      type: 'relationship',
      relationTo: 'layouts',
      admin: {
        description: 'Default layout for this site',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'defaultTitle',
          type: 'text',
          admin: {
            description: 'Default SEO title',
          },
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          admin: {
            description: 'Default SEO description',
          },
        },
        {
          name: 'defaultImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'i18n',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable i18n for this site',
          },
        },
        {
          name: 'defaultLanguage',
          type: 'relationship',
          relationTo: 'languages',
          admin: {
            condition: (data) => data.i18n?.enabled === true,
            description: 'Default language for this site',
          },
        },
        {
          name: 'supportedLanguages',
          type: 'relationship',
          relationTo: 'languages',
          hasMany: true,
          admin: {
            condition: (data) => data.i18n?.enabled === true,
            description: 'Supported languages for this site',
          },
        },
        {
          name: 'languageDetection',
          type: 'select',
          options: [
            {
              label: 'Path-based',
              value: 'path',
            },
            {
              label: 'Header-based',
              value: 'header',
            },
            {
              label: 'Cookie-based',
              value: 'cookie',
            },
          ],
          defaultValue: 'path',
          admin: {
            condition: (data) => data.i18n?.enabled === true,
            description: 'Language detection method',
          },
        },
        {
          name: 'pathPrefix',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            condition: (data) => data.i18n?.enabled === true,
            description: 'Use language prefix in URL (e.g., /en/, /th/)',
          },
        },
        {
          name: 'fallbackLanguage',
          type: 'relationship',
          relationTo: 'languages',
          admin: {
            condition: (data) => data.i18n?.enabled === true,
            description: 'Fallback language if translation missing',
          },
        },
      ],
    },
    {
      name: 'theme',
      type: 'relationship',
      relationTo: 'themes',
      required: true,
      admin: {
        description: 'Select theme configuration for this site',
        position: 'sidebar',
      },
    },
    {
      name: 'themeOverrides',
      type: 'group',
      admin: {
        description: 'Override specific theme values for this site (optional)',
      },
      fields: [
        {
          name: 'radius',
          type: 'number',
          defaultValue: 0.625,
          admin: {
            description: 'Border radius base value (rem)',
          },
        },
        {
          name: 'colors',
          type: 'group',
          fields: [
            {
              name: 'background',
              type: 'text',
              admin: {
                description: 'Background color (oklch format)',
              },
            },
            {
              name: 'foreground',
              type: 'text',
              admin: {
                description: 'Text color (oklch format)',
              },
            },
            {
              name: 'card',
              type: 'text',
              admin: {
                description: 'Card background (oklch format)',
              },
            },
            {
              name: 'cardForeground',
              type: 'text',
              admin: {
                description: 'Card text (oklch format)',
              },
            },
            {
              name: 'popover',
              type: 'text',
              admin: {
                description: 'Popover background (oklch format)',
              },
            },
            {
              name: 'popoverForeground',
              type: 'text',
              admin: {
                description: 'Popover text (oklch format)',
              },
            },
            {
              name: 'primary',
              type: 'text',
              admin: {
                description: 'Primary color (oklch format)',
              },
            },
            {
              name: 'primaryForeground',
              type: 'text',
              admin: {
                description: 'Primary text (oklch format)',
              },
            },
            {
              name: 'secondary',
              type: 'text',
              admin: {
                description: 'Secondary color (oklch format)',
              },
            },
            {
              name: 'secondaryForeground',
              type: 'text',
              admin: {
                description: 'Secondary text (oklch format)',
              },
            },
            {
              name: 'muted',
              type: 'text',
              admin: {
                description: 'Muted background (oklch format)',
              },
            },
            {
              name: 'mutedForeground',
              type: 'text',
              admin: {
                description: 'Muted text (oklch format)',
              },
            },
            {
              name: 'accent',
              type: 'text',
              admin: {
                description: 'Accent color (oklch format)',
              },
            },
            {
              name: 'accentForeground',
              type: 'text',
              admin: {
                description: 'Accent text (oklch format)',
              },
            },
            {
              name: 'destructive',
              type: 'text',
              admin: {
                description: 'Destructive color (oklch format)',
              },
            },
            {
              name: 'border',
              type: 'text',
              admin: {
                description: 'Border color (oklch format)',
              },
            },
            {
              name: 'input',
              type: 'text',
              admin: {
                description: 'Input border color (oklch format)',
              },
            },
            {
              name: 'ring',
              type: 'text',
              admin: {
                description: 'Focus ring color (oklch format)',
              },
            },
            {
              name: 'chart1',
              type: 'text',
              admin: {
                description: 'Chart color 1 (oklch format)',
              },
            },
            {
              name: 'chart2',
              type: 'text',
              admin: {
                description: 'Chart color 2 (oklch format)',
              },
            },
            {
              name: 'chart3',
              type: 'text',
              admin: {
                description: 'Chart color 3 (oklch format)',
              },
            },
            {
              name: 'chart4',
              type: 'text',
              admin: {
                description: 'Chart color 4 (oklch format)',
              },
            },
            {
              name: 'chart5',
              type: 'text',
              admin: {
                description: 'Chart color 5 (oklch format)',
              },
            },
            {
              name: 'sidebar',
              type: 'text',
              admin: {
                description: 'Sidebar background (oklch format)',
              },
            },
            {
              name: 'sidebarForeground',
              type: 'text',
              admin: {
                description: 'Sidebar text (oklch format)',
              },
            },
            {
              name: 'sidebarPrimary',
              type: 'text',
              admin: {
                description: 'Sidebar primary (oklch format)',
              },
            },
            {
              name: 'sidebarPrimaryForeground',
              type: 'text',
              admin: {
                description: 'Sidebar primary text (oklch format)',
              },
            },
            {
              name: 'sidebarAccent',
              type: 'text',
              admin: {
                description: 'Sidebar accent (oklch format)',
              },
            },
            {
              name: 'sidebarAccentForeground',
              type: 'text',
              admin: {
                description: 'Sidebar accent text (oklch format)',
              },
            },
            {
              name: 'sidebarBorder',
              type: 'text',
              admin: {
                description: 'Sidebar border (oklch format)',
              },
            },
            {
              name: 'sidebarRing',
              type: 'text',
              admin: {
                description: 'Sidebar ring (oklch format)',
              },
            },
          ],
        },
        {
          name: 'darkMode',
          type: 'group',
          fields: [
            {
              name: 'background',
              type: 'text',
            },
            {
              name: 'foreground',
              type: 'text',
            },
            {
              name: 'card',
              type: 'text',
            },
            {
              name: 'cardForeground',
              type: 'text',
            },
            {
              name: 'popover',
              type: 'text',
            },
            {
              name: 'popoverForeground',
              type: 'text',
            },
            {
              name: 'primary',
              type: 'text',
            },
            {
              name: 'primaryForeground',
              type: 'text',
            },
            {
              name: 'secondary',
              type: 'text',
            },
            {
              name: 'secondaryForeground',
              type: 'text',
            },
            {
              name: 'muted',
              type: 'text',
            },
            {
              name: 'mutedForeground',
              type: 'text',
            },
            {
              name: 'accent',
              type: 'text',
            },
            {
              name: 'accentForeground',
              type: 'text',
            },
            {
              name: 'destructive',
              type: 'text',
            },
            {
              name: 'border',
              type: 'text',
            },
            {
              name: 'input',
              type: 'text',
            },
            {
              name: 'ring',
              type: 'text',
            },
            {
              name: 'chart1',
              type: 'text',
            },
            {
              name: 'chart2',
              type: 'text',
            },
            {
              name: 'chart3',
              type: 'text',
            },
            {
              name: 'chart4',
              type: 'text',
            },
            {
              name: 'chart5',
              type: 'text',
            },
            {
              name: 'sidebar',
              type: 'text',
            },
            {
              name: 'sidebarForeground',
              type: 'text',
            },
            {
              name: 'sidebarPrimary',
              type: 'text',
            },
            {
              name: 'sidebarPrimaryForeground',
              type: 'text',
            },
            {
              name: 'sidebarAccent',
              type: 'text',
            },
            {
              name: 'sidebarAccentForeground',
              type: 'text',
            },
            {
              name: 'sidebarBorder',
              type: 'text',
            },
            {
              name: 'sidebarRing',
              type: 'text',
            },
          ],
        },
        {
          name: 'tailwindConfig',
          type: 'json',
          admin: {
            description: 'Custom Tailwind config overrides',
          },
        },
        {
          name: 'cssVariables',
          type: 'code',
          admin: {
            readOnly: true,
            description: 'Generated CSS variables (auto-generated)',
          },
        },
        {
          name: 'themePreview',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Theme preview screenshot',
          },
        },
      ],
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
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'navigation',
      type: 'relationship',
      relationTo: 'blocks',
      admin: {
        description:
          'Navigation block (should contain a navigation block with menu items)',
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        // Validate domain format
        if (
          data.domain &&
          !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i.test(
            data.domain,
          )
        ) {
          throw new Error('Invalid domain format')
        }

        // Validate i18n settings
        if (data.i18n?.enabled) {
          if (!data.i18n.defaultLanguage) {
            throw new Error('Default language is required when i18n is enabled')
          }
          if (!data.i18n.supportedLanguages || data.i18n.supportedLanguages.length === 0) {
            throw new Error('At least one supported language is required when i18n is enabled')
          }
        }

        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        // Generate CSS variables from theme settings
        // This will be implemented in theme-generator.ts later
        // For now, just return data
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // Clear site cache, regenerate theme CSS
        // This will be implemented later
        return doc
      },
    ],
  },
  timestamps: true,
}
