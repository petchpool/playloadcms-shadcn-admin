import { getPayload } from 'payload'
import config from '../payload.config'
import { batchSeed } from './utils/batch-seeder'

/**
 * Seed Layouts (Block-based Architecture)
 *
 * This seed:
 * 1. Creates reusable layout blocks (header, footer, sidebar)
 * 2. Creates layouts that reference these blocks
 *
 * Note: Blocks are created in the 'Global' type for layouts
 */
export async function seedLayouts() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Layout Blocks and Layouts...')

  // ============================================
  // 0. Get Navigation Blocks (should be created by seedNavigation())
  // ============================================
  const navigationBlocks = await payload.find({
    collection: 'blocks',
    where: {
      slug: {
        in: ['main-sidebar-nav', 'simple-top-nav'],
      },
    },
    limit: 10,
    overrideAccess: true,
  })

  const mainSidebarNav = navigationBlocks.docs.find((nav) => nav.slug === 'main-sidebar-nav')
  const simpleTopNav = navigationBlocks.docs.find((nav) => nav.slug === 'simple-top-nav')

  if (!mainSidebarNav) {
    console.log(
      '  ⚠️  Warning: main-sidebar-nav not found. Please run navigation seed first (pnpm seed:navigation)',
    )
  } else {
    console.log('  ✅ Found navigation block: main-sidebar-nav')
  }

  if (!simpleTopNav) {
    console.log('  ⚠️  Warning: simple-top-nav not found. Please run navigation seed first')
  } else {
    console.log('  ✅ Found navigation block: simple-top-nav')
  }

  // ============================================
  // 1. Create Layout Blocks (Global Components)
  // ============================================
  console.log('  📦 Creating layout blocks...')

  const layoutBlocks = [
    {
      slug: 'main-header',
      name: 'Main Header',
      type: 'global' as const,
      category: 'header' as const,
      blocks: [
        {
          blockType: 'richText' as const,
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
                      version: 1,
                    },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
            },
          },
        },
      ],
      status: 'published' as const,
      tags: [{ tag: 'layout' }, { tag: 'header' }],
    },
    {
      slug: 'main-footer',
      name: 'Main Footer',
      type: 'global' as const,
      category: 'footer' as const,
      blocks: [
        {
          blockType: 'richText' as const,
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
                      version: 1,
                    },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
            },
          },
        },
      ],
      status: 'published' as const,
      tags: [{ tag: 'layout' }, { tag: 'footer' }],
    },
    {
      slug: 'main-sidebar',
      name: 'Main Sidebar',
      type: 'global' as const,
      category: 'other' as const,
      blocks: [
        {
          blockType: 'richText' as const,
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
                      version: 1,
                    },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
            },
          },
        },
      ],
      status: 'published' as const,
      tags: [{ tag: 'layout' }, { tag: 'sidebar' }],
    },
    {
      slug: 'simple-header',
      name: 'Simple Header',
      type: 'global' as const,
      category: 'header' as const,
      blocks: [
        {
          blockType: 'richText' as const,
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
                      version: 1,
                    },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
            },
          },
        },
      ],
      status: 'published' as const,
      tags: [{ tag: 'layout' }, { tag: 'header' }, { tag: 'simple' }],
    },
  ]

  // Batch seed blocks
  const blocksResult = await batchSeed(payload, {
    collection: 'blocks',
    data: layoutBlocks,
    uniqueField: 'slug',
    batchSize: 10,
  })

  // Create map of slug -> ID for layout references
  const createdBlocks: Record<string, string> = {}
  const allBlocks = [...blocksResult.created, ...blocksResult.skipped]
  for (const block of allBlocks) {
    if (block && typeof block === 'object' && 'slug' in block && 'id' in block) {
      createdBlocks[block.slug as string] = block.id as string
    }
  }

  // ============================================
  // 2. Create Layouts with Block References
  // ============================================
  console.log('  🏗️  Creating layouts...')

  const layouts = [
    {
      name: 'Main Layout',
      slug: 'main-layout',
      description: 'Main layout with header, footer, and sidebar navigation',
      type: 'main' as const,
      status: 'published' as const,
      components: [
        {
          blockType: 'blockRef' as const,
          block: createdBlocks['main-header'],
          enabled: true,
          position: 'header' as const,
          props: {
            sticky: true,
            transparent: false,
          },
        },
        // Add top navigation if available
        ...(simpleTopNav
          ? [
              {
                blockType: 'blockRef' as const,
                block: simpleTopNav.id,
                enabled: true,
                position: 'navigation' as const,
                props: {
                  displayMode: 'horizontal',
                },
              },
            ]
          : []),
        // Use navigation block for sidebar if available, otherwise fallback to simple sidebar
        ...(mainSidebarNav
          ? [
              {
                blockType: 'blockRef' as const,
                block: mainSidebarNav.id,
                enabled: true,
                position: 'sidebar' as const,
                props: {
                  width: 300,
                  collapsedWidth: 88,
                },
              },
            ]
          : [
              {
                blockType: 'blockRef' as const,
                block: createdBlocks['main-sidebar'],
                enabled: true,
                position: 'sidebar' as const,
                props: {
                  width: 300,
                  collapsedWidth: 88,
                },
              },
            ]),
        {
          blockType: 'blockRef' as const,
          block: createdBlocks['main-footer'],
          enabled: true,
          position: 'footer' as const,
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
      type: 'simple' as const,
      status: 'published' as const,
      components: [
        {
          blockType: 'blockRef' as const,
          block: createdBlocks['simple-header'],
          enabled: true,
          position: 'header' as const,
          props: {
            sticky: false,
            transparent: false,
          },
        },
        {
          blockType: 'blockRef' as const,
          block: createdBlocks['main-footer'],
          enabled: true,
          position: 'footer' as const,
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
      type: 'blank' as const,
      status: 'published' as const,
      components: [],
    },
  ]

  // Batch seed layouts
  await batchSeed(payload, {
    collection: 'layouts',
    data: layouts,
    uniqueField: 'slug',
    batchSize: 10,
  })

  console.log('✨ Layouts and blocks seeding completed!')
}
