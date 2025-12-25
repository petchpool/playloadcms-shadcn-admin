import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { batchSeed } from './utils/batch-seeder'

/**
 * Navigation seed data based on the shadcnblocks admin kit design
 */
const navigationBlocks = [
  {
    name: 'Main Sidebar Navigation',
    slug: 'main-sidebar-nav',
    description: 'Main sidebar navigation for the admin dashboard',
    type: 'global' as const,
    category: 'header' as const,
    status: 'published' as const,
    blocks: [
      {
        blockType: 'navigation' as const,
        navigationId: 'main-sidebar',
        title: 'Main Sidebar Navigation',
        items: [
          // ============================================
          // General Section
          // ============================================
          {
            title: 'Dashboard',
            path: '/dashboard',
            icon: 'LayoutDashboard',
            groupLabel: 'General',
            children: [
              {
                title: 'Dashboard 1',
                path: '/dashboard/1',
              },
              {
                title: 'Dashboard 2',
                path: '/dashboard/2',
              },
              {
                title: 'Dashboard 3',
                path: '/dashboard/3',
              },
            ],
          },
          {
            title: 'Tasks',
            path: '/tasks',
            icon: 'CheckSquare',
          },
          {
            title: 'Users',
            path: '/users',
            icon: 'Users',
          },
          {
            title: 'Lists',
            icon: 'List',
            children: [
              {
                title: 'All Lists',
                path: '/lists/all',
                icon: 'ListChecks',
              },
              {
                title: 'Active Lists',
                path: '/lists/active',
                icon: 'ListCheck',
              },
              {
                title: 'Archived Lists',
                path: '/lists/archived',
                icon: 'Archive',
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
            children: [
              {
                title: 'Login',
                path: '/auth/login',
              },
              {
                title: 'Register',
                path: '/auth/register',
              },
              {
                title: 'Forgot Password',
                path: '/auth/forgot-password',
              },
            ],
          },
          {
            title: 'Error Pages',
            icon: 'AlertTriangle',
            children: [
              {
                title: '401 - Unauthorized',
                path: '/errors/401',
                icon: 'Lock',
              },
              {
                title: '403 - Forbidden',
                path: '/errors/403',
                icon: 'Ban',
              },
              {
                title: '404 - Not Found',
                path: '/errors/404',
                icon: 'FileQuestion',
              },
              {
                title: '500 - Server Error',
                path: '/errors/500',
                icon: 'ServerCrash',
              },
              {
                title: '503 - Maintenance',
                path: '/errors/503',
                icon: 'Construction',
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
            children: [
              {
                title: 'General',
                path: '/settings/general',
                icon: 'Wrench',
              },
              {
                title: 'Profile',
                path: '/settings/profile',
                icon: 'User',
              },
              {
                title: 'Billing',
                path: '/settings/billing',
                icon: 'DollarSign',
              },
              {
                title: 'Plans',
                path: '/settings/plans',
                icon: 'Package',
              },
              {
                title: 'Connected Apps',
                path: '/settings/apps',
                icon: 'Grid3x3',
              },
              {
                title: 'Notifications',
                path: '/settings/notifications',
                icon: 'Bell',
              },
            ],
          },
          {
            title: 'Developers',
            path: '/developers',
            icon: 'Code',
          },
        ],
      },
    ],
  },

  // ============================================
  // Alternative Navigation Examples
  // ============================================
  {
    name: 'Simple Top Navigation',
    slug: 'simple-top-nav',
    description: 'Simple horizontal navigation for header',
    type: 'global' as const,
    category: 'header' as const,
    status: 'published' as const,
    blocks: [
      {
        blockType: 'navigation' as const,
        navigationId: 'top-nav',
        title: 'Top Navigation',
        items: [
          {
            title: 'Home',
            path: '/',
            icon: 'Home',
          },
          {
            title: 'Products',
            path: '/products',
            icon: 'Package',
          },
          {
            title: 'About',
            path: '/about',
            icon: 'Info',
          },
          {
            title: 'Contact',
            path: '/contact',
            icon: 'Mail',
          },
        ],
      },
    ],
  },

  // ============================================
  // Footer Navigation
  // ============================================
  {
    name: 'Footer Navigation',
    slug: 'footer-nav',
    description: 'Footer navigation with multiple columns',
    type: 'global' as const,
    category: 'footer' as const,
    status: 'published' as const,
    blocks: [
      {
        blockType: 'navigation' as const,
        navigationId: 'footer-nav',
        title: 'Footer Navigation',
        items: [
          {
            title: 'Product',
            groupLabel: 'Product',
            children: [
              {
                title: 'Features',
                path: '/features',
              },
              {
                title: 'Pricing',
                path: '/pricing',
              },
              {
                title: 'FAQ',
                path: '/faq',
              },
            ],
          },
          {
            title: 'Company',
            groupLabel: 'Company',
            children: [
              {
                title: 'About Us',
                path: '/about',
              },
              {
                title: 'Careers',
                path: '/careers',
              },
              {
                title: 'Blog',
                path: '/blog',
              },
            ],
          },
          {
            title: 'Legal',
            groupLabel: 'Legal',
            children: [
              {
                title: 'Privacy Policy',
                path: '/privacy',
              },
              {
                title: 'Terms of Service',
                path: '/terms',
              },
              {
                title: 'Cookie Policy',
                path: '/cookies',
              },
            ],
          },
        ],
      },
    ],
  },
]

export async function seedNavigation() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding Navigation Blocks...')

  // Batch seed navigation blocks
  const result = await batchSeed(payload, {
    collection: 'blocks',
    data: navigationBlocks,
    uniqueField: 'slug',
    updateExisting: true, // Update existing navigation if changed
    batchSize: 10,
  })

  console.log('✨ Navigation seeding completed!')

  return [...result.created, ...result.updated, ...result.skipped]
}

// Run if called directly (ESM check)
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  seedNavigation()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error seeding navigation:', error)
      process.exit(1)
    })
}
