import type { CollectionConfig, Block } from 'payload'
import { checkRole } from '@/utils/check-role'

export const RichTextBlock: Block = {
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
}

export const StatCardBlock: Block = {
  slug: 'statCard',
  labels: {
    singular: 'Stat Card',
    plural: 'Stat Cards',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'dataKey',
      type: 'text',
      admin: { description: 'Key for dynamic data from DataFetch' },
    },
    {
      name: 'staticValue',
      type: 'text',
      admin: { description: 'Static value to display (if no dynamic data)' },
    },
    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name (e.g., "TrendingUp")' } },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Outline', value: 'outline' },
      ],
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
    {
      name: 'trend',
      type: 'group',
      fields: [
        { name: 'value', type: 'number' },
        { name: 'label', type: 'text' },
        {
          name: 'direction',
          type: 'select',
          options: ['up', 'down', 'neutral'],
          defaultValue: 'up',
        },
      ],
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
}

export const FormBlock: Block = {
  slug: 'form',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  fields: [
    // Form Identity
    {
      name: 'formId',
      type: 'text',
      required: true,
      admin: {
        description: 'Unique form identifier (e.g., "contact-form", "user-registration")',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Form title (shown in dialog/page header)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Form description (shown below title)',
      },
    },

    // View Configuration
    {
      name: 'viewType',
      type: 'select',
      required: true,
      defaultValue: 'dialog',
      options: [
        { label: 'Dialog', value: 'dialog' },
        { label: 'Full Page', value: 'page' },
        { label: 'Sidebar Left', value: 'sidebar-left' },
        { label: 'Sidebar Right', value: 'sidebar-right' },
      ],
      admin: {
        description: 'How the form should be displayed',
      },
    },
    {
      name: 'viewSize',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
        { label: 'Full Width', value: 'full' },
      ],
      admin: {
        description: 'Dialog/Page size',
        condition: (data, siblingData) => siblingData?.viewType === 'dialog',
      },
    },
    {
      name: 'viewMode',
      type: 'select',
      defaultValue: 'overlay',
      options: [
        { label: 'Overlay (with backdrop)', value: 'overlay' },
        { label: 'Push (slide content)', value: 'push' },
      ],
      admin: {
        description: 'Sidebar display mode',
        condition: (data, siblingData) =>
          siblingData?.viewType === 'sidebar-left' || siblingData?.viewType === 'sidebar-right',
      },
    },

    // Trigger Button Configuration
    {
      name: 'triggerLabel',
      type: 'text',
      required: true,
      defaultValue: 'Open Form',
      admin: {
        description: 'Button text to open the form',
      },
    },
    {
      name: 'triggerVariant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Link', value: 'link' },
        { label: 'Destructive', value: 'destructive' },
      ],
      admin: {
        description: 'Button style',
      },
    },
    {
      name: 'triggerSize',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Default', value: 'default' },
        { label: 'Large', value: 'lg' },
      ],
      admin: {
        description: 'Button size',
      },
    },

    // Form Fields
    {
      name: 'fields',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Form fields configuration',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Field name (used as form data key)',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Field label (shown to user)',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Password', value: 'password' },
            { label: 'Number', value: 'number' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Select', value: 'select' },
            { label: 'Checkbox', value: 'checkbox' },
            { label: 'Date', value: 'date' },
            { label: 'File', value: 'file' },
          ],
          admin: {
            description: 'Field input type',
          },
        },
        {
          name: 'placeholder',
          type: 'text',
          admin: {
            description: 'Placeholder text',
          },
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Is this field required?',
          },
        },
        {
          name: 'minLength',
          type: 'number',
          admin: {
            description: 'Minimum length (for text fields)',
          },
        },
        {
          name: 'maxLength',
          type: 'number',
          admin: {
            description: 'Maximum length (for text fields)',
          },
        },
        {
          name: 'min',
          type: 'number',
          admin: {
            description: 'Minimum value (for number fields)',
          },
        },
        {
          name: 'max',
          type: 'number',
          admin: {
            description: 'Maximum value (for number fields)',
          },
        },
        {
          name: 'pattern',
          type: 'text',
          admin: {
            description: 'Regex pattern for validation',
          },
        },
        {
          name: 'options',
          type: 'array',
          admin: {
            description: 'Options for select field',
            condition: (data, siblingData) => siblingData?.type === 'select',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            description: 'Default value',
          },
        },
        {
          name: 'helperText',
          type: 'text',
          admin: {
            description: 'Helper text shown below field',
          },
        },
      ],
    },

    // Submit Configuration
    {
      name: 'submission',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'event',
          options: [
            { label: 'Emit Event (Workflow)', value: 'event' },
            { label: 'Direct API Call', value: 'api' },
          ],
          admin: {
            description: 'How to handle form submission',
          },
        },
        {
          name: 'eventName',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'event',
            description: 'Event to emit (e.g., "form.contact.submit")',
            placeholder: 'form.submit',
          },
        },
        {
          name: 'submitEndpoint',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'api',
            description: 'API endpoint to submit form data',
            placeholder: '/api/contact',
          },
        },
        {
          name: 'submitMethod',
          type: 'select',
          defaultValue: 'POST',
          options: [
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'PATCH', value: 'PATCH' },
          ],
          admin: {
            description: 'HTTP method for submission',
          },
        },
      ],
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Submit',
      admin: {
        description: 'Submit button label',
      },
    },
    {
      name: 'cancelLabel',
      type: 'text',
      defaultValue: 'Cancel',
      admin: {
        description: 'Cancel button label',
      },
    },

    // Success/Error Messages
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Form submitted successfully!',
      admin: {
        description: 'Success toast message',
      },
    },
    {
      name: 'errorMessage',
      type: 'text',
      defaultValue: 'An error occurred. Please try again.',
      admin: {
        description: 'Error toast message',
      },
    },
    {
      name: 'redirectUrl',
      type: 'text',
      admin: {
        description: 'Redirect to this URL after successful submission (optional)',
        placeholder: '/thank-you',
      },
    },

    // Advanced Options
    {
      name: 'showProgressIndicator',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show step indicator for multi-step forms',
      },
    },
    {
      name: 'enableAutosave',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Auto-save form data to localStorage',
      },
    },
    {
      name: 'customCss',
      type: 'textarea',
      admin: {
        description: 'Custom CSS classes (space-separated)',
        placeholder: 'max-w-2xl mx-auto',
      },
    },
  ],
}

