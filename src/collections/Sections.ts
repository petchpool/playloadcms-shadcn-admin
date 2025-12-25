import type { CollectionConfig } from 'payload'
import { checkRole } from '@/utils/check-role'

/**
 * Sections Collection
 *
 * Reusable, composable block groups that can be referenced by Pages.
 * This solves the problem of block duplication across pages.
 *
 * Architecture:
 * - Section = Molecule (composed of atomic Blocks)
 * - Page = Organism (composed of Sections)
 * - Sections can have props (parameters)
 * - Sections can have slots (injection points)
 *
 * Types:
 * - Global: Site-wide sections (header, footer)
 * - Shared: Reusable sections (hero, pricing, FAQ)
 * - Template: Section templates with props schema
 */
export const Sections: CollectionConfig = {
  slug: 'sections',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'category', 'updatedAt'],
    description: 'Reusable section compositions that can be referenced by pages',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(user, ['admin', 'editor']),
    update: ({ req: { user } }) => checkRole(user, ['admin', 'editor']),
    delete: ({ req: { user } }) => checkRole(user, ['admin']),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Section name (e.g., "Hero - Landing", "Pricing Table")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique identifier for referencing (e.g., "hero-landing")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'What this section is for and when to use it',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'shared',
      options: [
        {
          label: 'Global',
          value: 'global',
        },
        {
          label: 'Shared',
          value: 'shared',
        },
        {
          label: 'Template',
          value: 'template',
        },
      ],
      admin: {
        description: 'Global = site-wide, Shared = reusable, Template = parameterized',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Header', value: 'header' },
        { label: 'Hero', value: 'hero' },
        { label: 'Content', value: 'content' },
        { label: 'Features', value: 'features' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'CTA', value: 'cta' },
        { label: 'Footer', value: 'footer' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Category for organization',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'blocks',
              type: 'blocks',
              required: true,
              minRows: 1,
              admin: {
                description: 'Blocks that compose this section',
              },
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
                {
                  slug: 'slot',
                  labels: {
                    singular: 'Slot',
                    plural: 'Slots',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Slot identifier (e.g., "actions", "content")',
                      },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      admin: {
                        description: 'Human-readable label',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      admin: {
                        description: 'What should be placed in this slot',
                      },
                    },
                    {
                      name: 'required',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                    {
                      name: 'defaultBlocks',
                      type: 'blocks',
                      admin: {
                        description: 'Default content if slot is not filled',
                      },
                      blocks: [
                        {
                          slug: 'richText',
                          fields: [
                            {
                              name: 'content',
                              type: 'richText',
                            },
                          ],
                        },
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
                      defaultValue: '3',
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
                      fields: [
                        {
                          name: 'content',
                          type: 'blocks',
                          blocks: [
                            {
                              slug: 'richText',
                              fields: [{ name: 'content', type: 'richText' }],
                            },
                          ],
                        },
                      ],
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
                        description: 'Unique key to store fetched data in context',
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
                          defaultValue: 'collection',
                          options: [
                            { label: 'Collection', value: 'collection' },
                            { label: 'Global', value: 'global' },
                            { label: 'API Endpoint', value: 'endpoint' },
                          ],
                        },
                        {
                          name: 'collection',
                          type: 'select',
                          options: [
                            { label: 'Components', value: 'components' },
                            { label: 'Sections', value: 'sections' },
                            { label: 'Pages', value: 'pages' },
                            { label: 'Layouts', value: 'layouts' },
                            { label: 'Users', value: 'users' },
                            { label: 'Media', value: 'media' },
                            { label: 'Roles', value: 'roles' },
                            { label: 'Permissions', value: 'permissions' },
                          ],
                          admin: {
                            condition: (data, siblingData) => siblingData?.type === 'collection',
                          },
                        },
                        {
                          name: 'endpoint',
                          type: 'text',
                          admin: {
                            condition: (data, siblingData) => siblingData?.type === 'endpoint',
                          },
                        },
                      ],
                    },
                    {
                      name: 'query',
                      type: 'group',
                      fields: [
                        {
                          name: 'limit',
                          type: 'number',
                          defaultValue: 10,
                        },
                        {
                          name: 'sort',
                          type: 'text',
                          admin: {
                            description: 'Sort field (e.g., "-createdAt")',
                          },
                        },
                      ],
                    },
                    {
                      name: 'transform',
                      type: 'group',
                      fields: [
                        {
                          name: 'type',
                          type: 'select',
                          defaultValue: 'none',
                          options: [
                            { label: 'None', value: 'none' },
                            { label: 'Count', value: 'count' },
                            { label: 'Sum', value: 'sum' },
                            { label: 'Average', value: 'average' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'children',
                      type: 'blocks',
                      blocks: [
                        {
                          slug: 'blocksTable',
                          labels: {
                            singular: 'Blocks Table',
                            plural: 'Blocks Tables',
                          },
                          fields: [
                            {
                              name: 'useExternalData',
                              type: 'checkbox',
                              defaultValue: false,
                              admin: {
                                description: 'Use data from parent DataFetch',
                              },
                            },
                            {
                              name: 'dataKey',
                              type: 'text',
                              admin: {
                                description: 'Data key from parent DataFetch',
                                condition: (data, siblingData) =>
                                  siblingData?.useExternalData === true,
                              },
                            },
                            {
                              name: 'title',
                              type: 'text',
                            },
                            {
                              name: 'collection',
                              type: 'select',
                              required: true,
                              defaultValue: 'components',
                              options: [
                                { label: 'Components', value: 'components' },
                                { label: 'Sections', value: 'sections' },
                                { label: 'Pages', value: 'pages' },
                                { label: 'Layouts', value: 'layouts' },
                                { label: 'Users', value: 'users' },
                                { label: 'Media', value: 'media' },
                                { label: 'Roles', value: 'roles' },
                                { label: 'Permissions', value: 'permissions' },
                              ],
                            },
                            {
                              name: 'columns',
                              type: 'array',
                              admin: {
                                description: 'Table columns configuration',
                              },
                              fields: [
                                {
                                  name: 'key',
                                  type: 'text',
                                  required: true,
                                  admin: {
                                    description: 'Unique column identifier',
                                  },
                                },
                                {
                                  name: 'label',
                                  type: 'text',
                                  required: true,
                                  admin: {
                                    description: 'Column header label',
                                  },
                                },
                                {
                                  name: 'accessor',
                                  type: 'text',
                                  admin: {
                                    description:
                                      'Custom accessor (template: "{firstName} {lastName}", path: "user.email", or field: "email"). If not provided, uses key.',
                                  },
                                },
                                {
                                  name: 'sortable',
                                  type: 'checkbox',
                                  defaultValue: true,
                                  admin: {
                                    description: 'Enable sorting for this column',
                                  },
                                },
                                {
                                  name: 'type',
                                  type: 'select',
                                  options: [
                                    { label: 'Text', value: 'text' },
                                    { label: 'Number', value: 'number' },
                                    { label: 'Date', value: 'date' },
                                    { label: 'Boolean', value: 'boolean' },
                                    { label: 'Badge', value: 'badge' },
                                    { label: 'Custom', value: 'custom' },
                                  ],
                                  admin: {
                                    description: 'Column display type',
                                  },
                                },
                                {
                                  name: 'width',
                                  type: 'text',
                                  admin: {
                                    description: 'Column width (e.g., "200px", "20%")',
                                  },
                                },
                                {
                                  name: 'blocks',
                                  type: 'blocks',
                                  admin: {
                                    description:
                                      'Custom rendering blocks for this column. Use for complex cell content like avatars, badges, links, etc.',
                                    condition: (data, siblingData) =>
                                      siblingData?.type === 'custom',
                                  },
                                  blocks: [
                                    {
                                      slug: 'badge',
                                      labels: {
                                        singular: 'Badge',
                                        plural: 'Badges',
                                      },
                                      fields: [
                                        {
                                          name: 'field',
                                          type: 'text',
                                          required: true,
                                          admin: {
                                            description: 'Field name to display',
                                          },
                                        },
                                        {
                                          name: 'variant',
                                          type: 'select',
                                          options: [
                                            { label: 'Default', value: 'default' },
                                            { label: 'Success', value: 'success' },
                                            { label: 'Warning', value: 'warning' },
                                            { label: 'Error', value: 'error' },
                                            { label: 'Info', value: 'info' },
                                          ],
                                        },
                                        {
                                          name: 'colorMap',
                                          type: 'json',
                                          admin: {
                                            description:
                                              'Map field values to badge variants. Example: {"active": "success", "inactive": "error"}',
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      slug: 'avatar',
                                      labels: {
                                        singular: 'Avatar',
                                        plural: 'Avatars',
                                      },
                                      fields: [
                                        {
                                          name: 'imageField',
                                          type: 'text',
                                          admin: {
                                            description: 'Field containing image URL',
                                          },
                                        },
                                        {
                                          name: 'nameField',
                                          type: 'text',
                                          admin: {
                                            description: 'Field for fallback initials',
                                          },
                                        },
                                        {
                                          name: 'size',
                                          type: 'select',
                                          defaultValue: 'md',
                                          options: [
                                            { label: 'Small', value: 'sm' },
                                            { label: 'Medium', value: 'md' },
                                            { label: 'Large', value: 'lg' },
                                          ],
                                        },
                                      ],
                                    },
                                    {
                                      slug: 'link',
                                      labels: {
                                        singular: 'Link',
                                        plural: 'Links',
                                      },
                                      fields: [
                                        {
                                          name: 'textField',
                                          type: 'text',
                                          required: true,
                                          admin: {
                                            description: 'Field for link text',
                                          },
                                        },
                                        {
                                          name: 'urlField',
                                          type: 'text',
                                          admin: {
                                            description: 'Field for URL (optional)',
                                          },
                                        },
                                        {
                                          name: 'urlPattern',
                                          type: 'text',
                                          admin: {
                                            description:
                                              'URL pattern template. Example: "/users/{id}"',
                                          },
                                        },
                                        {
                                          name: 'external',
                                          type: 'checkbox',
                                          admin: {
                                            description: 'Open in new tab',
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      slug: 'icon',
                                      labels: {
                                        singular: 'Icon',
                                        plural: 'Icons',
                                      },
                                      fields: [
                                        {
                                          name: 'iconField',
                                          type: 'text',
                                          admin: {
                                            description: 'Field containing icon name',
                                          },
                                        },
                                        {
                                          name: 'iconMap',
                                          type: 'json',
                                          admin: {
                                            description:
                                              'Map field values to icon names. Example: {"user": "UserIcon", "admin": "ShieldIcon"}',
                                          },
                                        },
                                        {
                                          name: 'textField',
                                          type: 'text',
                                          admin: {
                                            description: 'Field for text next to icon',
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      slug: 'text',
                                      labels: {
                                        singular: 'Text',
                                        plural: 'Texts',
                                      },
                                      fields: [
                                        {
                                          name: 'field',
                                          type: 'text',
                                          required: true,
                                          admin: {
                                            description: 'Field name to display',
                                          },
                                        },
                                        {
                                          name: 'template',
                                          type: 'text',
                                          admin: {
                                            description:
                                              'Template string. Example: "{firstName} {lastName}"',
                                          },
                                        },
                                        {
                                          name: 'className',
                                          type: 'text',
                                          admin: {
                                            description: 'CSS classes for styling',
                                          },
                                        },
                                        {
                                          name: 'truncate',
                                          type: 'number',
                                          admin: {
                                            description: 'Max characters before truncating',
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
                                          name: 'urlField',
                                          type: 'text',
                                          required: true,
                                          admin: {
                                            description: 'Field containing image URL',
                                          },
                                        },
                                        {
                                          name: 'altField',
                                          type: 'text',
                                          admin: {
                                            description: 'Field for alt text',
                                          },
                                        },
                                        {
                                          name: 'width',
                                          type: 'number',
                                          defaultValue: 48,
                                        },
                                        {
                                          name: 'height',
                                          type: 'number',
                                          defaultValue: 48,
                                        },
                                        {
                                          name: 'rounded',
                                          type: 'checkbox',
                                          defaultValue: true,
                                        },
                                      ],
                                    },
                                    {
                                      slug: 'group',
                                      labels: {
                                        singular: 'Group',
                                        plural: 'Groups',
                                      },
                                      fields: [
                                        {
                                          name: 'direction',
                                          type: 'select',
                                          defaultValue: 'horizontal',
                                          options: [
                                            { label: 'Horizontal', value: 'horizontal' },
                                            { label: 'Vertical', value: 'vertical' },
                                          ],
                                        },
                                        {
                                          name: 'gap',
                                          type: 'select',
                                          defaultValue: 'sm',
                                          options: [
                                            { label: 'None', value: 'none' },
                                            { label: 'Small', value: 'sm' },
                                            { label: 'Medium', value: 'md' },
                                            { label: 'Large', value: 'lg' },
                                          ],
                                        },
                                        {
                                          name: 'items',
                                          type: 'array',
                                          fields: [
                                            {
                                              name: 'type',
                                              type: 'select',
                                              required: true,
                                              options: [
                                                { label: 'Text', value: 'text' },
                                                { label: 'Badge', value: 'badge' },
                                                { label: 'Avatar', value: 'avatar' },
                                                { label: 'Icon', value: 'icon' },
                                              ],
                                            },
                                            {
                                              name: 'field',
                                              type: 'text',
                                            },
                                            {
                                              name: 'config',
                                              type: 'json',
                                              admin: {
                                                description: 'Configuration for the item',
                                              },
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
                              name: 'searchFields',
                              type: 'array',
                              fields: [
                                {
                                  name: 'field',
                                  type: 'text',
                                  required: true,
                                },
                              ],
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
                            },
                            {
                              name: 'dataKey',
                              type: 'text',
                            },
                            {
                              name: 'icon',
                              type: 'text',
                            },
                            {
                              name: 'format',
                              type: 'select',
                              options: [
                                { label: 'Number', value: 'number' },
                                { label: 'Currency', value: 'currency' },
                                { label: 'Percentage', value: 'percentage' },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  slug: 'table',
                  labels: {
                    singular: 'Data Table',
                    plural: 'Data Tables',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      admin: {
                        description: 'Table title (optional)',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      admin: {
                        description: 'Table description (optional)',
                      },
                    },
                    {
                      name: 'collection',
                      type: 'select',
                      required: true,
                      defaultValue: 'components',
                      options: [
                        { label: 'Components', value: 'components' },
                        { label: 'Sections', value: 'sections' },
                        { label: 'Pages', value: 'pages' },
                        { label: 'Layouts', value: 'layouts' },
                        { label: 'Users', value: 'users' },
                        { label: 'Media', value: 'media' },
                        { label: 'Roles', value: 'roles' },
                        { label: 'Permissions', value: 'permissions' },
                      ],
                      admin: {
                        description: 'Collection to fetch data from',
                      },
                    },
                    {
                      name: 'columns',
                      type: 'json',
                      admin: {
                        description:
                          'Column configuration (JSON array). Leave empty for auto-detection. Example: [{"key":"name","label":"Name"},{"key":"status","label":"Status"}]',
                      },
                    },
                    {
                      name: 'limit',
                      type: 'number',
                      defaultValue: 10,
                      admin: {
                        description: 'Items per page',
                      },
                    },
                    {
                      name: 'searchFields',
                      type: 'array',
                      admin: {
                        description: 'Fields to search in',
                      },
                      fields: [
                        {
                          name: 'field',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'filterFields',
                      type: 'json',
                      admin: {
                        description:
                          'Filter configuration (JSON array). Example: [{"field":"status","label":"Status","type":"select","options":[{"label":"Draft","value":"draft"}]}]',
                      },
                    },
                    {
                      name: 'populate',
                      type: 'group',
                      admin: {
                        description: 'Relationship population settings',
                      },
                      fields: [
                        {
                          name: 'depth',
                          type: 'number',
                          defaultValue: 0,
                          admin: {
                            description: 'Population depth (0 = no population)',
                          },
                        },
                        {
                          name: 'fields',
                          type: 'array',
                          admin: {
                            description: 'Fields to populate',
                          },
                          fields: [
                            {
                              name: 'field',
                              type: 'text',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'select',
                      type: 'text',
                      admin: {
                        description: 'Fields to select (comma-separated)',
                        placeholder: 'name,slug,status,createdAt',
                      },
                    },
                    {
                      name: 'defaultSort',
                      type: 'group',
                      fields: [
                        {
                          name: 'field',
                          type: 'text',
                          admin: {
                            description: 'Field to sort by',
                            placeholder: 'createdAt',
                          },
                        },
                        {
                          name: 'order',
                          type: 'select',
                          options: [
                            { label: 'Ascending', value: 'asc' },
                            { label: 'Descending', value: 'desc' },
                          ],
                          defaultValue: 'desc',
                        },
                      ],
                    },
                    {
                      name: 'showStatusTabs',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        description: 'Show status filter tabs',
                      },
                    },
                    {
                      name: 'statusTabsField',
                      type: 'text',
                      admin: {
                        description: 'Field to use for status tabs (default: status)',
                        placeholder: 'status',
                      },
                    },
                    {
                      name: 'statusTabsConfig',
                      type: 'json',
                      admin: {
                        description:
                          'Status tabs configuration (JSON array). Example: [{"value":"draft","label":"Draft","variant":"default"},{"value":"published","label":"Published","variant":"success"}]',
                      },
                    },
                    {
                      name: 'showActions',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        description: 'Show action buttons (view, edit, delete)',
                      },
                    },
                    {
                      name: 'defaultActions',
                      type: 'json',
                      admin: {
                        description:
                          'Default actions configuration (JSON object). Set to false to disable. Example: {"view":true,"edit":true,"delete":true,"copy":false}',
                      },
                    },
                    {
                      name: 'syncUrl',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Sync table state to URL parameters',
                      },
                    },
                    {
                      name: 'urlGroup',
                      type: 'text',
                      admin: {
                        description:
                          'Group/namespace for URL params (for multiple tables on same page)',
                        placeholder: 'table1',
                      },
                    },
                    {
                      name: 'useExternalData',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description:
                          'Use data from DataFetch context instead of fetching internally',
                      },
                    },
                    {
                      name: 'dataKey',
                      type: 'text',
                      admin: {
                        description:
                          'Data key from DataFetch context (required if useExternalData is true)',
                        placeholder: 'myData',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'slots',
              type: 'array',
              admin: {
                description: 'Define injection points where pages can insert custom content',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Slot name (must match slot block above)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'Props Schema',
          description: 'Define parameters that pages can pass to this section',
          fields: [
            {
              name: 'propsSchema',
              type: 'array',
              admin: {
                description: 'Define props that can be passed when using this section',
              },
              fields: [
                {
                  name: 'key',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Prop key (e.g., "title", "theme")',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Text', value: 'text' },
                    { label: 'Number', value: 'number' },
                    { label: 'Boolean', value: 'boolean' },
                    { label: 'Select', value: 'select' },
                    { label: 'JSON', value: 'json' },
                  ],
                },
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    description: 'Human-readable label',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'required',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'defaultValue',
                  type: 'text',
                  admin: {
                    description: 'Default value if not provided',
                  },
                },
                {
                  name: 'options',
                  type: 'json',
                  admin: {
                    description: 'Options for select type (array of {label, value})',
                    condition: (_, siblingData) => siblingData?.type === 'select',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'tags',
              type: 'array',
              admin: {
                description: 'Tags for organization and search',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                },
              ],
            },
            {
              name: 'version',
              type: 'text',
              admin: {
                description: 'Version number (e.g., "1.0.0")',
              },
            },
            {
              name: 'preview',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Preview screenshot for visual selection',
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
