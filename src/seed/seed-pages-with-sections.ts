import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Seed Pages with Section-based Architecture
 *
 * This seed:
 * 1. Creates content sections for each page
 * 2. Creates pages that reference these sections
 *
 * Philosophy: Pages = Composition of Sections only
 */
export async function seedPagesWithSections() {
  const payload = await getPayload({ config })

  console.log('\n📄 Seeding Pages with Sections...')

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
  // 1. Delete existing pages
  // ============================================
  console.log('  🗑️  Deleting existing pages...')
  const allPages = await payload.find({
    collection: 'pages',
    limit: 1000,
    locale: 'all',
    overrideAccess: true,
  })

  for (const page of allPages.docs) {
    await payload.delete({
      collection: 'pages',
      id: page.id,
      overrideAccess: true,
    })
  }
  console.log(`  ✅ Deleted ${allPages.docs.length} existing pages`)

  // ============================================
  // 2. Delete existing content sections
  // ============================================
  console.log('  🗑️  Deleting existing content sections...')
  const existingSections = await payload.find({
    collection: 'sections',
    where: {
      slug: {
        in: [
          'home-hero',
          'home-stats',
          'home-features',
          'dashboard-overview',
          'dashboard-users-table',
          'about-content',
          'contact-content',
          'analytics-overview',
          'analytics-pages-table',
          'analytics-sections-table',
          'analytics-components-table',
          'analytics-layouts-table',
          'analytics-users-table',
          'analytics-roles-table',
          'analytics-permissions-table',
          'analytics-media-table',
        ],
      },
    },
    limit: 100,
    overrideAccess: true,
  })

  for (const section of existingSections.docs) {
    await payload.delete({
      collection: 'sections',
      id: section.id,
      overrideAccess: true,
    })
  }
  console.log(`  ✅ Deleted ${existingSections.docs.length} existing content sections`)

  // ============================================
  // 3. Create Content Sections
  // ============================================
  console.log('  📦 Creating content sections...')

  const sectionDefinitions = [
    // Home Page Sections
    {
      slug: 'home-hero',
      name: 'Home Hero Section',
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
      name: 'Home Statistics Section',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'dataFetch' as const,
          dataKey: 'totalUsers',
          source: {
            type: 'collection' as const,
            collection: 'users' as const,
          },
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
      name: 'Home Features Section',
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

    // Dashboard Sections
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
          source: {
            type: 'collection' as const,
            collection: 'users' as const,
          },
          query: {
            limit: 10,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'users',
              title: 'Users',
              collection: 'users' as const,
              columns: JSON.stringify([
                { key: 'email', label: 'Email', sortable: true },
                { key: 'name', label: 'Name', sortable: true },
                { key: 'createdAt', label: 'Created', sortable: true, type: 'date' },
              ]),
              searchFields: [{ field: 'email' }, { field: 'name' }],
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
          source: {
            type: 'collection' as const,
            collection: 'pages' as const,
          },
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
              columns: JSON.stringify([
                { key: 'title', label: 'Title', sortable: true },
                { key: 'slug', label: 'Slug', sortable: true },
                { key: 'pageStatus', label: 'Status', sortable: true },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' },
              ]),
              searchFields: [{ field: 'title' }, { field: 'slug' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'pages' }],
    },
    {
      slug: 'analytics-sections-table',
      name: 'Analytics Sections Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Sections'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'sections',
          source: {
            type: 'collection' as const,
            collection: 'sections' as const,
          },
          query: {
            limit: 50,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'sections',
              title: 'All Sections',
              collection: 'sections' as const,
              columns: JSON.stringify([
                { key: 'name', label: 'Name', sortable: true },
                { key: 'slug', label: 'Slug', sortable: true },
                { key: 'type', label: 'Type', sortable: true },
                { key: 'category', label: 'Category', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' },
              ]),
              searchFields: [{ field: 'name' }, { field: 'slug' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'sections' }],
    },
    {
      slug: 'analytics-components-table',
      name: 'Analytics Components Table',
      type: 'shared' as const,
      category: 'content' as const,
      status: 'published' as const,
      blocks: [
        {
          blockType: 'richText' as const,
          content: createLexicalContent('## Components'),
        },
        {
          blockType: 'dataFetch' as const,
          dataKey: 'components',
          source: {
            type: 'collection' as const,
            collection: 'components' as const,
          },
          query: {
            limit: 50,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'components',
              title: 'All Components',
              collection: 'components' as const,
              columns: JSON.stringify([
                { key: 'name', label: 'Name', sortable: true },
                { key: 'slug', label: 'Slug', sortable: true },
                { key: 'type', label: 'Type', sortable: true },
                { key: 'category', label: 'Category', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' },
              ]),
              searchFields: [{ field: 'name' }, { field: 'slug' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'components' }],
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
          source: {
            type: 'collection' as const,
            collection: 'layouts' as const,
          },
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
              columns: JSON.stringify([
                { key: 'name', label: 'Name', sortable: true },
                { key: 'slug', label: 'Slug', sortable: true },
                { key: 'type', label: 'Type', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'updatedAt', label: 'Updated', sortable: true, type: 'date' },
              ]),
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
          source: {
            type: 'collection' as const,
            collection: 'users' as const,
          },
          query: {
            limit: 20,
          },
          children: [
            {
              blockType: 'blocksTable' as const,
              useExternalData: true,
              dataKey: 'users',
              title: 'System Users',
              collection: 'users' as const,
              columns: JSON.stringify([
                { key: 'email', label: 'Email', sortable: true },
                { key: 'firstName', label: 'First Name', sortable: true },
                { key: 'lastName', label: 'Last Name', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'createdAt', label: 'Created', sortable: true, type: 'date' },
              ]),
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
          source: {
            type: 'collection' as const,
            collection: 'roles' as const,
          },
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
              columns: JSON.stringify([
                { key: 'name', label: 'Role Name', sortable: true },
                { key: 'slug', label: 'Slug', sortable: true },
                { key: 'level', label: 'Level', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'isSystemRole', label: 'System', sortable: true, type: 'boolean' },
              ]),
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
          source: {
            type: 'collection' as const,
            collection: 'permissions' as const,
          },
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
              columns: JSON.stringify([
                { key: 'name', label: 'Permission', sortable: true },
                { key: 'resource', label: 'Resource', sortable: true },
                { key: 'action', label: 'Action', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'description', label: 'Description', sortable: false },
              ]),
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
          source: {
            type: 'collection' as const,
            collection: 'media' as const,
          },
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
              columns: JSON.stringify([
                { key: 'filename', label: 'Filename', sortable: true },
                { key: 'mimeType', label: 'Type', sortable: true },
                { key: 'filesize', label: 'Size', sortable: true },
                { key: 'width', label: 'Width', sortable: true },
                { key: 'height', label: 'Height', sortable: true },
                { key: 'createdAt', label: 'Uploaded', sortable: true, type: 'date' },
              ]),
              searchFields: [{ field: 'filename' }, { field: 'alt' }],
            },
          ],
        },
      ],
      tags: [{ tag: 'analytics' }, { tag: 'media' }],
    },
  ]

  const createdSections: Record<string, string> = {}

  for (const sectionData of sectionDefinitions) {
    try {
      const section = await payload.create({
        collection: 'sections',
        data: sectionData,
        overrideAccess: true,
      })

      createdSections[sectionData.slug] = section.id
      console.log(`    ✅ Created section: ${sectionData.name}`)
    } catch (error) {
      console.error(`    ❌ Error creating section "${sectionData.name}":`, error)
    }
  }

  // ============================================
  // 4. Create Pages with Section References
  // ============================================
  console.log('  📄 Creating pages...')

  const pagesData = [
    {
      titleEn: 'Home',
      titleTh: 'หน้าแรก',
      slug: 'home',
      order: 1,
      contentSections: ['home-hero', 'home-stats', 'home-features'],
    },
    {
      titleEn: 'Dashboard',
      titleTh: 'แดชบอร์ด',
      slug: 'dashboard',
      order: 2,
      contentSections: ['dashboard-overview', 'dashboard-users-table'],
    },
    {
      titleEn: 'About',
      titleTh: 'เกี่ยวกับเรา',
      slug: 'about',
      order: 3,
      contentSections: ['about-content'],
    },
    {
      titleEn: 'Contact',
      titleTh: 'ติดต่อเรา',
      slug: 'contact',
      order: 4,
      contentSections: ['contact-content'],
    },
    {
      titleEn: 'Analytics',
      titleTh: 'การวิเคราะห์',
      slug: 'analytics',
      order: 5,
      contentSections: [
        'analytics-overview',
        'analytics-pages-table',
        'analytics-sections-table',
        'analytics-components-table',
        'analytics-layouts-table',
        'analytics-users-table',
        'analytics-roles-table',
        'analytics-permissions-table',
        'analytics-media-table',
      ],
    },
  ]

  for (const pageData of pagesData) {
    try {
      // Build content array with section references
      const contentBlocks = pageData.contentSections.map((sectionSlug, index) => ({
        blockType: 'sectionRef',
        section: createdSections[sectionSlug],
      }))

      // Add spacers between sections (except last)
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

      // Create page with EN locale first
      const page = await payload.create({
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

      console.log(`    ✅ Created: ${pageData.titleEn} / ${pageData.titleTh}`)
    } catch (error) {
      console.error(`    ❌ Error creating page "${pageData.titleEn}":`, error)
    }
  }

  console.log('✨ Pages with sections seeding completed!')
}
