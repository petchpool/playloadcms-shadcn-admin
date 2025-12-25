import type { CollectionConfig } from 'payload'
import { hasAnyRoleSync, hasAdminRoleSync } from '@/utils/check-role'
import { filterBlocksRecursively } from '@/utils/filter-blocks-by-permissions'

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
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
              },
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
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
              },
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
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
              },
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
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
              },
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
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
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
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
              },
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
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
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
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
              },
            },
          ],
        },
        {
          slug: 'blocksTable',
          labels: {
            singular: 'Blocks Table',
            plural: 'Blocks Tables',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'Optional title for the table',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Optional description for the table',
              },
            },
            {
              name: 'limit',
              type: 'number',
              defaultValue: 10,
              admin: {
                description: 'Number of items per page',
              },
            },
            {
              name: 'collection',
              type: 'select',
              required: true,
              defaultValue: 'components',
              options: [
                {
                  label: 'Components',
                  value: 'components',
                },
                {
                  label: 'Pages',
                  value: 'pages',
                },
                {
                  label: 'Layouts',
                  value: 'layouts',
                },
                {
                  label: 'Sites',
                  value: 'sites',
                },
                {
                  label: 'Users',
                  value: 'users',
                },
                {
                  label: 'Media',
                  value: 'media',
                },
                {
                  label: 'Languages',
                  value: 'languages',
                },
                {
                  label: 'Permissions',
                  value: 'permissions',
                },
                {
                  label: 'Roles',
                  value: 'roles',
                },
              ],
              admin: {
                description: 'Collection to fetch data from',
              },
            },
            {
              name: 'columns',
              type: 'json',
              admin: {
                description: 'Column configuration (array of column keys or JSON config)',
              },
            },
            {
              name: 'searchFields',
              type: 'array',
              admin: {
                description: 'Fields to search in (leave empty to use default search fields)',
              },
              fields: [
                {
                  name: 'field',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Field name to search',
                  },
                },
              ],
            },
            {
              name: 'filterFields',
              type: 'array',
              admin: {
                description: 'Filter fields configuration',
              },
              fields: [
                {
                  name: 'field',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Field name to filter',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Display label for filter',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    {
                      label: 'Select',
                      value: 'select',
                    },
                    {
                      label: 'Text',
                      value: 'text',
                    },
                    {
                      label: 'Date',
                      value: 'date',
                    },
                  ],
                  // Don't set defaultValue for enum fields in PostgreSQL
                  // defaultValue: 'select',
                },
                {
                  name: 'options',
                  type: 'json',
                  admin: {
                    description: 'Options for select type (array of {label, value})',
                  },
                },
              ],
            },
            {
              name: 'populate',
              type: 'group',
              admin: {
                description: 'Populate relationships',
              },
              fields: [
                {
                  name: 'depth',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    description: 'Depth level for populating relationships (0-3)',
                  },
                },
                {
                  name: 'fields',
                  type: 'array',
                  admin: {
                    description:
                      'Specific fields to populate (leave empty to populate all relationships)',
                  },
                  fields: [
                    {
                      name: 'field',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Field name to populate',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'defaultSort',
              type: 'group',
              fields: [
                {
                  name: 'field',
                  type: 'text',
                  defaultValue: 'createdAt',
                  admin: {
                    description: 'Default sort field',
                  },
                },
                {
                  name: 'order',
                  type: 'select',
                  options: [
                    {
                      label: 'Ascending',
                      value: 'asc',
                    },
                    {
                      label: 'Descending',
                      value: 'desc',
                    },
                  ],
                },
              ],
            },
            {
              name: 'urlSettings',
              type: 'group',
              admin: {
                description: 'URL synchronization settings',
              },
              fields: [
                {
                  name: 'syncUrl',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description:
                      'Sync table state (filters, pagination, sorting, column visibility) with browser URL. Allows users to share/bookmark table views.',
                  },
                },
                {
                  name: 'urlGroup',
                  type: 'text',
                  admin: {
                    description:
                      'Unique identifier for this table in URL. Required when multiple tables exist on the same page. Example: "users", "orders"',
                    condition: (data, siblingData) => siblingData?.syncUrl === true,
                  },
                },
              ],
            },
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
              },
            },
          ],
        },
        {
          slug: 'dataFetch',
          labels: {
            singular: 'Data Fetch',
            plural: 'Data Fetches',
          },
          fields: [
            {
              name: 'dataKey',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Unique key to identify this data (e.g., "activeUsers", "totalOrders")',
              },
            },
            {
              name: 'source',
              type: 'group',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Collection', value: 'collection' },
                    { label: 'Global', value: 'global' },
                    { label: 'API Endpoint', value: 'api' },
                  ],
                },
                {
                  name: 'collection',
                  type: 'select',
                  options: [
                    { label: 'Users', value: 'users' },
                    { label: 'Pages', value: 'pages' },
                    { label: 'Components', value: 'components' },
                    { label: 'Media', value: 'media' },
                    { label: 'Sites', value: 'sites' },
                    { label: 'Layouts', value: 'layouts' },
                    { label: 'Languages', value: 'languages' },
                    { label: 'Permissions', value: 'permissions' },
                    { label: 'Roles', value: 'roles' },
                  ],
                  admin: {
                    description: 'Collection to fetch data from',
                    condition: (_, siblingData) => siblingData?.type === 'collection',
                  },
                },
                {
                  name: 'global',
                  type: 'select',
                  options: [{ label: 'Settings', value: 'settings' }],
                  admin: {
                    description: 'Global to fetch data from',
                    condition: (_, siblingData) => siblingData?.type === 'global',
                  },
                },
                {
                  name: 'endpoint',
                  type: 'text',
                  admin: {
                    description: 'API endpoint URL (for custom data sources)',
                    condition: (_, siblingData) => siblingData?.type === 'api',
                  },
                },
              ],
            },
            {
              name: 'query',
              type: 'group',
              admin: {
                description: 'Query configuration for filtering data',
              },
              fields: [
                {
                  name: 'where',
                  type: 'json',
                  admin: {
                    description: 'Filter query (e.g., { "status": { "equals": "active" } })',
                  },
                },
                {
                  name: 'sort',
                  type: 'text',
                  admin: {
                    description: 'Sort field (prefix with - for descending, e.g., "-createdAt")',
                  },
                },
                {
                  name: 'limit',
                  type: 'number',
                  admin: {
                    description: 'Maximum number of items to fetch (0 = no limit)',
                  },
                },
                {
                  name: 'depth',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    description: 'Depth for populating relationships (0-3)',
                  },
                },
              ],
            },
            {
              name: 'transform',
              type: 'group',
              admin: {
                description: 'Transform fetched data (count, sum, average, etc.)',
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  options: [
                    { label: 'None (raw data)', value: 'none' },
                    { label: 'Count', value: 'count' },
                    { label: 'Sum', value: 'sum' },
                    { label: 'Average', value: 'average' },
                    { label: 'First item', value: 'first' },
                    { label: 'Last item', value: 'last' },
                    { label: 'Group By', value: 'groupBy' },
                  ],
                },
                {
                  name: 'field',
                  type: 'text',
                  admin: {
                    description: 'Field to use for sum/average/groupBy',
                    condition: (_, siblingData) =>
                      ['sum', 'average', 'groupBy'].includes(siblingData?.type),
                  },
                },
              ],
            },
            {
              name: 'refreshInterval',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Auto-refresh interval in milliseconds (0 = no refresh)',
              },
            },
            {
              name: 'children',
              type: 'blocks',
              admin: {
                description: 'Child blocks that will receive this data',
              },
              blocks: [
                {
                  slug: 'statCard',
                  labels: {
                    singular: 'Stat Card',
                    plural: 'Stat Cards',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'text',
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      options: [
                        { label: 'Users', value: 'users' },
                        { label: 'Dollar', value: 'dollar' },
                        { label: 'Trending Up', value: 'trending-up' },
                        { label: 'Trending Down', value: 'trending-down' },
                        { label: 'Box', value: 'box' },
                        { label: 'Cart', value: 'cart' },
                        { label: 'File', value: 'file' },
                        { label: 'Image', value: 'image' },
                        { label: 'Settings', value: 'settings' },
                        { label: 'Activity', value: 'activity' },
                        { label: 'Bar Chart', value: 'bar-chart' },
                        { label: 'Pie Chart', value: 'pie-chart' },
                        { label: 'Layers', value: 'layers' },
                        { label: 'Database', value: 'database' },
                        { label: 'Globe', value: 'globe' },
                        { label: 'Mail', value: 'mail' },
                        { label: 'Bell', value: 'bell' },
                        { label: 'Calendar', value: 'calendar' },
                        { label: 'Clock', value: 'clock' },
                        { label: 'Check Circle', value: 'check-circle' },
                        { label: 'X Circle', value: 'x-circle' },
                        { label: 'Alert Circle', value: 'alert-circle' },
                      ],
                    },
                    {
                      name: 'dataKey',
                      type: 'text',
                      admin: {
                        description:
                          'Reference to parent DataFetch key (leave empty to use parent)',
                      },
                    },
                    {
                      name: 'valueField',
                      type: 'text',
                      defaultValue: 'value',
                      admin: {
                        description: 'Path to value in data (e.g., "value", "count", "data.total")',
                      },
                    },
                    {
                      name: 'format',
                      type: 'group',
                      fields: [
                        {
                          name: 'prefix',
                          type: 'text',
                          admin: {
                            description: 'Prefix (e.g., "$", "฿")',
                          },
                        },
                        {
                          name: 'suffix',
                          type: 'text',
                          admin: {
                            description: 'Suffix (e.g., "%", " users")',
                          },
                        },
                        {
                          name: 'decimals',
                          type: 'number',
                          defaultValue: 0,
                          admin: {
                            description: 'Number of decimal places',
                          },
                        },
                      ],
                    },
                    {
                      name: 'trend',
                      type: 'group',
                      admin: {
                        description: 'Trend indicator (optional)',
                      },
                      fields: [
                        {
                          name: 'value',
                          type: 'number',
                          admin: {
                            description: 'Trend percentage (positive or negative)',
                          },
                        },
                        {
                          name: 'label',
                          type: 'text',
                          admin: {
                            description: 'Trend label (e.g., "vs last month")',
                          },
                        },
                        {
                          name: 'invertColors',
                          type: 'checkbox',
                          admin: {
                            description: 'Invert trend colors (positive = bad)',
                          },
                        },
                      ],
                    },
                    {
                      name: 'variant',
                      type: 'select',
                      options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Gradient', value: 'gradient' },
                        { label: 'Outline', value: 'outline' },
                        { label: 'Filled', value: 'filled' },
                      ],
                    },
                    {
                      name: 'size',
                      type: 'select',
                      options: [
                        { label: 'Small', value: 'sm' },
                        { label: 'Medium', value: 'md' },
                        { label: 'Large', value: 'lg' },
                      ],
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
                        { label: '2 Columns', value: '2' },
                        { label: '3 Columns', value: '3' },
                        { label: '4 Columns', value: '4' },
                      ],
                      defaultValue: '4',
                    },
                    {
                      name: 'gap',
                      type: 'select',
                      options: [
                        { label: 'Small', value: 'sm' },
                        { label: 'Medium', value: 'md' },
                        { label: 'Large', value: 'lg' },
                      ],
                      defaultValue: 'md',
                    },
                    {
                      name: 'items',
                      type: 'array',
                      fields: [
                        {
                          name: 'content',
                          type: 'blocks',
                          blocks: [
                            {
                              slug: 'statCard',
                              labels: {
                                singular: 'Stat Card',
                                plural: 'Stat Cards',
                              },
                              fields: [
                                { name: 'title', type: 'text', required: true },
                                { name: 'description', type: 'text' },
                                {
                                  name: 'icon',
                                  type: 'select',
                                  options: [
                                    { label: 'Users', value: 'users' },
                                    { label: 'Dollar', value: 'dollar' },
                                    { label: 'Box', value: 'box' },
                                    { label: 'Cart', value: 'cart' },
                                    { label: 'File', value: 'file' },
                                    { label: 'Activity', value: 'activity' },
                                  ],
                                },
                                { name: 'dataKey', type: 'text' },
                                {
                                  name: 'valueField',
                                  type: 'text',
                                  defaultValue: 'value',
                                },
                                {
                                  name: 'format',
                                  type: 'group',
                                  fields: [
                                    { name: 'prefix', type: 'text' },
                                    { name: 'suffix', type: 'text' },
                                    { name: 'decimals', type: 'number' },
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
                  slug: 'richText',
                  labels: {
                    singular: 'Rich Text',
                    plural: 'Rich Texts',
                  },
                  fields: [
                    {
                      name: 'content',
                      type: 'richText',
                    },
                  ],
                },
                {
                  slug: 'blocksTable',
                  labels: {
                    singular: 'Blocks Table',
                    plural: 'Blocks Tables',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      admin: {
                        description: 'Optional title for the table',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      admin: {
                        description: 'Optional description for the table',
                      },
                    },
                    {
                      name: 'useExternalData',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        description:
                          'Use data from parent DataFetch block instead of fetching internally',
                      },
                    },
                    {
                      name: 'dataKey',
                      type: 'text',
                      admin: {
                        description:
                          'Data key to reference from DataFetch context (defaults to parent dataKey)',
                        condition: (_, siblingData) => siblingData?.useExternalData === true,
                      },
                    },
                    {
                      name: 'collection',
                      type: 'select',
                      options: [
                        { label: 'Users', value: 'users' },
                        { label: 'Pages', value: 'pages' },
                        { label: 'Components', value: 'components' },
                        { label: 'Media', value: 'media' },
                        { label: 'Sites', value: 'sites' },
                        { label: 'Layouts', value: 'layouts' },
                        { label: 'Languages', value: 'languages' },
                        { label: 'Permissions', value: 'permissions' },
                        { label: 'Roles', value: 'roles' },
                      ],
                      admin: {
                        description: 'Collection for column inference (when using external data)',
                      },
                    },
                    {
                      name: 'columns',
                      type: 'json',
                      admin: {
                        description: 'Column configuration (array of column keys or JSON config)',
                      },
                    },
                    {
                      name: 'limit',
                      type: 'number',
                      defaultValue: 10,
                      admin: {
                        description: 'Items per page',
                        condition: (_, siblingData) => siblingData?.useExternalData !== true,
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
              },
            },
          ],
        },
        {
          slug: 'statCard',
          labels: {
            singular: 'Stat Card',
            plural: 'Stat Cards',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Card title (e.g., "Total Users")',
              },
            },
            {
              name: 'description',
              type: 'text',
              admin: {
                description: 'Optional description text',
              },
            },
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Users', value: 'users' },
                { label: 'Dollar', value: 'dollar' },
                { label: 'Trending Up', value: 'trending-up' },
                { label: 'Trending Down', value: 'trending-down' },
                { label: 'Box', value: 'box' },
                { label: 'Cart', value: 'cart' },
                { label: 'File', value: 'file' },
                { label: 'Image', value: 'image' },
                { label: 'Settings', value: 'settings' },
                { label: 'Activity', value: 'activity' },
                { label: 'Bar Chart', value: 'bar-chart' },
                { label: 'Pie Chart', value: 'pie-chart' },
                { label: 'Layers', value: 'layers' },
                { label: 'Database', value: 'database' },
                { label: 'Globe', value: 'globe' },
              ],
              admin: {
                description: 'Icon to display on the card',
              },
            },
            {
              name: 'staticValue',
              type: 'text',
              admin: {
                description: 'Static value to display (use if not using DataFetch)',
              },
            },
            {
              name: 'format',
              type: 'group',
              fields: [
                {
                  name: 'prefix',
                  type: 'text',
                  admin: {
                    description: 'Prefix (e.g., "$", "฿")',
                  },
                },
                {
                  name: 'suffix',
                  type: 'text',
                  admin: {
                    description: 'Suffix (e.g., "%", " users")',
                  },
                },
                {
                  name: 'decimals',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    description: 'Number of decimal places',
                  },
                },
              ],
            },
            {
              name: 'trend',
              type: 'group',
              admin: {
                description: 'Trend indicator (optional)',
              },
              fields: [
                {
                  name: 'value',
                  type: 'number',
                  admin: {
                    description: 'Trend percentage (positive or negative)',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    description: 'Trend label (e.g., "vs last month")',
                  },
                },
                {
                  name: 'invertColors',
                  type: 'checkbox',
                  admin: {
                    description: 'Invert trend colors (positive = bad)',
                  },
                },
              ],
            },
            {
              name: 'variant',
              type: 'select',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Outline', value: 'outline' },
                { label: 'Filled', value: 'filled' },
              ],
              admin: {
                description: 'Card visual style',
              },
            },
            {
              name: 'size',
              type: 'select',
              options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
              ],
              admin: {
                description: 'Card size',
              },
            },
            {
              name: 'requiredPermissions',
              type: 'relationship',
              relationTo: 'permissions',
              hasMany: true,
              admin: {
                description:
                  'Permissions required to view/edit this block (leave empty for public)',
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

        return data
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        // Filter blocks based on user permissions
        if (doc.content && Array.isArray(doc.content)) {
          // Ensure user has permissions populated
          let user = req.user
          if (user && !(user as any).rolePermissions) {
            // Populate user permissions if not already populated
            const userId = typeof user === 'object' && 'id' in user ? user.id : user
            if (userId) {
              const userDoc = await req.payload.findByID({
                collection: 'users',
                id: userId as string,
                depth: 2, // Populate roles and permissions
              })
              if (userDoc) {
                user = userDoc as any
              }
            }
          }

          doc.content = filterBlocksRecursively(doc.content, user)
        }
        return doc
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
