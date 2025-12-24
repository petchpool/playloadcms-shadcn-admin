import { getPayload } from 'payload'
import config from '../payload.config'

export async function seedLayouts() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Layouts...')

  const layouts = [
    {
      name: 'Main Layout',
      slug: 'main-layout',
      description: 'Main layout with header, footer, sidebar, and navigation',
      type: 'main',
      status: 'published',
      components: [
        {
          blockType: 'header',
          enabled: true,
          config: {
            sticky: true,
            transparent: false,
          },
        },
        {
          blockType: 'sidebar',
          enabled: true,
          menu: {
            items: [
              {
                title: 'Dashboard',
                path: '/',
                icon: 'LayoutDashboard',
                caption: 'Main dashboard',
                disabled: false,
                external: false,
                level2Items: [
                  {
                    title: 'Overview',
                    path: '/dashboard/overview',
                    icon: 'BarChart3',
                    disabled: false,
                    external: false,
                  },
                  {
                    title: 'Analytics',
                    path: '/dashboard/analytics',
                    icon: 'TrendingUp',
                    disabled: false,
                    external: false,
                    level3Items: [
                      {
                        title: 'Reports',
                        path: '/dashboard/analytics/reports',
                        icon: 'FileText',
                        disabled: false,
                        external: false,
                      },
                      {
                        title: 'Charts',
                        path: '/dashboard/analytics/charts',
                        icon: 'PieChart',
                        disabled: false,
                        external: false,
                      },
                    ],
                  },
                ],
              },
              {
                title: 'Pages',
                path: '/pages',
                icon: 'FileText',
                caption: 'Manage pages',
                disabled: false,
                external: false,
                level2Items: [
                  {
                    title: 'All Pages',
                    path: '/pages',
                    icon: 'List',
                    disabled: false,
                    external: false,
                  },
                  {
                    title: 'Create Page',
                    path: '/pages/create',
                    icon: 'Plus',
                    disabled: false,
                    external: false,
                  },
                ],
              },
              {
                title: 'Layouts',
                path: '/layouts',
                icon: 'Layout',
                caption: 'Manage layouts',
                disabled: false,
                external: false,
              },
              {
                title: 'Components',
                path: '/components',
                icon: 'Puzzle',
                caption: 'Manage components',
                disabled: false,
                external: false,
              },
              {
                title: 'Sites',
                path: '/sites',
                icon: 'Globe',
                caption: 'Manage sites',
                disabled: false,
                external: false,
              },
              {
                title: 'Settings',
                path: '/settings',
                icon: 'Settings',
                caption: 'System settings',
                disabled: false,
                external: false,
                level2Items: [
                  {
                    title: 'General',
                    path: '/settings/general',
                    icon: 'Cog',
                    disabled: false,
                    external: false,
                  },
                  {
                    title: 'Users',
                    path: '/settings/users',
                    icon: 'Users',
                    disabled: false,
                    external: false,
                  },
                  {
                    title: 'Roles',
                    path: '/settings/roles',
                    icon: 'Shield',
                    disabled: false,
                    external: false,
                  },
                ],
              },
            ],
          },
          config: {
            width: 300,
            collapsedWidth: 88,
          },
        },
        {
          blockType: 'footer',
          enabled: true,
          config: {
            showCopyright: true,
            showLinks: true,
          },
        },
        {
          blockType: 'navigation',
          enabled: true,
          items: [
            {
              label: 'Home',
              path: '/',
              icon: 'Home',
            },
            {
              label: 'About',
              path: '/about',
              icon: 'Info',
            },
            {
              label: 'Contact',
              path: '/contact',
              icon: 'Mail',
            },
          ],
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
    {
      name: 'Simple Layout',
      slug: 'simple-layout',
      description: 'Simple layout with minimal header',
      type: 'simple',
      status: 'published',
      components: [
        {
          blockType: 'header',
          enabled: true,
          config: {
            sticky: false,
            transparent: false,
          },
        },
        {
          blockType: 'footer',
          enabled: true,
          config: {
            showCopyright: true,
            showLinks: false,
          },
        },
      ],
    },
  ]

  for (const layoutData of layouts) {
    try {
      // Check if layout already exists
      const existing = await payload.find({
        collection: 'layouts',
        where: {
          slug: {
            equals: layoutData.slug,
          },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        // Update existing layout with components if not present
        const existingLayout = existing.docs[0]
        if (!existingLayout.components || existingLayout.components.length === 0) {
          await payload.update({
            collection: 'layouts',
            id: existingLayout.id,
            data: {
              components: layoutData.components || [],
            },
            overrideAccess: true,
          })
          console.log(`  🔄 Updated layout: ${layoutData.name} (${layoutData.slug}) with components`)
        } else {
          console.log(`  ⏭️  Layout "${layoutData.name}" (${layoutData.slug}) already exists with components, skipping...`)
        }
        continue
      }

      // Create layout
      const layout = await payload.create({
        collection: 'layouts',
        data: layoutData,
        overrideAccess: true,
      })

      console.log(`  ✅ Created layout: ${layout.name} (${layout.slug})`)
    } catch (error) {
      console.error(`  ❌ Error creating layout "${layoutData.name}":`, error)
    }
  }

  console.log('✨ Layouts seeding completed!')
}

