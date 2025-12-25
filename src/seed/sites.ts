import { getPayload } from 'payload'
import config from '../payload.config'

export async function seedSites() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Sites...')

  // Get default languages (en and th)
  const languages = await payload.find({
    collection: 'languages',
    where: {
      code: {
        in: ['en', 'th'],
      },
    },
    limit: 2,
    overrideAccess: true,
  })

  const enLanguage = languages.docs.find((lang) => lang.code === 'en')
  const thLanguage = languages.docs.find((lang) => lang.code === 'th')

  if (!enLanguage || !thLanguage) {
    console.log(
      '  ⚠️  Warning: Default languages (en, th) not found. Please run language seed first.',
    )
    return
  }

  // Get layouts
  const layouts = await payload.find({
    collection: 'layouts',
    where: {
      slug: {
        in: ['main-layout', 'blank-layout'],
      },
    },
    limit: 2,
    overrideAccess: true,
  })

  const mainLayout = layouts.docs.find((layout) => layout.slug === 'main-layout')
  const blankLayout = layouts.docs.find((layout) => layout.slug === 'blank-layout')

  if (!mainLayout || !blankLayout) {
    console.log(
      '  ⚠️  Warning: Required layouts (main-layout, blank-layout) not found. Please run layout seed first.',
    )
    return
  }

  // Helper function to create theme config
  const createThemeConfig = () => ({
    radius: 0.625,
    colors: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.145 0 0)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.145 0 0)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.145 0 0)',
      primary: 'oklch(0.205 0 0)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.97 0 0)',
      secondaryForeground: 'oklch(0.205 0 0)',
      muted: 'oklch(0.97 0 0)',
      mutedForeground: 'oklch(0.556 0 0)',
      accent: 'oklch(0.97 0 0)',
      accentForeground: 'oklch(0.205 0 0)',
      destructive: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.922 0 0)',
      input: 'oklch(0.922 0 0)',
      ring: 'oklch(0.708 0 0)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 184.704)',
      chart3: 'oklch(0.398 0.07 227.392)',
      chart4: 'oklch(0.828 0.189 84.429)',
      chart5: 'oklch(0.769 0.188 70.08)',
      sidebar: 'oklch(0.985 0 0)',
      sidebarForeground: 'oklch(0.145 0 0)',
      sidebarPrimary: 'oklch(0.205 0 0)',
      sidebarPrimaryForeground: 'oklch(0.985 0 0)',
      sidebarAccent: 'oklch(0.97 0 0)',
      sidebarAccentForeground: 'oklch(0.205 0 0)',
      sidebarBorder: 'oklch(0.922 0 0)',
      sidebarRing: 'oklch(0.708 0 0)',
    },
    darkMode: {
      background: 'oklch(0.145 0 0)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.205 0 0)',
      cardForeground: 'oklch(0.985 0 0)',
      popover: 'oklch(0.205 0 0)',
      popoverForeground: 'oklch(0.985 0 0)',
      primary: 'oklch(0.922 0 0)',
      primaryForeground: 'oklch(0.205 0 0)',
      secondary: 'oklch(0.269 0 0)',
      secondaryForeground: 'oklch(0.985 0 0)',
      muted: 'oklch(0.269 0 0)',
      mutedForeground: 'oklch(0.708 0 0)',
      accent: 'oklch(0.269 0 0)',
      accentForeground: 'oklch(0.985 0 0)',
      destructive: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(1 0 0 / 10%)',
      input: 'oklch(1 0 0 / 15%)',
      ring: 'oklch(0.556 0 0)',
      chart1: 'oklch(0.488 0.243 264.376)',
      chart2: 'oklch(0.696 0.17 162.48)',
      chart3: 'oklch(0.769 0.188 70.08)',
      chart4: 'oklch(0.627 0.265 303.9)',
      chart5: 'oklch(0.645 0.246 16.439)',
      sidebar: 'oklch(0.205 0 0)',
      sidebarForeground: 'oklch(0.985 0 0)',
      sidebarPrimary: 'oklch(0.488 0.243 264.376)',
      sidebarPrimaryForeground: 'oklch(0.985 0 0)',
      sidebarAccent: 'oklch(0.269 0 0)',
      sidebarAccentForeground: 'oklch(0.985 0 0)',
      sidebarBorder: 'oklch(1 0 0 / 10%)',
      sidebarRing: 'oklch(0.556 0 0)',
    },
    tailwindConfig: {},
    cssVariables: '',
  })

  const defaultSite = {
    name: 'Main Site',
    domain: 'localhost',
    subdomains: [],
    defaultLayout: mainLayout.id,
    seo: {
      defaultTitle: 'Main Site',
      defaultDescription: 'Main site description',
    },
    i18n: {
      enabled: true,
      defaultLanguage: enLanguage.id,
      supportedLanguages: [enLanguage.id, thLanguage.id],
      languageDetection: 'path',
      pathPrefix: true,
      fallbackLanguage: enLanguage.id,
    },
    theme: createThemeConfig(),
    status: 'active',
  }

  const dashboardSite = {
    name: 'Dashboard Site',
    domain: 'admin.localhost',
    subdomains: [],
    defaultLayout: mainLayout.id,
    seo: {
      defaultTitle: 'Dashboard',
      defaultDescription: 'Dashboard site',
    },
    i18n: {
      enabled: true,
      defaultLanguage: enLanguage.id,
      supportedLanguages: [enLanguage.id, thLanguage.id],
      languageDetection: 'path',
      pathPrefix: true,
      fallbackLanguage: enLanguage.id,
    },
    theme: createThemeConfig(),
    status: 'active',
  }

  const lobbySite = {
    name: 'Lobby Site',
    domain: 'lobby.localhost',
    subdomains: [],
    defaultLayout: blankLayout.id,
    seo: {
      defaultTitle: 'Lobby',
      defaultDescription: 'Lobby site',
    },
    i18n: {
      enabled: true,
      defaultLanguage: enLanguage.id,
      supportedLanguages: [enLanguage.id, thLanguage.id],
      languageDetection: 'path',
      pathPrefix: true,
      fallbackLanguage: enLanguage.id,
    },
    theme: createThemeConfig(),
    status: 'active',
  }

  // Helper function to delete site (pages are shared, so we don't delete them)
  const deleteSite = async (domain: string) => {
    const existing = await payload.find({
      collection: 'sites',
      where: {
        domain: {
          equals: domain,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      const existingSite = existing.docs[0]
      console.log(`  🗑️  Deleting existing site "${existingSite.name}" (${existingSite.domain})...`)

      // Delete the site (pages are shared, so we don't delete them)
      await payload.delete({
        collection: 'sites',
        id: existingSite.id,
        overrideAccess: true,
      })
      console.log(`  ✅ Deleted existing site`)
    }
  }

  // Helper function to create site
  const createSite = async (siteData: any) => {
    await deleteSite(siteData.domain)

    const site = await payload.create({
      collection: 'sites',
      data: siteData,
      overrideAccess: true,
    })

    console.log(`  ✅ Created site: ${site.name} (${site.domain})`)
    console.log(`     - Default Layout: ${site.defaultLayout ? 'Set' : 'Not set'}`)
    console.log(`     - i18n enabled: ${site.i18n?.enabled ? 'Yes' : 'No'}`)
    console.log(`     - Supported languages: ${site.i18n?.supportedLanguages?.length || 0}`)

    return site
  }

  try {
    // Create Main Site
    console.log(`\n  📍 Creating Main Site...`)
    const mainSite = await createSite(defaultSite)

    // Create Dashboard Site
    console.log(`\n  📍 Creating Dashboard Site...`)
    const dashboardSiteCreated = await createSite(dashboardSite)

    // Create Lobby Site
    console.log(`\n  📍 Creating Lobby Site...`)
    const lobbySiteCreated = await createSite(lobbySite)

    // Lexical editor root node structure
    const createLexicalContent = (text: string) => ({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text,
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    })

    // Helper function to create pages (shared across all sites)
    const createPages = async (
      pages: Array<{
        titleEn: string
        titleTh: string
        slug: string
        contentEn: string
        contentTh: string
        order: number
        blocks?: any[] // Optional custom blocks for English
        blocksTh?: any[] // Optional custom blocks for Thai
      }>,
    ) => {
      console.log(`\n  📄 Creating pages...`)
      console.log(`  ⏭️  Skipping page creation - using seed-pages-localized.ts instead`)
      return // Pages are now localized, use seed-pages-localized.ts instead

      // eslint-disable-next-line no-unreachable
      for (const pageData of pages) {
        // Check if page already exists
        const existing = await payload.find({
          collection: 'pages',
          where: {
            slug: {
              equals: pageData.slug,
            },
          },
          limit: 1,
          overrideAccess: true,
        })

        if (existing.docs.length > 0) {
          const existingPage = existing.docs[0]
          console.log(
            `     🔄 Page "${pageData.titleEn}" (${pageData.slug}) already exists, updating...`,
          )

          // Update existing page with new blocks if provided
          const contentBlocks = pageData.blocks ||
            existingPage.content || [
              {
                blockType: 'richText',
                content: createLexicalContent(pageData.contentEn),
              },
            ]

          await payload.update({
            collection: 'pages',
            id: existingPage.id,
            data: {
              title: pageData.titleEn,
              content: contentBlocks,
              seo: {
                metaTitle: pageData.titleEn,
                metaDescription: `${pageData.titleEn} page`,
              },
              order: pageData.order,
            },
            overrideAccess: true,
            draft: false,
          })
          console.log(`     ✅ Updated page: ${pageData.titleEn} (en)`)

          // Note: Pages are now localized, no need to check Thai page separately
          // Update Thai page if exists
          const existingTh = await payload.find({
            collection: 'pages',
            where: {
              slug: {
                equals: pageData.slug,
              },
            },
            limit: 1,
            overrideAccess: true,
          })

          if (existingTh.docs.length > 0) {
            const contentBlocksTh = pageData.blocksTh ||
              pageData.blocks ||
              existingTh.docs[0].content || [
                {
                  blockType: 'richText',
                  content: createLexicalContent(pageData.contentTh),
                },
              ]

            await payload.update({
              collection: 'pages',
              id: existingTh.docs[0].id,
              data: {
                title: pageData.titleTh,
                content: contentBlocksTh,
                seo: {
                  metaTitle: pageData.titleTh,
                  metaDescription: `${pageData.titleTh} page`,
                },
                order: pageData.order,
              },
              overrideAccess: true,
              draft: false,
            })
            console.log(`     ✅ Updated page: ${pageData.titleTh} (th)`)
          }

          continue
        }

        const translationGroup = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Use custom blocks if provided, otherwise use default richText
        const contentBlocks = pageData.blocks || [
          {
            blockType: 'richText',
            content: createLexicalContent(pageData.contentEn),
          },
        ]

        // English page
        const pageEn = await payload.create({
          collection: 'pages',
          data: {
            title: pageData.titleEn,
            slug: pageData.slug,
            language: enLanguage.id,
            pageStatus: 'published',
            content: contentBlocks,
            seo: {
              metaTitle: pageData.titleEn,
              metaDescription: `${pageData.titleEn} page`,
            },
            translations: {
              translationGroup,
            },
            publishedAt: new Date().toISOString(),
            order: pageData.order,
          },
          overrideAccess: true,
        })
        console.log(`     ✅ Created page: ${pageData.titleEn} (en)`)

        // Thai page - use custom blocksTh if provided, otherwise use blocks, otherwise use default richText
        const contentBlocksTh = pageData.blocksTh ||
          pageData.blocks || [
            {
              blockType: 'richText',
              content: createLexicalContent(pageData.contentTh),
            },
          ]

        const pageTh = await payload.create({
          collection: 'pages',
          data: {
            title: pageData.titleTh,
            slug: pageData.slug,
            language: thLanguage.id,
            pageStatus: 'published',
            content: contentBlocksTh,
            seo: {
              metaTitle: pageData.titleTh,
              metaDescription: `${pageData.titleTh} page`,
            },
            translations: {
              translationGroup,
              relatedPages: [pageEn.id],
            },
            publishedAt: new Date().toISOString(),
            order: pageData.order,
          },
          draft: false,
          overrideAccess: true,
        })
        console.log(`     ✅ Created page: ${pageData.titleTh} (th)`)

        // Update EN page with related page
        await payload.update({
          collection: 'pages',
          id: pageEn.id,
          data: {
            translations: {
              translationGroup,
              relatedPages: [pageTh.id],
            },
          },
          overrideAccess: true,
        })
      }
    }

    // Create overview page blocks (using various block types)
    const overviewBlocksEn = [
      {
        blockType: 'richText',
        content: createLexicalContent(
          'Welcome to the Overview page! This page demonstrates the flexible Blocks system.',
        ),
      },
      {
        blockType: 'grid',
        columns: '3',
        gap: 'md',
        items: [
          {
            content: [
              {
                blockType: 'card',
                title: 'Rich Content',
                description: 'Create beautiful content with rich text editor',
                link: '/pages',
                linkText: 'Learn More',
              },
            ],
          },
          {
            content: [
              {
                blockType: 'card',
                title: 'Media Gallery',
                description: 'Showcase images and videos in galleries',
                link: '/gallery',
                linkText: 'View Gallery',
              },
            ],
          },
          {
            content: [
              {
                blockType: 'card',
                title: 'Custom Components',
                description: 'Use reusable components from the Components collection',
                link: '/components',
                linkText: 'Browse Components',
              },
            ],
          },
        ],
      },
      {
        blockType: 'richText',
        content: createLexicalContent(
          '## Features\n\nThis Blocks system allows you to:\n\n- Create flexible page layouts\n- Use reusable components\n- Build responsive grids\n- Add rich media content',
        ),
      },
      {
        blockType: 'code',
        code: `// Example code block
function greet(name: string) {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))`,
        language: 'typescript',
        caption: 'Example TypeScript code',
      },
      {
        blockType: 'blocksTable',
        title: 'Blocks Management',
        description: 'View and manage all available blocks with advanced filtering and sorting',
        limit: 10,
        columns: ['name', 'type', 'category', 'status', 'createdAt'],
      },
    ]

    const overviewBlocksTh = [
      {
        blockType: 'richText',
        content: createLexicalContent(
          'ยินดีต้อนรับสู่หน้าพื้นฐาน! หน้านี้แสดงให้เห็นระบบ Blocks ที่ยืดหยุ่น',
        ),
      },
      {
        blockType: 'grid',
        columns: '3',
        gap: 'md',
        items: [
          {
            content: [
              {
                blockType: 'card',
                title: 'เนื้อหาที่หลากหลาย',
                description: 'สร้างเนื้อหาสวยงามด้วย rich text editor',
                link: '/pages',
                linkText: 'เรียนรู้เพิ่มเติม',
              },
            ],
          },
          {
            content: [
              {
                blockType: 'card',
                title: 'แกลเลอรี่สื่อ',
                description: 'แสดงภาพและวิดีโอในแกลเลอรี่',
                link: '/gallery',
                linkText: 'ดูแกลเลอรี่',
              },
            ],
          },
          {
            content: [
              {
                blockType: 'card',
                title: 'คอมโพเนนต์ที่กำหนดเอง',
                description: 'ใช้คอมโพเนนต์ที่นำกลับมาใช้ได้จากคอลเลกชัน Components',
                link: '/components',
                linkText: 'เรียกดูคอมโพเนนต์',
              },
            ],
          },
        ],
      },
      {
        blockType: 'richText',
        content: createLexicalContent(
          '## คุณสมบัติ\n\nระบบ Blocks นี้ช่วยให้คุณ:\n\n- สร้างเลย์เอาต์หน้าที่ยืดหยุ่น\n- ใช้คอมโพเนนต์ที่นำกลับมาใช้ได้\n- สร้างกริดที่ตอบสนอง\n- เพิ่มเนื้อหาสื่อที่หลากหลาย',
        ),
      },
      {
        blockType: 'code',
        code: `// ตัวอย่าง code block
function greet(name: string) {
  return \`สวัสดี, \${name}!\`
}

console.log(greet('โลก'))`,
        language: 'typescript',
        caption: 'ตัวอย่างโค้ด TypeScript',
      },
      {
        blockType: 'blocksTable',
        title: 'จัดการ Blocks',
        description: 'ดูและจัดการ blocks ทั้งหมดด้วยระบบกรองและเรียงลำดับขั้นสูง',
        limit: 10,
        columns: ['name', 'type', 'category', 'status', 'createdAt'],
      },
    ]

    // Dashboard blocks with DataFetch and StatCard Grid
    const dashboardBlocksEn = [
      {
        blockType: 'richText',
        content: createLexicalContent(
          '# Dashboard\n\nWelcome to the admin dashboard. Here you can see statistics and manage your content.',
        ),
      },
      // DataFetch block for Users count
      {
        blockType: 'dataFetch',
        dataKey: 'usersStats',
        source: {
          type: 'collection',
          collection: 'users',
        },
        transform: {
          type: 'count',
        },
        children: [
          {
            blockType: 'grid',
            columns: '4',
            gap: 'md',
            items: [
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'Total Users',
                    icon: 'users',
                    dataKey: 'usersStats',
                    valueField: 'value',
                    format: {
                      suffix: ' users',
                    },
                    trend: {
                      value: 12,
                      label: 'vs last month',
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'Active Users',
                    icon: 'activity',
                    staticValue: '85%',
                    variant: 'gradient',
                    trend: {
                      value: 5,
                      label: 'this week',
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'New Signups',
                    icon: 'trending-up',
                    staticValue: '24',
                    format: {
                      suffix: ' today',
                    },
                    variant: 'outline',
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'Documents',
                    icon: 'file',
                    dataKey: 'usersStats',
                    valueField: 'count',
                  },
                ],
              },
            ],
          },
        ],
      },
      // DataFetch block for Components with Table
      {
        blockType: 'dataFetch',
        dataKey: 'componentsData',
        source: {
          type: 'collection',
          collection: 'components',
        },
        transform: {
          type: 'none',
        },
        children: [
          {
            blockType: 'blocksTable',
            title: 'Components List',
            description: 'View components using data from DataFetch context',
            useExternalData: true,
            dataKey: 'componentsData',
            collection: 'components',
            columns: ['name', 'type', 'category', 'status'],
          },
        ],
      },
      // DataFetch block for Pages count
      {
        blockType: 'dataFetch',
        dataKey: 'pagesStats',
        source: {
          type: 'collection',
          collection: 'pages',
        },
        query: {
          where: {
            pageStatus: {
              equals: 'published',
            },
          },
        },
        transform: {
          type: 'count',
        },
        children: [
          {
            blockType: 'grid',
            columns: '3',
            gap: 'md',
            items: [
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'Published Pages',
                    icon: 'file',
                    dataKey: 'pagesStats',
                    valueField: 'value',
                    variant: 'gradient',
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'Media Files',
                    icon: 'image',
                    staticValue: '156',
                    format: {
                      suffix: ' files',
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'Sites',
                    icon: 'globe',
                    staticValue: '3',
                    format: {
                      suffix: ' active',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    const dashboardBlocksTh = [
      {
        blockType: 'richText',
        content: createLexicalContent(
          '# แดชบอร์ด\n\nยินดีต้อนรับสู่แดชบอร์ดผู้ดูแลระบบ คุณสามารถดูสถิติและจัดการเนื้อหาได้ที่นี่',
        ),
      },
      // DataFetch block for Users count
      {
        blockType: 'dataFetch',
        dataKey: 'usersStats',
        source: {
          type: 'collection',
          collection: 'users',
        },
        transform: {
          type: 'count',
        },
        children: [
          {
            blockType: 'grid',
            columns: '4',
            gap: 'md',
            items: [
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'ผู้ใช้ทั้งหมด',
                    icon: 'users',
                    dataKey: 'usersStats',
                    valueField: 'value',
                    format: {
                      suffix: ' คน',
                    },
                    trend: {
                      value: 12,
                      label: 'เทียบกับเดือนที่แล้ว',
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'ผู้ใช้ที่ใช้งาน',
                    icon: 'activity',
                    staticValue: '85%',
                    variant: 'gradient',
                    trend: {
                      value: 5,
                      label: 'สัปดาห์นี้',
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'สมาชิกใหม่',
                    icon: 'trending-up',
                    staticValue: '24',
                    format: {
                      suffix: ' วันนี้',
                    },
                    variant: 'outline',
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'เอกสาร',
                    icon: 'file',
                    dataKey: 'usersStats',
                    valueField: 'count',
                  },
                ],
              },
            ],
          },
        ],
      },
      // DataFetch block for Components with Table
      {
        blockType: 'dataFetch',
        dataKey: 'componentsData',
        source: {
          type: 'collection',
          collection: 'components',
        },
        transform: {
          type: 'none',
        },
        children: [
          {
            blockType: 'blocksTable',
            title: 'รายการคอมโพเนนต์',
            description: 'ดูคอมโพเนนต์จาก DataFetch context',
            useExternalData: true,
            dataKey: 'componentsData',
            collection: 'components',
            columns: ['name', 'type', 'category', 'status'],
          },
        ],
      },
      // DataFetch block for Pages count
      {
        blockType: 'dataFetch',
        dataKey: 'pagesStats',
        source: {
          type: 'collection',
          collection: 'pages',
        },
        query: {
          where: {
            pageStatus: {
              equals: 'published',
            },
          },
        },
        transform: {
          type: 'count',
        },
        children: [
          {
            blockType: 'grid',
            columns: '3',
            gap: 'md',
            items: [
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'หน้าที่เผยแพร่',
                    icon: 'file',
                    dataKey: 'pagesStats',
                    valueField: 'value',
                    variant: 'gradient',
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'ไฟล์สื่อ',
                    icon: 'image',
                    staticValue: '156',
                    format: {
                      suffix: ' ไฟล์',
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    blockType: 'statCard',
                    title: 'เว็บไซต์',
                    icon: 'globe',
                    staticValue: '3',
                    format: {
                      suffix: ' ใช้งาน',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    // Create pages (shared across all sites)
    await createPages([
      {
        titleEn: 'Home',
        titleTh: 'หน้าแรก',
        slug: 'home',
        contentEn: 'Welcome to Main Site\n\nThis is the main site homepage.',
        contentTh: 'ยินดีต้อนรับสู่เว็บไซต์หลัก\n\nนี่คือหน้าแรกของเว็บไซต์หลัก',
        order: 1,
      },
      {
        titleEn: 'Overview',
        titleTh: 'ภาพรวม',
        slug: 'overview',
        contentEn: 'Overview page',
        contentTh: 'หน้าภาพรวม',
        order: 2,
        blocks: overviewBlocksEn,
        blocksTh: overviewBlocksTh,
      },
      {
        titleEn: 'Dashboard',
        titleTh: 'แดชบอร์ด',
        slug: 'dashboard',
        contentEn: 'Dashboard page with statistics',
        contentTh: 'หน้าแดชบอร์ดแสดงสถิติ',
        order: 3,
        blocks: dashboardBlocksEn,
        blocksTh: dashboardBlocksTh,
      },
    ])

    console.log(`\n  ✨ Created all default pages`)
  } catch (error) {
    console.error(`  ❌ Error creating site "${defaultSite.name}":`, error)
  }

  console.log('✨ Sites seeding completed!')
}
