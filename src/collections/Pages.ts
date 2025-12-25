import type { CollectionConfig } from 'payload'
import { hasAnyRoleSync, hasAdminRoleSync } from '@/utils/check-role'
import { filterBlocksRecursively } from '@/utils/filter-blocks-by-permissions'

/**
 * Pages Collection (Simplified - Section-first Architecture)
 *
 * Philosophy:
 * - Pages = Composition of Sections + Minimal local content
 * - Complex blocks live in Sections, not Pages
 * - Pages.content should be short and readable
 *
 * Content blocks (minimal):
 * - sectionRef: Reference to reusable sections
 * - richText: Local rich text content
 * - heading: Simple headings
 * - grid: Basic layout
 *
 * For complex content (dataFetch, statCard, gallery, etc.):
 * → Create a Section and reference it
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'pageStatus', 'publishedAt', 'createdAt'],
    description: 'Pages composed of sections and minimal local content',
  },
  access: {
    read: async ({ req, id }) => {
      if (!id) {
        return Boolean(req.user)
      }

      const page = await req.payload.findByID({
        collection: 'pages',
        id: id as string,
        depth: 0,
        draft: true,
      })

      const pageStatus = (page as any)?._status

      if (pageStatus === 'published') {
        return true
      }

      if (!req.user) return false

      if (hasAnyRoleSync(req.user, ['admin', 'editor'])) {
        return true
      }

      if (page?.author && typeof page.author === 'object' && 'id' in page.author) {
        return page.author.id === req.user.id
      }

      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasAnyRoleSync(user, ['admin', 'editor', 'author'])
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return hasAnyRoleSync(user, ['admin', 'editor', 'author'])
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasAdminRoleSync(user)
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Page title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'URL path (e.g., about, contact-us)',
      },
    },
    {
      name: 'parentPage',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        description: 'Parent page for hierarchical structure',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Page author',
      },
    },
    {
      name: 'pageStatus',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Page status (separate from draft _status)',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      localized: true,
      admin: {
        description:
          'Page content - Primarily use Section References. Create sections in Sections collection for complex content.',
      },
      blocks: [
        // ============================================
        // 1. SECTION REFERENCE (Primary Content Block)
        // ============================================
        {
          slug: 'sectionRef',
          labels: {
            singular: 'Section Reference',
            plural: 'Section References',
          },
          fields: [
            {
              name: 'section',
              type: 'relationship',
              relationTo: 'sections',
              required: true,
              admin: {
                description: 'Reference a reusable section from Sections collection',
              },
            },
            {
              name: 'props',
              type: 'json',
              admin: {
                description:
                  'Props to pass to the section (JSON object). Example: { "title": "Welcome", "theme": "dark" }',
              },
            },
            {
              name: 'overrides',
              type: 'group',
              admin: {
                description: 'Override section settings (optional)',
              },
              fields: [
                {
                  name: 'cssClass',
                  type: 'text',
                  admin: {
                    description: 'Additional CSS classes',
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'select',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Muted', value: 'muted' },
                  ],
                },
                {
                  name: 'spacing',
                  type: 'select',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: 'sm' },
                    { label: 'Medium', value: 'md' },
                    { label: 'Large', value: 'lg' },
                  ],
                },
              ],
            },
          ],
        },

        // ============================================
        // 2. SPACER (Visual Spacing Utility)
        // ============================================
        {
          slug: 'spacer',
          labels: {
            singular: 'Spacer',
            plural: 'Spacers',
          },
          fields: [
            {
              name: 'height',
              type: 'select',
              required: true,
              defaultValue: 'md',
              options: [
                { label: 'Small (1rem)', value: 'sm' },
                { label: 'Medium (2rem)', value: 'md' },
                { label: 'Large (4rem)', value: 'lg' },
                { label: 'Extra Large (6rem)', value: 'xl' },
              ],
            },
          ],
        },

        // ============================================
        // 3. DIVIDER (Horizontal Line Utility)
        // ============================================
        {
          slug: 'divider',
          labels: {
            singular: 'Divider',
            plural: 'Dividers',
          },
          fields: [
            {
              name: 'style',
              type: 'select',
              defaultValue: 'solid',
              options: [
                { label: 'Solid', value: 'solid' },
                { label: 'Dashed', value: 'dashed' },
                { label: 'Dotted', value: 'dotted' },
              ],
            },
            {
              name: 'spacing',
              type: 'select',
              defaultValue: 'md',
              options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
              ],
              admin: {
                description: 'Margin around divider',
              },
            },
          ],
        },
      ],
    },

    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'SEO and meta information',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Meta title (leave empty to use page title)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Meta description for search engines',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Open Graph image for social sharing',
          },
        },
      ],
    },

    // Settings
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Order for navigation menus',
      },
    },
  ],

  // Hooks for permission filtering
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // Filter blocks based on user permissions
        if (doc.content && Array.isArray(doc.content)) {
          doc.content = await filterBlocksRecursively(doc.content, req)
        }
        return doc
      },
    ],
  },

  timestamps: true,
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
