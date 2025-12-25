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
        direction: 'ltr',
        format: '',
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
  // 2. Create Content Sections
  // ============================================
  console.log('  📦 Creating content sections...')

  const sectionDefinitions = [
    // Home Page Sections
    {
      slug: 'home-hero',
      name: 'Home Hero Section',
      type: 'shared',
      category: 'hero',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'dataFetch',
          dataKey: 'totalUsers',
          source: {
            type: 'collection',
            collection: 'users',
          },
          transform: {
            type: 'count',
          },
          children: [
            {
              blockType: 'statCard',
              title: 'Total Users',
              dataKey: 'totalUsers',
              icon: 'users',
              format: 'number',
            },
          ],
        },
      ],
      tags: [{ tag: 'home' }, { tag: 'stats' }],
    },
    {
      slug: 'home-features',
      name: 'Home Features Section',
      type: 'shared',
      category: 'features',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
          content: createLexicalContent(
            '## Key Features\n\nDiscover what makes our platform powerful.',
          ),
        },
        {
          blockType: 'grid',
          columns: '3',
          gap: 'lg',
          items: [
            {
              content: [
                {
                  blockType: 'heading',
                  text: 'Flexible CMS',
                  level: 'h3',
                },
                {
                  blockType: 'richText',
                  content: createLexicalContent('Powerful content management with PayloadCMS.'),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'heading',
                  text: 'Beautiful UI',
                  level: 'h3',
                },
                {
                  blockType: 'richText',
                  content: createLexicalContent('Stunning components with shadcn/ui.'),
                },
              ],
            },
            {
              content: [
                {
                  blockType: 'heading',
                  text: 'Type Safe',
                  level: 'h3',
                },
                {
                  blockType: 'richText',
                  content: createLexicalContent('Full TypeScript support throughout.'),
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'dataFetch',
          dataKey: 'users',
          source: {
            type: 'collection',
            collection: 'users',
          },
          query: {
            limit: 10,
          },
          children: [
            {
              blockType: 'blocksTable',
              useExternalData: true,
              dataKey: 'users',
              title: 'Users',
              collection: 'users',
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
          content: createLexicalContent('## Pages'),
        },
        {
          blockType: 'dataFetch',
          dataKey: 'pages',
          source: {
            type: 'collection',
            collection: 'pages',
          },
          query: {
            limit: 20,
          },
          children: [
            {
              blockType: 'blocksTable',
              useExternalData: true,
              dataKey: 'pages',
              title: 'All Pages',
              collection: 'pages',
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
          content: createLexicalContent('## Sections'),
        },
        {
          blockType: 'dataFetch',
          dataKey: 'sections',
          source: {
            type: 'collection',
            collection: 'sections',
          },
          query: {
            limit: 50,
          },
          children: [
            {
              blockType: 'blocksTable',
              useExternalData: true,
              dataKey: 'sections',
              title: 'All Sections',
              collection: 'sections',
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
      type: 'shared',
      category: 'content',
      status: 'published',
      blocks: [
        {
          blockType: 'richText',
          content: createLexicalContent('## Components'),
        },
        {
          blockType: 'dataFetch',
          dataKey: 'components',
          source: {
            type: 'collection',
            collection: 'components',
          },
          query: {
            limit: 50,
          },
          children: [
            {
              blockType: 'blocksTable',
              useExternalData: true,
              dataKey: 'components',
              title: 'All Components',
              collection: 'components',
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
  ]

  const createdSections: Record<string, string> = {}

  for (const sectionData of sectionDefinitions) {
    try {
      const existing = await payload.find({
        collection: 'sections',
        where: { slug: { equals: sectionData.slug } },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        createdSections[sectionData.slug] = existing.docs[0].id
        console.log(`    ⏭️  Section "${sectionData.name}" already exists`)
        continue
      }

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
  // 3. Create Pages with Section References
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
