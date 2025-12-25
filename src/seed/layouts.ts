import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Seed Layouts (Section-based Architecture)
 *
 * This seed:
 * 1. Creates reusable layout sections (header, footer, sidebar)
 * 2. Creates layouts that reference these sections
 *
 * Note: Sections are created in the 'Global' type for layouts
 */
export async function seedLayouts() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Layout Sections and Layouts...')

  // ============================================
  // 1. Create Layout Sections (Global Components)
  // ============================================
  console.log('  📦 Creating layout sections...')

  const layoutSections = [
    {
      slug: 'main-header',
      name: 'Main Header',
      type: 'global',
      category: 'header',
      blocks: [
        {
          blockType: 'richText',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Main Header Component - Configure in Admin Panel',
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      status: 'published',
      tags: [{ tag: 'layout' }, { tag: 'header' }],
    },
    {
      slug: 'main-footer',
      name: 'Main Footer',
      type: 'global',
      category: 'footer',
      blocks: [
        {
          blockType: 'richText',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Main Footer Component - Configure in Admin Panel',
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      status: 'published',
      tags: [{ tag: 'layout' }, { tag: 'footer' }],
    },
    {
      slug: 'main-sidebar',
      name: 'Main Sidebar',
      type: 'global',
      category: 'other',
      blocks: [
        {
          blockType: 'richText',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Main Sidebar Component - Configure in Admin Panel',
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      status: 'published',
      tags: [{ tag: 'layout' }, { tag: 'sidebar' }],
    },
    {
      slug: 'simple-header',
      name: 'Simple Header',
      type: 'global',
      category: 'header',
      blocks: [
        {
          blockType: 'richText',
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Simple Header Component - Configure in Admin Panel',
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      status: 'published',
      tags: [{ tag: 'layout' }, { tag: 'header' }, { tag: 'simple' }],
    },
  ]

  const createdSections: Record<string, string> = {}

  for (const sectionData of layoutSections) {
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
  // 2. Create Layouts with Section References
  // ============================================
  console.log('  🏗️  Creating layouts...')

  const layouts = [
    {
      name: 'Main Layout',
      slug: 'main-layout',
      description: 'Main layout with header, footer, and sidebar (references sections)',
      type: 'main',
      status: 'published',
      components: [
        {
          blockType: 'sectionRef',
          section: createdSections['main-header'],
          enabled: true,
          position: 'header',
          props: {
            sticky: true,
            transparent: false,
          },
        },
        {
          blockType: 'sectionRef',
          section: createdSections['main-sidebar'],
          enabled: true,
          position: 'sidebar',
          props: {
            width: 300,
            collapsedWidth: 88,
          },
        },
        {
          blockType: 'sectionRef',
          section: createdSections['main-footer'],
          enabled: true,
          position: 'footer',
          props: {
            showCopyright: true,
            showLinks: true,
          },
        },
      ],
    },
    {
      name: 'Simple Layout',
      slug: 'simple-layout',
      description: 'Simple layout with minimal header and footer',
      type: 'simple',
      status: 'published',
      components: [
        {
          blockType: 'sectionRef',
          section: createdSections['simple-header'],
          enabled: true,
          position: 'header',
          props: {
            sticky: false,
            transparent: false,
          },
        },
        {
          blockType: 'sectionRef',
          section: createdSections['main-footer'],
          enabled: true,
          position: 'footer',
          props: {
            showCopyright: true,
            showLinks: false,
          },
        },
      ],
    },
    {
      name: 'Blank Layout',
      slug: 'blank-layout',
      description: 'Blank layout without header and footer',
      type: 'blank',
      status: 'published',
      components: [],
    },
  ]

  for (const layoutData of layouts) {
    try {
      const existing = await payload.find({
        collection: 'layouts',
        where: { slug: { equals: layoutData.slug } },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        console.log(`    ⏭️  Layout "${layoutData.name}" already exists`)
        continue
      }

      const layout = await payload.create({
        collection: 'layouts',
        data: layoutData,
        overrideAccess: true,
      })

      console.log(`    ✅ Created layout: ${layout.name} (${layout.slug})`)
    } catch (error) {
      console.error(`    ❌ Error creating layout "${layoutData.name}":`, error)
    }
  }

  console.log('✨ Layouts and sections seeding completed!')
}
