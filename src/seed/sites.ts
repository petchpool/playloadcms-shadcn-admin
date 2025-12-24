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

  // Helper function to delete site and its pages
  const deleteSiteAndPages = async (domain: string) => {
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

      // Delete all pages associated with this site
      const pages = await payload.find({
        collection: 'pages',
        where: {
          site: {
            equals: existingSite.id,
          },
        },
        limit: 1000,
        overrideAccess: true,
      })

      for (const page of pages.docs) {
        try {
          await payload.delete({
            collection: 'pages',
            id: page.id,
            overrideAccess: true,
          })
          console.log(`     - Deleted page: ${page.title}`)
        } catch (error) {
          console.error(`     - Error deleting page "${page.title}":`, error)
        }
      }

      // Delete the site
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
    await deleteSiteAndPages(siteData.domain)

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

    // Helper function to create pages for a site
    const createPagesForSite = async (
      siteId: string,
      siteName: string,
      pages: Array<{
        titleEn: string
        titleTh: string
        slug: string
        contentEn: string
        contentTh: string
        order: number
      }>,
    ) => {
      console.log(`\n  📄 Creating pages for ${siteName}...`)

      for (const pageData of pages) {
        const translationGroup = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // English page
        const pageEn = await payload.create({
          collection: 'pages',
          data: {
            title: pageData.titleEn,
            slug: pageData.slug,
            site: siteId,
            language: enLanguage.id,
            status: 'published',
            content: [
              {
                blockType: 'richText',
                content: createLexicalContent(pageData.contentEn),
              },
            ],
            seo: {
              metaTitle: pageData.titleEn,
              metaDescription: `${pageData.titleEn} page`,
            },
            translations: {
              translationGroup,
            },
            publishedAt: new Date(),
            order: pageData.order,
          },
          overrideAccess: true,
        })
        console.log(`     ✅ Created page: ${pageData.titleEn} (en)`)

        // Thai page
        const pageTh = await payload.create({
          collection: 'pages',
          data: {
            title: pageData.titleTh,
            slug: pageData.slug,
            site: siteId,
            language: thLanguage.id,
            status: 'published',
            content: [
              {
                blockType: 'richText',
                content: createLexicalContent(pageData.contentTh),
              },
            ],
            seo: {
              metaTitle: pageData.titleTh,
              metaDescription: `${pageData.titleTh} page`,
            },
            translations: {
              translationGroup,
              relatedPages: [pageEn.id],
            },
            publishedAt: new Date(),
            order: pageData.order,
          },
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

    // Create pages for Main Site
    await createPagesForSite(mainSite.id, 'Main Site', [
      {
        titleEn: 'Home',
        titleTh: 'หน้าแรก',
        slug: 'home',
        contentEn: 'Welcome to Main Site\n\nThis is the main site homepage.',
        contentTh: 'ยินดีต้อนรับสู่เว็บไซต์หลัก\n\nนี่คือหน้าแรกของเว็บไซต์หลัก',
        order: 1,
      },
    ])

    // Create pages for Dashboard Site
    await createPagesForSite(dashboardSiteCreated.id, 'Dashboard Site', [
      {
        titleEn: 'Dashboard',
        titleTh: 'แดชบอร์ด',
        slug: 'dashboard',
        contentEn: 'Welcome to Dashboard\n\nThis is your dashboard page.',
        contentTh: 'ยินดีต้อนรับสู่แดชบอร์ด\n\nนี่คือหน้าแดชบอร์ดของคุณ',
        order: 1,
      },
    ])

    // Create pages for Lobby Site
    await createPagesForSite(lobbySiteCreated.id, 'Lobby Site', [
      {
        titleEn: 'Lobby',
        titleTh: 'ล็อบบี้',
        slug: 'lobby',
        contentEn: 'Welcome to Lobby\n\nThis is your lobby page.',
        contentTh: 'ยินดีต้อนรับสู่ล็อบบี้\n\nนี่คือหน้าล็อบบี้ของคุณ',
        order: 1,
      },
    ])

    console.log(`\n  ✨ Created all default pages`)
  } catch (error) {
    console.error(`  ❌ Error creating site "${defaultSite.name}":`, error)
  }

  console.log('✨ Sites seeding completed!')
}
