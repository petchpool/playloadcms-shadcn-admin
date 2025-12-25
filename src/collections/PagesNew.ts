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
        description: 'Page content - Use Section References for complex content',
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
                description: 'Reference a reusable section',
              },
            },
            {
              name: 'props',
              type: 'json',
              admin: {
                description: 'Props to pass to the section (JSON object)',
                placeholder: '{ "title": "Welcome", "theme": "dark" }',
              },
            },
            {
              name: 'slots',
              type: 'array',
              admin: {
                description: 'Fill section slots with custom content',
              },
              fields: [
                {
                  name: 'slotName',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Name of the slot to fill',
                  },
                },
                {
                  name: 'content',
                  type: 'blocks',
                  admin: {
                    description: 'Content to inject into the slot',
                  },
                  blocks: [
                    {
                      slug: 'richText',
                      fields: [
                        {
                          name: 'content',
                          type: 'richText',
                          required: true,
                        },
                      ],
                    },
                    {
                      slug: 'heading',
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'level',
                          type: 'select',
                          defaultValue: 'h2',
                          options: [
                            { label: 'H1', value: 'h1' },
                            { label: 'H2', value: 'h2' },
                            { label: 'H3', value: 'h3' },
                            { label: 'H4', value: 'h4' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'overrides',
              type: 'group',
              admin: {
                description: 'Override section settings',
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
              ],
            },
          ],
        },

        // ============================================
        // 2. RICH TEXT (Local Content)
        // ============================================
        {
          slug: 'richText',
          labels: {
            singular: 'Rich Text',
            plural: 'Rich Texts',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
              admin: {
                description: 'Rich text content',
              },
            },
            {
              name: 'maxWidth',
              type: 'select',
              defaultValue: 'prose',
              options: [
                { label: 'Prose (65ch)', value: 'prose' },
                { label: 'Wide (80ch)', value: 'wide' },
                { label: 'Full', value: 'full' },
              ],
            },
          ],
        },

        // ============================================
        // 3. HEADING (Simple Headers)
        // ============================================
        {
          slug: 'heading',
          labels: {
            singular: 'Heading',
            plural: 'Headings',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'level',
              type: 'select',
              required: true,
              defaultValue: 'h2',
              options: [
                { label: 'H1', value: 'h1' },
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' },
                { label: 'H6', value: 'h6' },
              ],
            },
            {
              name: 'align',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },

        // ============================================
        // 4. GRID (Simple Layout)
        // ============================================
        {
          slug: 'grid',
          labels: {
            singular: 'Grid',
            plural: 'Grids',
          },
          fields: [
            {
              name: 'columns',
              type: 'select',
              required: true,
              defaultValue: '2',
              options: [
                { label: '1 Column', value: '1' },
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
                { label: '4 Columns', value: '4' },
              ],
            },
            {
              name: 'gap',
              type: 'select',
              defaultValue: 'md',
              options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
              ],
            },
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              fields: [
                {
                  name: 'content',
                  type: 'blocks',
                  blocks: [
                    {
                      slug: 'richText',
                      fields: [
                        {
                          name: 'content',
                          type: 'richText',
                          required: true,
                        },
                      ],
                    },
                    {
                      slug: 'heading',
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'level',
                          type: 'select',
                          defaultValue: 'h3',
                          options: [
                            { label: 'H2', value: 'h2' },
                            { label: 'H3', value: 'h3' },
                            { label: 'H4', value: 'h4' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ============================================
        // 5. IMAGE (Simple Image Block)
        // ============================================
        {
          slug: 'image',
          labels: {
            singular: 'Image',
            plural: 'Images',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
              admin: {
                description: 'Alternative text for accessibility',
              },
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'size',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
                { label: 'Full Width', value: 'full' },
              ],
            },
          ],
        },

        // ============================================
        // 6. SPACER (Visual Spacing)
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
        // 7. DIVIDER (Horizontal Line)
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

