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

          // Extract top navigation (for desktop nav)
          if (blocksData.blockRefs.navigation) {
            try {
              const navBlock = await payload.findByID({
                collection: 'blocks',
                id: blocksData.blockRefs.navigation,
                depth: 2,
              })

              console.log('🔍 Fetched navigation block:', {
                id: navBlock?.id,
                name: navBlock?.name,
                hasBlocks: Array.isArray(navBlock?.blocks),
              })

              // Extract navigation items
              let navigationItems: any[] = []

              if (navBlock && 'items' in navBlock && Array.isArray((navBlock as any).items)) {
                navigationItems = (navBlock as any).items
              } else if (navBlock?.blocks && Array.isArray(navBlock.blocks)) {
                const navBlockInner = navBlock.blocks.find((b: any) => b.blockType === 'navigation')
                if (
                  navBlockInner &&
                  'items' in navBlockInner &&
                  Array.isArray((navBlockInner as any).items)
                ) {
                  navigationItems = (navBlockInner as any).items
                }
              }

              if (navigationItems.length > 0) {
                navData = navigationItems.map((item: any) => ({
                  title: item.title,
                  path: item.path,
                  icon: item.icon,
                }))
                console.log('✅ Extracted top navigation items:', navData.length)
              }
            } catch (error) {
              console.error('Error fetching navigation block:', error)
            }
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
            sidebarEnabled = blocksData.sidebar.enabled !== false // Enabled by default if block exists
            sidebarConfig = blocksData.sidebar.props || blocksData.sidebar.config

            // If sidebar is a sectionRef, fetch the actual section
            if (blocksData.blockRefs.sidebar) {
              try {
                const sidebarBlock = await payload.findByID({
                  collection: 'blocks',
                  id: blocksData.blockRefs.sidebar,
                  depth: 2,
                })

                console.log('🔍 Fetched sidebar block:', {
                  id: sidebarBlock?.id,
                  name: sidebarBlock?.name,
                  hasBlocks: Array.isArray(sidebarBlock?.blocks),
                  blocksCount: sidebarBlock?.blocks?.length || 0,
                  hasDirectItems: 'items' in (sidebarBlock || {}),
                })

                // Extract navigation from section
                // Navigation blocks have a nested structure: blocks[0].items
                let navigationItems: any[] = []

                // Check if items are at root level (flattened by Payload)
                if (
                  sidebarBlock &&
                  'items' in sidebarBlock &&
                  Array.isArray((sidebarBlock as any).items)
                ) {
                  navigationItems = (sidebarBlock as any).items
                  console.log('✅ Found items at root level:', navigationItems.length)
                }
                // Check if items are in blocks array (nested structure)
                else if (
                  sidebarBlock?.blocks &&
                  Array.isArray(sidebarBlock.blocks) &&
                  sidebarBlock.blocks.length > 0
                ) {
                  const navigationBlock = sidebarBlock.blocks.find(
                    (b: any) => b.blockType === 'navigation',
                  )
                  if (
                    navigationBlock &&
                    'items' in navigationBlock &&
                    Array.isArray((navigationBlock as any).items)
                  ) {
                    navigationItems = (navigationBlock as any).items
                    console.log('✅ Found items in blocks[].items:', navigationItems.length)
                  }
                }

                if (navigationItems.length > 0) {
                  sidebarMenuData = navigationItems.map((item: any) => ({
                    title: item.title,
                    path: item.path,
                    icon: item.icon,
                    caption: item.caption,
                    disabled: item.disabled,
                    external: item.external,
                    groupLabel: item.groupLabel,
                    children: item.children?.map((child: any) => ({
                      title: child.title,
                      path: child.path,
                      icon: child.icon,
                      caption: child.caption,
                      disabled: child.disabled,
                      external: child.external,
                    })),
                  }))
                  console.log('✅ Extracted navigation items:', sidebarMenuData.length)
                } else {
                  console.warn('⚠️ No navigation items found in sidebar block')
                }
              } catch (error) {
                console.error('Error fetching sidebar section:', error)
              }
            } else {
              // Fallback to direct sidebar extraction
              sidebarMenuData = extractSidebarMenuItems(blocksData.sidebar)
            }

            console.log('🔍 Sidebar extracted from layout:', {
              enabled: sidebarEnabled,
              menuItemsCount: sidebarMenuData.length,
              hasConfig: !!sidebarConfig,
              sectionId: blocksData.blockRefs.sidebar,
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

          // Extract top navigation (for desktop nav)
          if (blocksData.blockRefs.navigation) {
            try {
              const navBlock = await payload.findByID({
                collection: 'blocks',
                id: blocksData.blockRefs.navigation,
                depth: 2,
              })

              console.log('🔍 Fetched navigation block (site):', {
                id: navBlock?.id,
                name: navBlock?.name,
                hasBlocks: Array.isArray(navBlock?.blocks),
              })

              // Extract navigation items
              let navigationItems: any[] = []

              if (navBlock && 'items' in navBlock && Array.isArray((navBlock as any).items)) {
                navigationItems = (navBlock as any).items
              } else if (navBlock?.blocks && Array.isArray(navBlock.blocks)) {
                const navBlockInner = navBlock.blocks.find((b: any) => b.blockType === 'navigation')
                if (
                  navBlockInner &&
                  'items' in navBlockInner &&
                  Array.isArray((navBlockInner as any).items)
                ) {
                  navigationItems = (navBlockInner as any).items
                }
              }

              if (navigationItems.length > 0) {
                navData = navigationItems.map((item: any) => ({
                  title: item.title,
                  path: item.path,
                  icon: item.icon,
                }))
                console.log('✅ Extracted top navigation items (site):', navData.length)
              }
            } catch (error) {
              console.error('Error fetching navigation block (site):', error)
            }
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
            sidebarEnabled = blocksData.sidebar.enabled !== false // Enabled by default if block exists
            sidebarConfig = blocksData.sidebar.props || blocksData.sidebar.config

            // If sidebar is a sectionRef, fetch the actual section
            if (blocksData.blockRefs.sidebar) {
              try {
                const sidebarBlock = await payload.findByID({
                  collection: 'blocks',
                  id: blocksData.blockRefs.sidebar,
                  depth: 2,
                })

                console.log('🔍 Fetched sidebar block (site):', {
                  id: sidebarBlock?.id,
                  name: sidebarBlock?.name,
                  hasBlocks: Array.isArray(sidebarBlock?.blocks),
                  blocksCount: sidebarBlock?.blocks?.length || 0,
                  hasDirectItems: 'items' in (sidebarBlock || {}),
                })

                // Extract navigation from section
                // Navigation blocks have a nested structure: blocks[0].items
                let navigationItems: any[] = []

                // Check if items are at root level (flattened by Payload)
                if (
                  sidebarBlock &&
                  'items' in sidebarBlock &&
                  Array.isArray((sidebarBlock as any).items)
                ) {
                  navigationItems = (sidebarBlock as any).items
                  console.log('✅ Found items at root level (site):', navigationItems.length)
                }
                // Check if items are in blocks array (nested structure)
                else if (
                  sidebarBlock?.blocks &&
                  Array.isArray(sidebarBlock.blocks) &&
                  sidebarBlock.blocks.length > 0
                ) {
                  const navigationBlock = sidebarBlock.blocks.find(
                    (b: any) => b.blockType === 'navigation',
                  )
                  if (
                    navigationBlock &&
                    'items' in navigationBlock &&
                    Array.isArray((navigationBlock as any).items)
                  ) {
                    navigationItems = (navigationBlock as any).items
                    console.log('✅ Found items in blocks[].items (site):', navigationItems.length)
                  }
                }

                if (navigationItems.length > 0) {
                  sidebarMenuData = navigationItems.map((item: any) => ({
                    title: item.title,
                    path: item.path,
                    icon: item.icon,
                    caption: item.caption,
                    disabled: item.disabled,
                    external: item.external,
                    groupLabel: item.groupLabel,
                    children: item.children?.map((child: any) => ({
                      title: child.title,
                      path: child.path,
                      icon: child.icon,
                      caption: child.caption,
                      disabled: child.disabled,
                      external: child.external,
                    })),
                  }))
                  console.log('✅ Extracted navigation items (site):', sidebarMenuData.length)
                } else {
                  console.warn('⚠️ No navigation items found in sidebar block (site)')
                }
              } catch (error) {
                console.error('Error fetching sidebar section:', error)
              }
            } else {
              // Fallback to direct sidebar extraction
              sidebarMenuData = extractSidebarMenuItems(blocksData.sidebar)
            }

            console.log('🔍 Sidebar extracted from site layout:', {
              enabled: sidebarEnabled,
              menuItemsCount: sidebarMenuData.length,
              hasConfig: !!sidebarConfig,
              sectionId: blocksData.blockRefs.sidebar,
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
