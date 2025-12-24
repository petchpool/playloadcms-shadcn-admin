import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'site', 'language', 'status', 'publishedAt', 'createdAt'],
  },
  access: {
    read: ({ req: { user }, doc }) => {
      // Published pages are public
      if (doc?.status === 'published') {
        return true
      }
      // Drafts only for authors/admins
      if (user) {
        if (user.roles?.includes('admin') || user.roles?.includes('editor')) {
          return true
        }
        // Authors can read their own drafts
        if (doc?.author && typeof doc.author === 'object' && 'id' in doc.author) {
          return doc.author.id === user.id
        }
      }
      return false
    },
    create: ({ req: { user } }) => {
      return Boolean(
        user?.roles?.includes('admin') ||
          user?.roles?.includes('editor') ||
          user?.roles?.includes('author'),
      )
    },
    update: ({ req: { user }, doc }) => {
      if (user?.roles?.includes('admin') || user?.roles?.includes('editor')) {
        return true
      }
      // Authors can update their own pages
      if (doc?.author && typeof doc.author === 'object' && 'id' in doc.author) {
        return doc.author.id === user?.id
      }
      return false
    },
    delete: ({ req: { user }, doc }) => {
      if (user?.roles?.includes('admin')) {
        return true
      }
      // Authors can delete their own pages
      if (doc?.author && typeof doc.author === 'object' && 'id' in doc.author) {
        return doc.author.id === user?.id
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
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
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
        description: 'Layout to use (if not specified, uses site defaultLayout)',
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
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'draft',
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
        // Set publishedAt when status changes to published
        if (data.status === 'published' && originalDoc?.status !== 'published') {
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
      autosave: true,
    },
    maxPerDoc: 100,
  },
  timestamps: true,
}

