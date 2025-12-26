import { getPayload } from 'payload'
import config from '../payload.config'
import { batchSeed } from './utils/batch-seeder'

/**
 * Seed Pages with Block-based Architecture
 *
 * This seed:
 * 1. Creates content blocks for each page
 * 2. Creates pages that reference these blocks
 *
 * Philosophy: Pages = Composition of Blocks only
 */
export async function seedPagesWithBlocks() {
  const payload = await getPayload({ config })

  console.log('\n📄 Seeding Pages with Blocks...')

  // Helper: Create Lexical content
  const createLexicalContent = (text: string) => {
    const lines = text.split('\n')
    const children: any[] = []

    for (const line of lines) {
      if (line.startsWith('# ')) {
        children.push({
          type: 'heading',
          tag: 'h1',
          children: [{ type: 'text', text: line.substring(2) }],
        })
      } else if (line.startsWith('## ')) {
        children.push({
          type: 'heading',
          tag: 'h2',
          children: [{ type: 'text', text: line.substring(3) }],
        })
      } else if (line.trim()) {
        children.push({
          type: 'paragraph',
          children: [{ type: 'text', text: line }],
        })
      }
    }

    return {
      root: {
        type: 'root',
        children: children.length > 0 ? children : [{ type: 'paragraph', children: [] }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    }
  }

  // ============================================
  // 1. Upsert Content Blocks
  // ============================================
  console.log('  📦 Upserting content blocks...')

  const blockDefinitions = [
    // Home Page Blocks
    {
      slug: 'home-hero',
      name: 'Home Hero Block',
      type: 'shared' as const,
      category: 'hero' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent(
            '# Welcome to PayloadCMS + shadcn/ui\n\nA powerful, flexible content management system with beautiful UI components.',
          ),
        },
      ],
      tags: [{ tag: 'home' }, { tag: 'hero' }],
    },
    {
      slug: 'home-stats',
      name: 'Home Statistics Block',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'dataFetch' as const,
          dataKey: 'totalUsers',
          sources: [
            {
              type: 'collection' as const,
              collection: 'users' as const,
            },
          ],
          transform: {
            type: 'count' as const,
          },
          children: [
            {
              blockType: 'statCard' as const,
              title: 'Total Users',
              dataKey: 'totalUsers',
              icon: 'users',
              format: 'number' as const,
            },
          ],
        },
      ],
      tags: [{ tag: 'home' }, { tag: 'stats' }],
    },
    {
      slug: 'home-features',
      name: 'Home Features Block',
      type: 'shared' as const,
      category: 'features' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent(
            '## Key Features\n\nDiscover what makes our platform powerful.',
          ),
        },
        {
          blockType: 'grid' as const,
          columns: '3' as const,
          gap: 'lg' as const,
          items: [
            {
              content: [
                {
                  blockType: 'richText' as const,
                  content: createLexicalContent(
                    '### Flexible CMS\n\nPowerful content management with PayloadCMS.',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'richText' as const,
                  content: createLexicalContent(
                    '### Beautiful UI\n\nStunning components with shadcn/ui.',
                  ),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'richText' as const,
                  content: createLexicalContent(
                    '### Type Safe\n\nFull TypeScript support throughout.',
                  ),
                },
              ],
            },
          ],
        },
      ],
      tags: [{ tag: 'home' }, { tag: 'features' }],
    },

    // Dashboard Blocks
    {
      slug: 'dashboard-overview',
      name: 'Dashboard Overview',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent(
            '# Dashboard\n\nOverview of your system statistics and data.',
          ),
        },
      ],
      tags: [{ tag: 'dashboard' }],
    },
    {
      slug: 'dashboard-users-table',
      name: 'Dashboard Users Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'dataFetch' as const,
          dataKey: 'users',
          sources: [
            {
              type: 'collection' as const,
              collection: 'users' as const,
            },
          ],
          query: {
            limit: 10,
          },
          fetchStats: true,
          statsConfig: {
            groupBy: 'status',
            statsDataKey: 'userStats',
            includeValues: [{ value: 'active' }, { value: 'inactive' }, { value: 'pending' }],
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'users',
              title: 'Users',
              collection: 'users' as const,
              showStatusTabs: true,
              statusTabsField: 'status',
              statusTabsConfig: [
                {
                  value: 'active' as const,
                  label: 'Active',
                  variant: 'success' as const,
                },
                {
                  value: 'inactive' as const,
                  label: 'Inactive',
                  variant: 'error' as const,
                },
                {
                  value: 'pending' as const,
                  label: 'Pending',
                  variant: 'warning' as const,
                },
              ],
              allTabLabel: 'All Users',
              columns: [
                {
                  key: 'user',
                  label: 'User',
                  sortable: false,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'group' as const,
                      direction: 'vertical' as const,
                      gap: 'sm' as const,
                      items: [
                        {
                          type: 'text' as const,
                          field: 'fullName',
                          config: { template: '{firstName} {lastName}', className: 'font-medium' },
                        },
                        {
                          type: 'text' as const,
                          field: 'email',
                          config: { className: 'text-sm text-muted-foreground' },
                        },
                      ],
                    },
                  ],
                },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'badge' as const,
                      field: 'status',
                      colorMap: {
                        active: 'success',
                        inactive: 'error',
                        pending: 'warning',
                      },
                    },
                  ],
                },
                { key: 'createdAt', label: 'Created', sortable: true, type: 'date' as const },
              ],
              searchFields: [{ field: 'email' }, { field: 'firstName' }, { field: 'lastName' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'dashboard' }, { tag: 'users' }],
    },

    // About Page
    {
      slug: 'about-content',
      name: 'About Page Content',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent(
            '# About Us\n\n## Our Mission\n\nWe build powerful tools for content management.\n\n## Our Values\n\nTransparency, quality, and innovation drive everything we do.',
          ),
        },
      ],
      tags: [{ tag: 'about' }],
    },

    // Contact Page
    {
      slug: 'contact-content',
      name: 'Contact Page Content',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent(
            '# Contact Us\n\nGet in touch with our team.\n\nEmail: hello@example.com\nPhone: +1 234 567 8900',
          ),
        },
      ],
      tags: [{ tag: 'contact' }],
    },

    // Analytics Page
    {
      slug: 'analytics-overview',
      name: 'Analytics Overview',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent(
            '# Analytics\n\nInsights into your system performance and usage.',
          ),
        },
      ],
      tags: [{ tag: 'analytics' }],
    },
    {
      slug: 'analytics-pages-table',
      name: 'Analytics Pages Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Pages'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'pages',
          sources: [
            {
              type: 'collection' as const,
              collection: 'pages' as const,
            },
          ],
          query: {
            limit: 20,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'pages',
              title: 'All Pages',
              collection: 'pages' as const,
              columns: [
                {
                  key: 'title',
                  label: 'Title',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'link' as const,
                      textField: 'title',
                      urlPattern: '/pages/{id}',
                    },
                  ],
                },
                { key: 'slug', label: 'Slug', sortable: true, type: 'text' as const },
                {
                  key: 'pageStatus',
                  label: 'Status',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'badge' as const,
                      field: 'pageStatus',
                      colorMap: {
                        published: 'success',
                        draft: 'warning',
                        archived: 'error',
                      },
                    },
                  ],
                },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' as const },
              ],
              searchFields: [{ field: 'title' }, { field: 'slug' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'pages' }],
    },
    {
      slug: 'analytics-blocks-table',
      name: 'Analytics Blocks Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Blocks'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'blocks',
          sources: [
            {
              type: 'collection' as const,
              collection: 'blocks' as const,
            },
          ],
          query: {
            limit: 50,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'blocks',
              title: 'All Blocks',
              collection: 'blocks' as const,
              columns: [
                {
                  key: 'name',
                  label: 'Name',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'group' as const,
                      direction: 'horizontal' as const,
                      gap: 'sm' as const,
                      items: [
                        {
                          type: 'icon' as const,
                          field: 'type',
                          config: {
                            iconMap: {
                              shared: 'Share2',
                              page: 'FileText',
                              global: 'Globe',
                            },
                          },
                        },
                        {
                          type: 'text' as const,
                          field: 'name',
                        },
                      ],
                    },
                  ],
                },
                { key: 'slug', label: 'Slug', sortable: true, type: 'text' as const },
                { key: 'type', label: 'Type', sortable: true, type: 'badge' as const },
                { key: 'category', label: 'Category', sortable: true, type: 'badge' as const },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'badge' as const,
                      field: 'status',
                      colorMap: {
                        published: 'success',
                        draft: 'warning',
                        archived: 'error',
                      },
                    },
                  ],
                },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' as const },
              ],
              searchFields: [{ field: 'name' }, { field: 'slug' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'blocks' }],
    },
    {
      slug: 'analytics-themes-table',
      name: 'Analytics Themes Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Themes'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'themes',
          sources: [
            {
              type: 'collection' as const,
              collection: 'themes' as const,
            },
          ],
          query: {
            limit: 20,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'themes',
              title: 'All Themes',
              collection: 'themes' as const,
              columns: [
                {
                  key: 'theme',
                  label: 'Theme',
                  sortable: false,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'group' as const,
                      direction: 'vertical' as const,
                      gap: 'sm' as const,
                      items: [
                        {
                          type: 'text' as const,
                          field: 'name',
                          config: { className: 'font-medium' },
                        },
                        {
                          type: 'text' as const,
                          field: 'description',
                          config: { className: 'text-sm text-muted-foreground' },
                        },
                      ],
                    },
                  ],
                },
                { key: 'slug', label: 'Slug', sortable: true, type: 'text' as const },
                {
                  key: 'mode',
                  label: 'Mode',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'badge' as const,
                      field: 'mode',
                      colorMap: {
                        dark: 'default',
                        light: 'secondary',
                      },
                    },
                  ],
                },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'badge' as const,
                      field: 'status',
                      colorMap: {
                        active: 'success',
                        inactive: 'error',
                      },
                    },
                  ],
                },
                { key: 'isDefault', label: 'Default', sortable: true, type: 'boolean' as const },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' as const },
              ],
              searchFields: [{ field: 'name' }, { field: 'slug' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'themes' }],
    },
    {
      slug: 'analytics-sites-table',
      name: 'Analytics Sites Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Sites'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'sites',
          sources: [
            {
              type: 'collection' as const,
              collection: 'sites' as const,
            },
          ],
          query: {
            limit: 20,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'sites',
              title: 'All Sites',
              collection: 'sites' as const,
              columns: [
                { key: 'name', label: 'Name', sortable: true, type: 'text' as const },
                { key: 'domain', label: 'Domain', sortable: true, type: 'text' as const },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'badge' as const,
                      field: 'status',
                      colorMap: {
                        active: 'success',
                        inactive: 'error',
                      },
                    },
                  ],
                },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' as const },
              ],
              searchFields: [{ field: 'name' }, { field: 'domain' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'sites' }],
    },
    {
      slug: 'analytics-languages-table',
      name: 'Analytics Languages Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Languages'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'languages',
          sources: [
            {
              type: 'collection' as const,
              collection: 'languages' as const,
            },
          ],
          query: {
            limit: 20,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'languages',
              title: 'All Languages',
              collection: 'languages' as const,
              columns: [
                {
                  key: 'language',
                  label: 'Language',
                  sortable: false,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'group' as const,
                      direction: 'horizontal' as const,
                      gap: 'md' as const,
                      items: [
                        {
                          type: 'text' as const,
                          field: 'flag',
                          config: { className: 'text-2xl' },
                        },
                        {
                          type: 'text' as const,
                          template: '{name} ({nativeName})',
                        },
                      ],
                    },
                  ],
                },
                { key: 'code', label: 'Code', sortable: true, type: 'text' as const },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'badge' as const,
                      field: 'status',
                      colorMap: {
                        active: 'success',
                        inactive: 'error',
                      },
                    },
                  ],
                },
                { key: 'order', label: 'Order', sortable: true, type: 'number' as const },
              ],
              searchFields: [{ field: 'name' }, { field: 'code' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'languages' }],
    },
    {
      slug: 'analytics-layouts-table',
      name: 'Analytics Layouts Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Layouts'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'layouts',
          sources: [
            {
              type: 'collection' as const,
              collection: 'layouts' as const,
            },
          ],
          query: {
            limit: 20,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'layouts',
              title: 'All Layouts',
              collection: 'layouts' as const,
              columns: [
                { key: 'name', label: 'Name', sortable: true, type: 'text' as const },
                { key: 'slug', label: 'Slug', sortable: true, type: 'text' as const },
                { key: 'type', label: 'Type', sortable: true, type: 'badge' as const },
                { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' as const },
              ],
              searchFields: [{ field: 'name' }, { field: 'slug' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'layouts' }],
    },
    {
      slug: 'analytics-users-table',
      name: 'Analytics Users Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Users & Roles'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'users',
          sources: [
            {
              type: 'collection' as const,
              collection: 'users' as const,
            },
          ],
          query: {
            limit: 20,
          },
          fetchStats: true,
          statsConfig: {
            groupBy: 'status',
            statsDataKey: 'userStats',
            includeValues: [{ value: 'active' }, { value: 'inactive' }, { value: 'pending' }],
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'users',
              title: 'System Users',
              collection: 'users' as const,
              showStatusTabs: true,
              statusTabsField: 'status',
              statusTabsConfig: [
                {
                  value: 'active' as const,
                  label: 'Active',
                  variant: 'success' as const,
                },
                {
                  value: 'inactive' as const,
                  label: 'Inactive',
                  variant: 'error' as const,
                },
                {
                  value: 'pending' as const,
                  label: 'Pending',
                  variant: 'warning' as const,
                },
              ],
              allTabLabel: 'All Users',
              columns: [
                {
                  key: 'user',
                  label: 'User',
                  sortable: false,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'group' as const,
                      direction: 'horizontal' as const,
                      gap: 'md' as const,
                      items: [
                        {
                          type: 'avatar' as const,
                          imageField: 'avatar',
                          nameField: 'firstName',
                          size: 'md' as const,
                        },
                        {
                          type: 'text' as const,
                          template: '{firstName} {lastName}',
                        },
                      ],
                    },
                  ],
                },
                { key: 'email', label: 'Email', sortable: true, type: 'text' as const },
                {
                  key: 'status',
                  label: 'Status',
                  sortable: true,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'badge' as const,
                      field: 'status',
                      colorMap: {
                        active: 'success',
                        inactive: 'error',
                        pending: 'warning',
                      },
                    },
                  ],
                },
                { key: 'createdAt', label: 'Created', sortable: true, type: 'date' as const },
              ],
              searchFields: [{ field: 'email' }, { field: 'firstName' }, { field: 'lastName' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'users' }],
    },
    {
      slug: 'analytics-roles-table',
      name: 'Analytics Roles Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'dataFetch' as const,
          dataKey: 'roles',
          sources: [
            {
              type: 'collection' as const,
              collection: 'roles' as const,
            },
          ],
          query: {
            limit: 20,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'roles',
              title: 'User Roles',
              collection: 'roles' as const,
              columns: [
                { key: 'name', label: 'Role Name', sortable: true, type: 'text' as const },
                { key: 'slug', label: 'Slug', sortable: true, type: 'text' as const },
                { key: 'level', label: 'Level', sortable: true, type: 'number' as const },
                { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
                { key: 'isSystemRole', label: 'System', sortable: true, type: 'boolean' as const },
              ],
              searchFields: [{ field: 'name' }, { field: 'slug' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'roles' }],
    },
    {
      slug: 'analytics-permissions-table',
      name: 'Analytics Permissions Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'dataFetch' as const,
          dataKey: 'permissions',
          sources: [
            {
              type: 'collection' as const,
              collection: 'permissions' as const,
            },
          ],
          query: {
            limit: 50,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'permissions',
              title: 'System Permissions',
              collection: 'permissions' as const,
              columns: [
                { key: 'name', label: 'Permission', sortable: true, type: 'text' as const },
                { key: 'resource', label: 'Resource', sortable: true, type: 'badge' as const },
                { key: 'action', label: 'Action', sortable: true, type: 'badge' as const },
                { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
                {
                  key: 'description',
                  label: 'Description',
                  sortable: false,
                  type: 'text' as const,
                },
              ],
              searchFields: [{ field: 'name' }, { field: 'resource' }, { field: 'action' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'permissions' }],
    },
    {
      slug: 'analytics-media-table',
      name: 'Analytics Media Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Media Library'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'media',
          sources: [
            {
              type: 'collection' as const,
              collection: 'media' as const,
            },
          ],
          query: {
            limit: 30,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'media',
              title: 'Media Files',
              collection: 'media' as const,
              columns: [
                {
                  key: 'preview',
                  label: 'Preview',
                  sortable: false,
                  type: 'custom' as const,
                  blocks: [
                    {
                      blockType: 'group' as const,
                      direction: 'horizontal' as const,
                      gap: 'md' as const,
                      items: [
                        {
                          type: 'avatar' as const,
                          field: 'url',
                          config: { size: 'md', nameField: 'filename' },
                        },
                        {
                          type: 'text' as const,
                          field: 'filename',
                          config: { truncate: 30 },
                        },
                      ],
                    },
                  ],
                },
                { key: 'mimeType', label: 'Type', sortable: true, type: 'badge' as const },
                { key: 'filesize', label: 'Size', sortable: true, type: 'number' as const },
                {
                  key: 'dimensions',
                  label: 'Dimensions',
                  accessor: '{width} × {height}',
                  sortable: false,
                  type: 'text' as const,
                },
                { key: 'createdAt', label: 'Uploaded', sortable: true, type: 'date' as const },
              ],
              searchFields: [{ field: 'filename' }, { field: 'alt' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'media' }],
    },

    // Forms Examples
    {
      slug: 'contact-form',
      name: 'Contact Form',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'form' as const,
          formId: 'contact-form',
          title: 'Contact Us',
          description: 'Send us a message and we will get back to you as soon as possible.',
          viewType: 'dialog' as const,
          viewSize: 'md' as const,
          triggerLabel: 'Open Contact Form',
          triggerVariant: 'default' as const,
          triggerSize: 'default' as const,
          fields: [
            {
              name: 'name',
              label: 'Full Name',
              type: 'text' as const,
              placeholder: 'John Doe',
              required: true,
              minLength: 2,
              helperText: 'Please enter your full name',
            },
            {
              name: 'email',
              label: 'Email Address',
              type: 'email' as const,
              placeholder: 'john@example.com',
              required: true,
              helperText: 'We will respond to this email',
            },
            {
              name: 'subject',
              label: 'Subject',
              type: 'select' as const,
              required: true,
              options: [
                { label: 'General Inquiry', value: 'general' },
                { label: 'Technical Support', value: 'support' },
                { label: 'Sales', value: 'sales' },
                { label: 'Partnership', value: 'partnership' },
              ],
            },
            {
              name: 'message',
              label: 'Message',
              type: 'textarea' as const,
              placeholder: 'Tell us more about your inquiry...',
              required: true,
              minLength: 10,
              maxLength: 1000,
              helperText: 'Maximum 1000 characters',
            },
            {
              name: 'newsletter',
              label: 'Subscribe to our newsletter',
              type: 'checkbox' as const,
              defaultValue: 'false',
            },
          ],
          submitEndpoint: '/api/contact',
          submitMethod: 'POST' as const,
          submitLabel: 'Send Message',
          cancelLabel: 'Cancel',
          successMessage: 'Thank you for contacting us! We will get back to you soon.',
          errorMessage: 'Failed to send message. Please try again.',
        },
      ],
      tags: [{ tag: 'forms' }, { tag: 'contact' }],
    },

    {
      slug: 'user-registration-form',
      name: 'User Registration Form',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'form' as const,
          formId: 'user-registration',
          title: 'Create Your Account',
          description: 'Join our community today! Fill in your details below.',
          viewType: 'page' as const,
          triggerLabel: 'Sign Up Now',
          triggerVariant: 'default' as const,
          triggerSize: 'lg' as const,
          fields: [
            {
              name: 'firstName',
              label: 'First Name',
              type: 'text' as const,
              placeholder: 'John',
              required: true,
              minLength: 2,
            },
            {
              name: 'lastName',
              label: 'Last Name',
              type: 'text' as const,
              placeholder: 'Doe',
              required: true,
              minLength: 2,
            },
            {
              name: 'email',
              label: 'Email Address',
              type: 'email' as const,
              placeholder: 'john@example.com',
              required: true,
              helperText: 'We will never share your email with anyone',
            },
            {
              name: 'password',
              label: 'Password',
              type: 'password' as const,
              required: true,
              minLength: 8,
              helperText: 'Minimum 8 characters',
            },
            {
              name: 'confirmPassword',
              label: 'Confirm Password',
              type: 'password' as const,
              required: true,
              minLength: 8,
            },
            {
              name: 'role',
              label: 'Account Type',
              type: 'select' as const,
              required: true,
              defaultValue: 'user',
              options: [
                { label: 'User', value: 'user' },
                { label: 'Editor', value: 'editor' },
                { label: 'Admin', value: 'admin' },
              ],
            },
            {
              name: 'agreeTerms',
              label: 'I agree to the terms and conditions',
              type: 'checkbox' as const,
              required: true,
            },
          ],
          submitEndpoint: '/api/register',
          submitMethod: 'POST' as const,
          submitLabel: 'Create Account',
          cancelLabel: 'Cancel',
          successMessage: 'Account created successfully! Please check your email to verify.',
          errorMessage: 'Registration failed. Please try again.',
          redirectUrl: '/dashboard',
          enableAutosave: true,
        },
      ],
      tags: [{ tag: 'forms' }, { tag: 'registration' }],
    },

    {
      slug: 'newsletter-subscription-form',
      name: 'Newsletter Subscription Form',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'form' as const,
          formId: 'newsletter-subscription',
          title: 'Subscribe to Newsletter',
          description: 'Get the latest updates and news delivered to your inbox.',
          viewType: 'sidebar-right' as const,
          viewMode: 'overlay' as const,
          triggerLabel: 'Subscribe',
          triggerVariant: 'outline' as const,
          triggerSize: 'sm' as const,
          fields: [
            {
              name: 'email',
              label: 'Email Address',
              type: 'email' as const,
              placeholder: 'your@email.com',
              required: true,
            },
            {
              name: 'frequency',
              label: 'Email Frequency',
              type: 'select' as const,
              required: true,
              defaultValue: 'weekly',
              options: [
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
              ],
              helperText: 'How often would you like to receive emails?',
            },
            {
              name: 'interests',
              label: 'Topics of Interest',
              type: 'select' as const,
              required: false,
              options: [
                { label: 'Technology', value: 'tech' },
                { label: 'Business', value: 'business' },
                { label: 'Design', value: 'design' },
                { label: 'Marketing', value: 'marketing' },
              ],
            },
          ],
          submitEndpoint: '/api/newsletter',
          submitMethod: 'POST' as const,
          submitLabel: 'Subscribe',
          cancelLabel: 'Maybe Later',
          successMessage: 'Successfully subscribed! Check your email to confirm.',
          errorMessage: 'Subscription failed. Please try again.',
        },
      ],
      tags: [{ tag: 'forms' }, { tag: 'newsletter' }],
    },
  ]

  // Batch seed blocks
  const blocksResult = await batchSeed(payload, {
    collection: 'blocks',
    data: blockDefinitions,
    uniqueField: 'slug',
    updateExisting: true,
    batchSize: 10,
  })

  // Create map of slug -> ID for page references
  const createdBlocks: Record<string, string> = {}
  const allBlocks = [...blocksResult.created, ...blocksResult.updated, ...blocksResult.skipped]
  for (const block of allBlocks) {
    if (block && typeof block === 'object' && 'slug' in block && 'id' in block) {
      createdBlocks[block.slug as string] = block.id as string
    }
  }

  // ============================================
  // 2. Upsert Pages with Block References
  // ============================================
  console.log('  📄 Upserting pages...')

  const pagesData = [
    {
      titleEn: 'Home',
      titleTh: 'หน้าแรก',
      slug: 'home',
      order: 1,
      contentBlocks: ['home-hero', 'home-stats', 'home-features'],
    },
    {
      titleEn: 'Dashboard',
      titleTh: 'แดชบอร์ด',
      slug: 'dashboard',
      order: 2,
      contentBlocks: [
        'dashboard-overview',
        'analytics-pages-table',
        'analytics-blocks-table',
        'analytics-themes-table',
        'analytics-sites-table',
        'analytics-languages-table',
        'analytics-layouts-table',
        'dashboard-users-table',
        'analytics-roles-table',
        'analytics-permissions-table',
        'analytics-media-table',
      ],
    },
    {
      titleEn: 'About',
      titleTh: 'เกี่ยวกับเรา',
      slug: 'about',
      order: 3,
      contentBlocks: ['about-content'],
    },
    {
      titleEn: 'Contact',
      titleTh: 'ติดต่อเรา',
      slug: 'contact',
      order: 4,
      contentBlocks: ['contact-content'],
    },
    {
      titleEn: 'Analytics',
      titleTh: 'การวิเคราะห์',
      slug: 'analytics',
      order: 5,
      contentBlocks: [
        'analytics-overview',
        'analytics-pages-table',
        'analytics-blocks-table',
        'analytics-themes-table',
        'analytics-sites-table',
        'analytics-languages-table',
        'analytics-layouts-table',
        'analytics-users-table',
        'analytics-roles-table',
        'analytics-permissions-table',
        'analytics-media-table',
      ],
    },
    {
      titleEn: 'Forms Demo',
      titleTh: 'ตัวอย่างฟอร์ม',
      slug: 'forms-demo',
      order: 6,
      contentBlocks: ['contact-form', 'user-registration-form', 'newsletter-subscription-form'],
    },
  ]

  for (const pageData of pagesData) {
    try {
      // Build content array with block references
      const contentBlocks = pageData.contentBlocks.map((blockSlug, index) => ({
        blockType: 'blockRef',
        block: createdBlocks[blockSlug],
      }))

      // Add spacers between blocks (except last)
      const contentWithSpacers: any[] = []
      contentBlocks.forEach((block, index) => {
        contentWithSpacers.push(block)
        if (index < contentBlocks.length - 1) {
          contentWithSpacers.push({
            blockType: 'spacer',
            height: 'lg',
          })
        }
      })

      // Check if page exists
      const existingPage = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: pageData.slug,
          },
        },
        limit: 1,
        locale: 'en',
        overrideAccess: true,
      })

      let page

      if (existingPage.docs.length > 0) {
        // Update existing page (EN locale)
        page = await payload.update({
          collection: 'pages',
          id: existingPage.docs[0].id,
          data: {
            title: pageData.titleEn,
            slug: pageData.slug,
            pageStatus: 'published',
            content: contentWithSpacers,
            order: pageData.order,
            publishedAt: new Date().toISOString(),
            seo: {
              metaTitle: pageData.titleEn,
              metaDescription: `${pageData.titleEn} page`,
            },
          },
          locale: 'en',
          overrideAccess: true,
        })
        console.log(`    🔄 Updated: ${pageData.titleEn} / ${pageData.titleTh}`)
      } else {
        // Create new page (EN locale)
        page = await payload.create({
          collection: 'pages',
          data: {
            title: pageData.titleEn,
            slug: pageData.slug,
            pageStatus: 'published',
            content: contentWithSpacers,
            order: pageData.order,
            publishedAt: new Date().toISOString(),
            seo: {
              metaTitle: pageData.titleEn,
              metaDescription: `${pageData.titleEn} page`,
            },
          },
          locale: 'en',
          overrideAccess: true,
        })
        console.log(`    ✅ Created: ${pageData.titleEn} / ${pageData.titleTh}`)
      }

      // Update TH locale
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          title: pageData.titleTh,
          slug: pageData.slug,
          content: contentWithSpacers, // Same content structure
          seo: {
            metaTitle: pageData.titleTh,
            metaDescription: `${pageData.titleTh}`,
          },
        },
        locale: 'th',
        overrideAccess: true,
      })
    } catch (error) {
      console.error(`    ❌ Error upserting page "${pageData.titleEn}":`, error)
    }
  }

  console.log('✨ Pages with blocks seeding completed!')
}
