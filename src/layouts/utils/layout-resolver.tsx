import { getPayload } from 'payload'
import config from '@/payload.config'
import { MainLayout } from '../main/layout'
import { SimpleLayout } from '../simple/layout'
import { BlankLayout } from '../blank/layout'
import {
  LayoutBlocksRenderer,
  extractNavigationItems,
  extractSidebarMenuItems,
} from '@/components/blocks/layout-blocks-renderer'

export type LayoutType = 'main' | 'simple' | 'blank' | 'auth'

export type LayoutResolverProps = {
  layoutType: LayoutType
  children: React.ReactNode
  siteId?: string
  layoutId?: string
}

/**
 * Resolve and render the appropriate layout based on layout type
 * Uses blocks from Layouts collection to configure layout components
 */
export async function LayoutResolver({
  layoutType,
  children,
  siteId,
  layoutId,
}: LayoutResolverProps) {
  let layoutData = null
  let navData: Array<{ title: string; path: string; icon?: string }> = []
  let sidebarMenuData: Array<{
    title: string
    path?: string
    icon?: string
    caption?: string
    disabled?: boolean
    external?: boolean
    children?: any[]
  }> = []
  let headerConfig = null
  let footerConfig = null
  let sidebarConfig = null
  let sidebarEnabled = false

  // Fetch layout data from Payload if layoutId is provided
  if (layoutId) {
    try {
      const payload = await getPayload({ config })
      const layout = await payload.findByID({
        collection: 'layouts',
        id: layoutId,
        depth: 3, // Increased depth to get component relationships
      })

      if (layout) {
        layoutData = layout
        // Process layout blocks
        if (layout.components && Array.isArray(layout.components)) {
          const blocksData = LayoutBlocksRenderer({ blocks: layout.components })

          // Extract navigation
          if (blocksData.navigation) {
            navData = extractNavigationItems(blocksData.navigation)
          }

          // Extract header config
          if (blocksData.header?.enabled) {
            headerConfig = blocksData.header.config
          }

          // Extract footer config
          if (blocksData.footer?.enabled) {
            footerConfig = blocksData.footer.config
          }

          // Extract sidebar config and menu
          if (blocksData.sidebar) {
            sidebarEnabled = blocksData.sidebar.enabled || false
            sidebarConfig = blocksData.sidebar.config
            sidebarMenuData = extractSidebarMenuItems(blocksData.sidebar)
            console.log('🔍 Sidebar extracted from layout:', {
              enabled: sidebarEnabled,
              menuItemsCount: sidebarMenuData.length,
              hasConfig: !!sidebarConfig,
            })
          }
        }
      }
    } catch (error) {
      console.error('Error fetching layout:', error)
    }
  }

  // Fetch site data if siteId is provided
  if (siteId && !layoutData) {
    try {
      const payload = await getPayload({ config })
      const site = await payload.findByID({
        collection: 'sites',
        id: siteId,
        depth: 3, // Increased depth to get layout with components
      })

      if (site?.defaultLayout && typeof site.defaultLayout === 'object') {
        layoutData = site.defaultLayout
        if (layoutData.components && Array.isArray(layoutData.components)) {
          const blocksData = LayoutBlocksRenderer({ blocks: layoutData.components })

          // Extract navigation
          if (blocksData.navigation) {
            navData = extractNavigationItems(blocksData.navigation)
          }

          // Extract header config
          if (blocksData.header?.enabled) {
            headerConfig = blocksData.header.config
          }

          // Extract footer config
          if (blocksData.footer?.enabled) {
            footerConfig = blocksData.footer.config
          }

          // Extract sidebar config and menu
          if (blocksData.sidebar) {
            sidebarEnabled = blocksData.sidebar.enabled || false
            sidebarConfig = blocksData.sidebar.config
            sidebarMenuData = extractSidebarMenuItems(blocksData.sidebar)
            console.log('🔍 Sidebar extracted from site layout:', {
              enabled: sidebarEnabled,
              menuItemsCount: sidebarMenuData.length,
              hasConfig: !!sidebarConfig,
            })
          }
        }
      }
    } catch (error) {
      console.error('Error fetching site:', error)
    }
  }

  // Render appropriate layout based on type with blocks configuration
  switch (layoutType) {
    case 'main':
      return (
        <MainLayout
          data={{
            nav: navData,
            sidebarNav: sidebarMenuData.length > 0 ? sidebarMenuData : navData,
            header: headerConfig,
            footer: footerConfig,
            sidebar: sidebarConfig,
          }}
          sidebar={{ enabled: sidebarEnabled }}
        >
          {children}
        </MainLayout>
      )
    case 'simple':
      return (
        <SimpleLayout
          data={{
            header: headerConfig,
            footer: footerConfig,
          }}
        >
          {children}
        </SimpleLayout>
      )
    case 'blank':
      return <BlankLayout>{children}</BlankLayout>
    default:
      return (
        <MainLayout
          data={{
            nav: navData,
            sidebarNav: sidebarMenuData.length > 0 ? sidebarMenuData : navData,
            header: headerConfig,
            footer: footerConfig,
            sidebar: sidebarConfig,
          }}
          sidebar={{ enabled: sidebarEnabled }}
        >
          {children}
        </MainLayout>
      )
  }
}

