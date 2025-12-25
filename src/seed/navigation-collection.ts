import { getPayload } from 'payload'
import config from '../payload.config'
import { batchSeed } from './utils/batch-seeder'

/**
 * Seed Navigation Collection
 * 
 * Creates navigation menus from the navigation blocks data
 */
export async function seedNavigationCollection() {
  const payload = await getPayload({ config })

  console.log('🧭 Seeding Navigation Collection...')

  const navigationMenus = [
    {
      name: 'Main Sidebar Navigation',
      slug: 'main-sidebar-nav',
      description: 'Main sidebar navigation for the admin dashboard',
      location: 'sidebar' as const,
      status: 'published' as const,
      items: [
        // ============================================
        // General Section
        // ============================================
        {
          title: 'Dashboard',
          path: '/dashboard',
          icon: 'LayoutDashboard',
          groupLabel: 'General',
          order: 1,
          children: [
            {
              title: 'Dashboard 1',
              path: '/dashboard/1',
              order: 1,
            },
            {
              title: 'Dashboard 2',
              path: '/dashboard/2',
              order: 2,
            },
            {
              title: 'Dashboard 3',
              path: '/dashboard/3',
              order: 3,
            },
          ],
        },
        {
          title: 'Tasks',
          path: '/tasks',
          icon: 'CheckSquare',
          order: 2,
        },
        {
          title: 'Users',
          path: '/users',
          icon: 'Users',
          order: 3,
        },
        {
          title: 'Lists',
          icon: 'List',
          order: 4,
          children: [
            {
              title: 'All Lists',
              path: '/lists/all',
              icon: 'ListChecks',
              order: 1,
            },
            {
              title: 'Active Lists',
              path: '/lists/active',
              icon: 'ListCheck',
              order: 2,
            },
            {
              title: 'Archived Lists',
              path: '/lists/archived',
              icon: 'Archive',
              order: 3,
            },
          ],
        },
        // ============================================
        // Pages Section
        // ============================================
        {
          title: 'Auth',
          icon: 'ShieldCheck',
          groupLabel: 'Pages',
          order: 5,
          children: [
            {
              title: 'Login',
              path: '/auth/login',
              order: 1,
            },
            {
              title: 'Register',
              path: '/auth/register',
              order: 2,
            },
            {
              title: 'Forgot Password',
              path: '/auth/forgot-password',
              order: 3,
            },
          ],
        },
        {
          title: 'Error Pages',
          icon: 'AlertTriangle',
          order: 6,
          children: [
            {
              title: '401 - Unauthorized',
              path: '/errors/401',
              icon: 'Lock',
              order: 1,
            },
            {
              title: '403 - Forbidden',
              path: '/errors/403',
              icon: 'Ban',
              order: 2,
            },
            {
              title: '404 - Not Found',
              path: '/errors/404',
              icon: 'FileQuestion',
              order: 3,
            },
            {
              title: '500 - Server Error',
              path: '/errors/500',
              icon: 'ServerCrash',
              order: 4,
            },
            {
              title: '503 - Maintenance',
              path: '/errors/503',
              icon: 'Construction',
              order: 5,
            },
          ],
        },
        // ============================================
        // Other Section
        // ============================================
        {
          title: 'Settings',
          icon: 'Settings',
          groupLabel: 'Other',
          order: 7,
          children: [
            {
              title: 'General',
              path: '/settings/general',
              icon: 'Wrench',
              order: 1,
            },
            {
              title: 'Profile',
              path: '/settings/profile',
              icon: 'User',
              order: 2,
            },
            {
              title: 'Billing',
              path: '/settings/billing',
              icon: 'DollarSign',
              order: 3,
            },
            {
              title: 'Plans',
              path: '/settings/plans',
              icon: 'Package',
              order: 4,
            },
            {
              title: 'Connected Apps',
              path: '/settings/apps',
              icon: 'Grid3x3',
              order: 5,
            },
            {
              title: 'Notifications',
              path: '/settings/notifications',
              icon: 'Bell',
              order: 6,
            },
          ],
        },
        {
          title: 'Developers',
          path: '/developers',
          icon: 'Code',
          order: 8,
        },
      ],
    },
    {
      name: 'Simple Top Navigation',
      slug: 'simple-top-nav',
      description: 'Simple horizontal top navigation',
      location: 'topbar' as const,
      status: 'published' as const,
      items: [
        {
          title: 'Home',
          path: '/',
          icon: 'Home',
          order: 1,
        },
        {
          title: 'About',
          path: '/about',
          icon: 'Info',
          order: 2,
        },
        {
          title: 'Contact',
          path: '/contact',
          icon: 'Mail',
          order: 3,
        },
      ],
    },
    {
      name: 'Footer Navigation',
      slug: 'footer-nav',
      description: 'Footer links navigation',
      location: 'footer' as const,
      status: 'published' as const,
      items: [
        {
          title: 'Privacy Policy',
          path: '/privacy',
          order: 1,
        },
        {
          title: 'Terms of Service',
          path: '/terms',
          order: 2,
        },
        {
          title: 'Contact Us',
          path: '/contact',
          order: 3,
        },
        {
          title: 'Documentation',
          path: '/docs',
          external: true,
          order: 4,
        },
      ],
    },
  ]

  // Batch seed navigation menus
  await batchSeed(payload, {
    collection: 'navigation',
    data: navigationMenus,
    uniqueField: 'slug',
    batchSize: 10,
  })

  console.log('✨ Navigation collection seeding completed!')
}

