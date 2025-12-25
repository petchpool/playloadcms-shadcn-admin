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
