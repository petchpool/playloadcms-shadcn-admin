import type { CollectionConfig } from 'payload'
import { hasAnyRoleSync, hasAdminRoleSync } from '@/utils/check-role'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'language', 'pageStatus', 'publishedAt', 'createdAt'],
  },
  access: {
    read: async ({ req, id }) => {
      // If no id, this is a collection-level check (for admin panel visibility)
      // Allow authenticated users to see the collection
      if (!id) {
        return Boolean(req.user)
      }

      // If id exists, this is a document-level check
      // Fetch page to check status (with draft support)
      const page = await req.payload.findByID({
        collection: 'pages',
        id: id as string,
        depth: 0,
        draft: true, // Include draft versions
      })

      // Check _status (from drafts system) - this is the actual publish status
      const pageStatus = (page as any)?._status

      // Published pages are public
      if (pageStatus === 'published') {
        return true
      }

      // Drafts only for authenticated users
      if (!req.user) return false

      // Admins and editors can read all drafts
      if (hasAnyRoleSync(req.user, ['admin', 'editor'])) {
        return true
      }

      // Authors can read their own drafts
      if (page?.author && typeof page.author === 'object' && 'id' in page.author) {
        return page.author.id === req.user.id
      }

      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasAnyRoleSync(user, ['admin', 'editor', 'author'])
    },
    update: async ({ req, id }) => {
      if (!req.user || !id) return false

      // Fetch page to check author
      const page = await req.payload.findByID({
        collection: 'pages',
        id: id as string,
        depth: 0,
      })

      // Admins and editors can update all pages
      if (hasAnyRoleSync(req.user, ['admin', 'editor'])) {
        return true
      }

      // Authors can update their own pages
      if (page?.author && typeof page.author === 'object' && 'id' in page.author) {
        return page.author.id === req.user.id
      }

      return false
    },
    delete: async ({ req, id }) => {
      if (!req.user || !id) return false

      // Fetch page to check author
      const page = await req.payload.findByID({
        collection: 'pages',
        id: id as string,
        depth: 0,
      })

      // Only admins can delete pages
      if (hasAdminRoleSync(req.user)) {
        return true
      }

      // Authors can delete their own pages
      if (page?.author && typeof page.author === 'object' && 'id' in page.author) {
        return page.author.id === req.user.id
      }

      return false
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
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
      name: 'language',
      type: 'relationship',
      relationTo: 'languages',
      admin: {
        description: 'Language of this page (if i18n enabled)',
      },
    },
    {
      name: 'parentPage',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        description: 'Parent page for hierarchical structure (same language)',
      },
    },
    {
      name: 'layout',
      type: 'relationship',
      relationTo: 'layouts',
      admin: {
        description: 'Layout to use (if not specified, uses site defaultLayout from domain)',
      },
    },
    {
      name: 'pageStatus',
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
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'draft',
      admin: {
        description: 'Page status (separate from draft _status)',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      localized: true,
      blocks: [
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
            },
          ],
        },
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
              name: 'caption',
              type: 'text',
            },
            {
              name: 'alt',
              type: 'text',
            },
          ],
        },
        {
          slug: 'gallery',
          labels: {
            singular: 'Gallery',
            plural: 'Galleries',
          },
          fields: [
            {
              name: 'images',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          slug: 'video',
          labels: {
            singular: 'Video',
            plural: 'Videos',
          },
          fields: [
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'videoUrl',
              type: 'text',
              admin: {
                description: 'YouTube, Vimeo, or other video URL',
              },
            },
            {
              name: 'caption',
              type: 'text',
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
            },
            {
              name: 'props',
              type: 'json',
              admin: {
                description: 'Component props',
              },
            },
          ],
        },
        {
          slug: 'code',
          labels: {
            singular: 'Code Block',
            plural: 'Code Blocks',
          },
          fields: [
            {
              name: 'code',
              type: 'code',
              required: true,
              admin: {
                language: 'typescript',
              },
            },
            {
              name: 'language',
              type: 'select',
              options: [
                { label: 'TypeScript', value: 'typescript' },
                { label: 'JavaScript', value: 'javascript' },
                { label: 'Python', value: 'python' },
                { label: 'Bash', value: 'bash' },
                { label: 'JSON', value: 'json' },
                { label: 'CSS', value: 'css' },
                { label: 'HTML', value: 'html' },
              ],
              defaultValue: 'typescript',
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          slug: 'card',
          labels: {
            singular: 'Card',
            plural: 'Cards',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'Optional link URL',
              },
            },
            {
              name: 'linkText',
              type: 'text',
              admin: {
                description: 'Link button text',
              },
            },
          ],
        },
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
              options: [
                { label: '1 Column', value: '1' },
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
                { label: '4 Columns', value: '4' },
                { label: '6 Columns', value: '6' },
              ],
              defaultValue: '3',
              admin: {
                description: 'Number of columns in the grid',
              },
            },
            {
              name: 'gap',
              type: 'select',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
              ],
              defaultValue: 'md',
              admin: {
                description: 'Gap between grid items',
              },
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
                      labels: {
                        singular: 'Rich Text',
                        plural: 'Rich Texts',
                      },
                      fields: [
                        {
                          name: 'content',
                          type: 'richText',
                          required: true,
                        },
                      ],
                    },
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
                        },
                        {
                          name: 'caption',
                          type: 'text',
                        },
                      ],
                    },
                    {
                      slug: 'card',
                      labels: {
                        singular: 'Card',
                        plural: 'Cards',
                      },
                      fields: [
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'description',
                          type: 'textarea',
                        },
                        {
                          name: 'image',
                          type: 'upload',
                          relationTo: 'media',
                        },
                        {
                          name: 'link',
                          type: 'text',
                        },
                        {
                          name: 'linkText',
                          type: 'text',
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
                        },
                        {
                          name: 'props',
                          type: 'json',
                        },
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
    {
      name: 'seo',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
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
      ],
    },
    {
      name: 'translations',
      type: 'group',
      fields: [
        {
          name: 'translationGroup',
          type: 'text',
          admin: {
            description: 'Group ID for linking translations (auto-generated)',
            readOnly: true,
          },
        },
        {
          name: 'relatedPages',
          type: 'relationship',
          relationTo: 'pages',
          hasMany: true,
          admin: {
            description: 'Related pages in other languages',
          },
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'Auto-set when status changes to published',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    // Categories and Tags collections will be created later
    // {
    //   name: 'categories',
    //   type: 'relationship',
    //   relationTo: 'categories',
    //   hasMany: true,
    // },
    // {
    //   name: 'tags',
    //   type: 'relationship',
    //   relationTo: 'tags',
    //   hasMany: true,
    // },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Order for sorting',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data

        // Auto-generate slug from title if not provided
        if (operation === 'create' && !data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        // Validate language if i18n enabled
        // This will be checked against site settings later
        return data
      },
    ],
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        // Set publishedAt when _status changes to published (from drafts system)
        const currentStatus = (data as any)?._status
        const previousStatus = (originalDoc as any)?._status
        if (currentStatus === 'published' && previousStatus !== 'published') {
          data.publishedAt = new Date()
        }

        // Generate translationGroup if new page
        if (operation === 'create' && !data.translations?.translationGroup) {
          data.translations = data.translations || {}
          data.translations.translationGroup = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Clear page cache, regenerate sitemap
        // This will be implemented later
        return doc
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // Autosave every 100ms when typing
      },
    },
    maxPerDoc: 100,
  },
  timestamps: true,
}