/**
 * Blocks Collection
 *
 * Reusable, composable content blocks that can be referenced by Pages and Layouts.
 * This solves the problem of content duplication across pages.
 *
 * Architecture:
 * - Block = Reusable content unit (header, hero, table, navigation, etc.)
 * - Page = Composition of Blocks
 * - Blocks can have props (parameters)
 * - Blocks can have slots (injection points)
 *
 * Types:
 * - Global: Site-wide blocks (header, footer, navigation)
 * - Shared: Reusable blocks (hero, pricing, FAQ)
 * - Template: Block templates with props schema
 */
export const Blocks: CollectionConfig = {
  slug: 'blocks',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'category', 'updatedAt'],
    description: 'Reusable content blocks that can be referenced by pages and layouts',
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
        description: 'Block name (e.g., "Hero - Landing", "Main Navigation")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique identifier for referencing (e.g., "hero-landing", "main-nav")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'What this block is for and when to use it',
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
                description: 'Blocks that compose this content',
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
                          blocks: [RichTextBlock, FormBlock, StatCardBlock],
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
                      name: 'sources',
                      type: 'array',
                      required: true,
                      minRows: 1,
                      admin: {
                        description: 'Multiple data sources to fetch from',
                      },
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
                            { label: 'Blocks', value: 'blocks' },
                            { label: 'Pages', value: 'pages' },
                            { label: 'Layouts', value: 'layouts' },
                            { label: 'Users', value: 'users' },
                            { label: 'Media', value: 'media' },
                            { label: 'Roles', value: 'roles' },
                            { label: 'Permissions', value: 'permissions' },
                            { label: 'Themes', value: 'themes' },
                            { label: 'Sites', value: 'sites' },
                            { label: 'Languages', value: 'languages' },
                          ],
                          admin: {
                            condition: (data, siblingData) => siblingData?.type === 'collection',
                          },
                        },
                        {
                          name: 'global',
                          type: 'select',
                          options: [{ label: 'Settings', value: 'settings' }],
                          admin: {
                            condition: (data, siblingData) => siblingData?.type === 'global',
                          },
                        },
                        {
                          name: 'endpoint',
                          type: 'text',
                          admin: {
                            condition: (data, siblingData) => siblingData?.type === 'endpoint',
                            description: 'API endpoint URL',
                          },
                        },
                        {
                          name: 'dataKey',
                          type: 'text',
                          admin: {
                            description:
                              'Optional key to store this source data separately. If not provided, data will be merged with other sources.',
                          },
                        },
                        {
                          name: 'query',
                          type: 'group',
                          fields: [
                            {
                              name: 'limit',
                              type: 'number',
                              admin: {
                                description:
                                  'Limit for this source (overrides global limit if set)',
                              },
                            },
                            {
                              name: 'sort',
                              type: 'text',
                              admin: {
                                description: 'Sort field for this source (e.g., "-createdAt")',
                              },
                            },
                            {
                              name: 'where',
                              type: 'json',
                              admin: {
                                description: 'Query conditions for this source (JSON format)',
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'mergeStrategy',
                      type: 'select',
                      defaultValue: 'union',
                      admin: {
                        description:
                          'How to merge data from multiple sources. "union" combines all results, "separate" stores each source under its dataKey',
                      },
                      options: [
                        { label: 'Union (Combine all results)', value: 'union' },
                        { label: 'Separate (Store each source separately)', value: 'separate' },
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
                      name: 'fetchStats',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description:
                          'Fetch count statistics for tabs (separate from main data query)',
                      },
                    },
                    {
                      name: 'statsConfig',
                      type: 'group',
                      admin: {
                        description: 'Configuration for statistics fetching',
                        condition: (data, siblingData) => siblingData?.fetchStats === true,
                      },
                      fields: [
                        {
                          name: 'statsCollection',
                          type: 'select',
                          admin: {
                            description:
                              'Collection to fetch stats from (defaults to first source collection)',
                          },
                          options: [
                            { label: 'Auto (Use first source)', value: '' },
                            { label: 'Blocks', value: 'blocks' },
                            { label: 'Pages', value: 'pages' },
                            { label: 'Layouts', value: 'layouts' },
                            { label: 'Users', value: 'users' },
                            { label: 'Media', value: 'media' },
                            { label: 'Roles', value: 'roles' },
                            { label: 'Permissions', value: 'permissions' },
                            { label: 'Themes', value: 'themes' },
                            { label: 'Sites', value: 'sites' },
                            { label: 'Languages', value: 'languages' },
                          ],
                        },
                        {
                          name: 'groupBy',
                          type: 'text',
                          required: true,
                          admin: {
                            description:
                              'Field to group by for counting (e.g., "status", "pageStatus", "type")',
                            placeholder: 'status',
                          },
                        },
                        {
                          name: 'statsDataKey',
                          type: 'text',
                          defaultValue: 'stats',
                          admin: {
                            description: 'Key to store stats data in context',
                          },
                        },
                        {
                          name: 'includeValues',
                          type: 'array',
                          admin: {
                            description:
                              'Specific values to count (leave empty to count all unique values automatically)',
                          },
                          fields: [
                            {
                              name: 'value',
                              type: 'text',
                              required: true,
                            },
                          ],
                        },
                        {
                          name: 'autoGenerateTabs',
                          type: 'checkbox',
                          defaultValue: true,
                          admin: {
                            description:
                              'Automatically generate tabs from stats data (if disabled, only show tabs from statusTabsConfig)',
                          },
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
                              defaultValue: 'blocks',
                              options: [
                                { label: 'Blocks', value: 'blocks' },
                                { label: 'Pages', value: 'pages' },
                                { label: 'Layouts', value: 'layouts' },
                                { label: 'Users', value: 'users' },
                                { label: 'Media', value: 'media' },
                                { label: 'Roles', value: 'roles' },
                                { label: 'Permissions', value: 'permissions' },
                                { label: 'Themes', value: 'themes' },
                                { label: 'Sites', value: 'sites' },
                                { label: 'Languages', value: 'languages' },
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
                            {
                              name: 'showStatusTabs',
                              type: 'checkbox',
                              defaultValue: true,
                              admin: {
                                description: 'Show filter tabs with count statistics',
                              },
                            },
                            {
                              name: 'useParentStats',
                              type: 'checkbox',
                              defaultValue: false,
                              admin: {
                                description:
                                  'Use stats from parent DataFetch block (requires fetchStats enabled in parent)',
                                condition: (data, siblingData) =>
                                  siblingData?.showStatusTabs === true &&
                                  siblingData?.useExternalData === true,
                              },
                            },
                            {
                              name: 'statusTabsField',
                              type: 'text',
                              defaultValue: 'status',
                              admin: {
                                description: 'Field name to count and filter by',
                                placeholder: 'status',
                                condition: (data, siblingData) =>
                                  siblingData?.showStatusTabs === true,
                              },
                            },
                            {
                              name: 'statusTabsConfig',
                              type: 'array',
                              admin: {
                                description: 'Define tabs with their values, labels, and styling',
                                condition: (data, siblingData) =>
                                  siblingData?.showStatusTabs === true,
                              },
                              fields: [
                                {
                                  name: 'value',
                                  type: 'text',
                                  required: true,
                                  admin: {
                                    description:
                                      'Value to filter by (e.g., "draft", "published", "active")',
                                  },
                                },
                                {
                                  name: 'label',
                                  type: 'text',
                                  required: true,
                                  admin: {
                                    description: 'Display label for the tab',
                                  },
                                },
                                {
                                  name: 'variant',
                                  type: 'select',
                                  defaultValue: 'default',
                                  options: [
                                    { label: 'Default', value: 'default' },
                                    { label: 'Success (Green)', value: 'success' },
                                    { label: 'Warning (Yellow)', value: 'warning' },
                                    { label: 'Error (Red)', value: 'error' },
                                    { label: 'Info (Blue)', value: 'info' },
                                    { label: 'Secondary', value: 'secondary' },
                                  ],
                                  admin: {
                                    description: 'Badge color variant',
                                  },
                                },
                                {
                                  name: 'icon',
                                  type: 'text',
                                  admin: {
                                    description:
                                      'Optional icon name from lucide-react (e.g., "Check", "Clock", "XCircle")',
                                  },
                                },
                                {
                                  name: 'description',
                                  type: 'textarea',
                                  admin: {
                                    description: 'Optional description for this tab',
                                  },
                                },
                              ],
                            },
                            {
                              name: 'allTabLabel',
                              type: 'text',
                              defaultValue: 'All',
                              admin: {
                                description: 'Label for the "All" tab',
                                condition: (data, siblingData) =>
                                  siblingData?.showStatusTabs === true,
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
                      defaultValue: 'blocks',
                      options: [
                        { label: 'Blocks', value: 'blocks' },
                        { label: 'Pages', value: 'pages' },
                        { label: 'Layouts', value: 'layouts' },
                        { label: 'Users', value: 'users' },
                        { label: 'Media', value: 'media' },
                        { label: 'Roles', value: 'roles' },
                        { label: 'Permissions', value: 'permissions' },
                        { label: 'Themes', value: 'themes' },
                        { label: 'Sites', value: 'sites' },
                        { label: 'Languages', value: 'languages' },
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
                        description: 'Show filter tabs with count statistics',
                      },
                    },
                    {
                      name: 'useParentStats',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description:
                          'Use stats from parent DataFetch block (requires fetchStats enabled in parent)',
                        condition: (data, siblingData) =>
                          siblingData?.showStatusTabs === true &&
                          siblingData?.useExternalData === true,
                      },
                    },
                    {
                      name: 'statusTabsField',
                      type: 'text',
                      defaultValue: 'status',
                      admin: {
                        description: 'Field name to count and filter by',
                        placeholder: 'status',
                        condition: (data, siblingData) => siblingData?.showStatusTabs === true,
                      },
                    },
                    {
                      name: 'statusTabsConfig',
                      type: 'array',
                      admin: {
                        description: 'Define tabs with their values, labels, and styling',
                        condition: (data, siblingData) => siblingData?.showStatusTabs === true,
                      },
                      fields: [
                        {
                          name: 'value',
                          type: 'text',
                          required: true,
                          admin: {
                            description:
                              'Value to filter by (e.g., "draft", "published", "active")',
                          },
                        },
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          admin: {
                            description: 'Display label for the tab',
                          },
                        },
                        {
                          name: 'variant',
                          type: 'select',
                          defaultValue: 'default',
                          options: [
                            { label: 'Default', value: 'default' },
                            { label: 'Success (Green)', value: 'success' },
                            { label: 'Warning (Yellow)', value: 'warning' },
                            { label: 'Error (Red)', value: 'error' },
                            { label: 'Info (Blue)', value: 'info' },
                            { label: 'Secondary', value: 'secondary' },
                          ],
                          admin: {
                            description: 'Badge color variant',
                          },
                        },
                        {
                          name: 'icon',
                          type: 'text',
                          admin: {
                            description:
                              'Optional icon name from lucide-react (e.g., "Check", "Clock", "XCircle")',
                          },
                        },
                        {
                          name: 'description',
                          type: 'textarea',
                          admin: {
                            description: 'Optional description for this tab',
                          },
                        },
                      ],
                    },
                    {
                      name: 'allTabLabel',
                      type: 'text',
                      defaultValue: 'All',
                      admin: {
                        description: 'Label for the "All" tab',
                        condition: (data, siblingData) => siblingData?.showStatusTabs === true,
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
                // ============================================
                // NAVIGATION BLOCK
                // ============================================
                {
                  slug: 'navigation',
                  labels: {
                    singular: 'Navigation',
                    plural: 'Navigations',
                  },
                  fields: [
                    {
                      name: 'navigationId',
                      type: 'text',
                      admin: {
                        description:
                          'Unique ID for this navigation instance (e.g., "main-nav", "sidebar-nav")',
                      },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      admin: {
                        description: 'Navigation title (e.g., "Main Navigation", "Sidebar Menu")',
                      },
                    },
                    {
                      name: 'items',
                      type: 'array',
                      admin: {
                        description: 'Navigation menu items (supports up to 2 levels of nesting)',
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
                            description:
                              'Lucide icon name (e.g., "Home", "Users", "Settings", "ChevronRight")',
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
                            description:
                              'Group label (for visual separation, e.g., "General", "Pages", "Other")',
                          },
                        },
                        {
                          name: 'children',
                          type: 'array',
                          admin: {
                            description: 'Sub-menu items (Level 2) - Up to 3 levels total',
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
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  slug: 'form',
                  labels: {
                    singular: 'Form',
                    plural: 'Forms',
                  },
                  fields: [
                    // Form Identity
                    {
                      name: 'formId',
                      type: 'text',
                      required: true,
                      admin: {
                        description:
                          'Unique form identifier (e.g., "contact-form", "user-registration")',
                      },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Form title (shown in dialog/page header)',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      admin: {
                        description: 'Form description (shown below title)',
                      },
                    },

                    // View Configuration
                    {
                      name: 'viewType',
                      type: 'select',
                      required: true,
                      defaultValue: 'dialog',
                      options: [
                        { label: 'Dialog', value: 'dialog' },
                        { label: 'Full Page', value: 'page' },
                        { label: 'Sidebar Left', value: 'sidebar-left' },
                        { label: 'Sidebar Right', value: 'sidebar-right' },
                      ],
                      admin: {
                        description: 'How the form should be displayed',
                      },
                    },
                    {
                      name: 'viewSize',
                      type: 'select',
                      defaultValue: 'md',
                      options: [
                        { label: 'Small', value: 'sm' },
                        { label: 'Medium', value: 'md' },
                        { label: 'Large', value: 'lg' },
                        { label: 'Extra Large', value: 'xl' },
                        { label: 'Full Width', value: 'full' },
                      ],
                      admin: {
                        description: 'Dialog/Page size',
                        condition: (data, siblingData) => siblingData?.viewType === 'dialog',
                      },
                    },
                    {
                      name: 'viewMode',
                      type: 'select',
                      defaultValue: 'overlay',
                      options: [
                        { label: 'Overlay (with backdrop)', value: 'overlay' },
                        { label: 'Push (slide content)', value: 'push' },
                      ],
                      admin: {
                        description: 'Sidebar display mode',
                        condition: (data, siblingData) =>
                          siblingData?.viewType === 'sidebar-left' ||
                          siblingData?.viewType === 'sidebar-right',
                      },
                    },

                    // Trigger Button Configuration
                    {
                      name: 'triggerLabel',
                      type: 'text',
                      required: true,
                      defaultValue: 'Open Form',
                      admin: {
                        description: 'Button text to open the form',
                      },
                    },
                    {
                      name: 'triggerVariant',
                      type: 'select',
                      defaultValue: 'default',
                      options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Outline', value: 'outline' },
                        { label: 'Ghost', value: 'ghost' },
                        { label: 'Link', value: 'link' },
                        { label: 'Destructive', value: 'destructive' },
                      ],
                      admin: {
                        description: 'Button style',
                      },
                    },
                    {
                      name: 'triggerSize',
                      type: 'select',
                      defaultValue: 'default',
                      options: [
                        { label: 'Small', value: 'sm' },
                        { label: 'Default', value: 'default' },
                        { label: 'Large', value: 'lg' },
                      ],
                      admin: {
                        description: 'Button size',
                      },
                    },

                    // Form Fields
                    {
                      name: 'fields',
                      type: 'array',
                      required: true,
                      minRows: 1,
                      admin: {
                        description: 'Form fields configuration',
                      },
                      fields: [
                        {
                          name: 'name',
                          type: 'text',
                          required: true,
                          admin: {
                            description: 'Field name (used as form data key)',
                          },
                        },
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          admin: {
                            description: 'Field label (shown to user)',
                          },
                        },
                        {
                          name: 'type',
                          type: 'select',
                          required: true,
                          defaultValue: 'text',
                          options: [
                            { label: 'Text', value: 'text' },
                            { label: 'Email', value: 'email' },
                            { label: 'Password', value: 'password' },
                            { label: 'Number', value: 'number' },
                            { label: 'Textarea', value: 'textarea' },
                            { label: 'Select', value: 'select' },
                            { label: 'Checkbox', value: 'checkbox' },
                            { label: 'Date', value: 'date' },
                            { label: 'File', value: 'file' },
                          ],
                          admin: {
                            description: 'Field input type',
                          },
                        },
                        {
                          name: 'placeholder',
                          type: 'text',
                          admin: {
                            description: 'Placeholder text',
                          },
                        },
                        {
                          name: 'required',
                          type: 'checkbox',
                          defaultValue: false,
                          admin: {
                            description: 'Is this field required?',
                          },
                        },
                        {
                          name: 'minLength',
                          type: 'number',
                          admin: {
                            description: 'Minimum length (for text fields)',
                          },
                        },
                        {
                          name: 'maxLength',
                          type: 'number',
                          admin: {
                            description: 'Maximum length (for text fields)',
                          },
                        },
                        {
                          name: 'min',
                          type: 'number',
                          admin: {
                            description: 'Minimum value (for number fields)',
                          },
                        },
                        {
                          name: 'max',
                          type: 'number',
                          admin: {
                            description: 'Maximum value (for number fields)',
                          },
                        },
                        {
                          name: 'pattern',
                          type: 'text',
                          admin: {
                            description: 'Regex pattern for validation',
                          },
                        },
                        {
                          name: 'options',
                          type: 'array',
                          admin: {
                            description: 'Options for select field',
                            condition: (data, siblingData) => siblingData?.type === 'select',
                          },
                          fields: [
                            {
                              name: 'label',
                              type: 'text',
                              required: true,
                            },
                            {
                              name: 'value',
                              type: 'text',
                              required: true,
                            },
                          ],
                        },
                        {
                          name: 'defaultValue',
                          type: 'text',
                          admin: {
                            description: 'Default value',
                          },
                        },
                        {
                          name: 'helperText',
                          type: 'text',
                          admin: {
                            description: 'Helper text shown below field',
                          },
                        },
                      ],
                    },

                    // Submit Configuration
                    {
                      name: 'submission',
                      type: 'group',
                      fields: [
                        {
                          name: 'type',
                          type: 'select',
                          defaultValue: 'event',
                          options: [
                            { label: 'Emit Event (Workflow)', value: 'event' },
                            { label: 'Direct API Call', value: 'api' },
                          ],
                          admin: {
                            description: 'How to handle form submission',
                          },
                        },
                        {
                          name: 'eventName',
                          type: 'text',
                          admin: {
                            condition: (_, siblingData) => siblingData?.type === 'event',
                            description: 'Event to emit (e.g., "form.contact.submit")',
                            placeholder: 'form.submit',
                          },
                        },
                        {
                          name: 'submitEndpoint',
                          type: 'text',
                          admin: {
                            condition: (_, siblingData) => siblingData?.type === 'api',
                            description: 'API endpoint to submit form data',
                            placeholder: '/api/contact',
                          },
                        },
                        {
                          name: 'submitMethod',
                          type: 'select',
                          defaultValue: 'POST',
                          options: [
                            { label: 'POST', value: 'POST' },
                            { label: 'PUT', value: 'PUT' },
                            { label: 'PATCH', value: 'PATCH' },
                          ],
                          admin: {
                            condition: (_, siblingData) => siblingData?.type === 'api',
                            description: 'HTTP method for submission',
                          },
                        },
                      ],
                    },
                    {
                      name: 'submitLabel',
                      type: 'text',
                      defaultValue: 'Submit',
                      admin: {
                        description: 'Submit button label',
                      },
                    },
                    {
                      name: 'cancelLabel',
                      type: 'text',
                      defaultValue: 'Cancel',
                      admin: {
                        description: 'Cancel button label',
                      },
                    },

                    // Success/Error Messages
                    {
                      name: 'successMessage',
                      type: 'text',
                      defaultValue: 'Form submitted successfully!',
                      admin: {
                        description: 'Success toast message',
                      },
                    },
                    {
                      name: 'errorMessage',
                      type: 'text',
                      defaultValue: 'An error occurred. Please try again.',
                      admin: {
                        description: 'Error toast message',
                      },
                    },
                    {
                      name: 'redirectUrl',
                      type: 'text',
                      admin: {
                        description: 'Redirect to this URL after successful submission (optional)',
                        placeholder: '/thank-you',
                      },
                    },

                    // Advanced Options
                    {
                      name: 'showProgressIndicator',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Show step indicator for multi-step forms',
                      },
                    },
                    {
                      name: 'enableAutosave',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Auto-save form data to localStorage',
                      },
                    },
                    {
                      name: 'customCss',
                      type: 'textarea',
                      admin: {
                        description: 'Custom CSS classes (space-separated)',
                        placeholder: 'max-w-2xl mx-auto',
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
          description: 'Define parameters that pages can pass to this block',
          fields: [
            {
              name: 'propsSchema',
              type: 'array',
              admin: {
                description: 'Define props that can be passed when using this block',
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
