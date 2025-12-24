import { ComponentRenderer } from './component-renderer'
import type { Layout } from '@/payload-types'

export type LayoutBlocksRendererProps = {
  blocks: Layout['components']
}

export type ProcessedLayoutBlocks = {
  header: any | null
  footer: any | null
  sidebar: any | null
  navigation: any | null
  components: any[]
}

/**
 * Process layout blocks and group them by type
 * Returns structured data for layout components
 */
export function LayoutBlocksRenderer({ blocks }: LayoutBlocksRendererProps): ProcessedLayoutBlocks {
  if (!blocks || !Array.isArray(blocks)) {
    return {
      header: null,
      footer: null,
      sidebar: null,
      navigation: null,
      components: [],
    }
  }

  const blocksByType: Record<string, any[]> = {
    header: [],
    footer: [],
    sidebar: [],
    navigation: [],
    component: [],
  }

  // Group blocks by type
  blocks.forEach((block) => {
    const blockType = block.blockType
    if (blockType && blocksByType[blockType]) {
      blocksByType[blockType].push(block)
    }
  })

  return {
    header: blocksByType.header.length > 0 ? blocksByType.header[0] : null,
    footer: blocksByType.footer.length > 0 ? blocksByType.footer[0] : null,
    sidebar: blocksByType.sidebar.length > 0 ? blocksByType.sidebar[0] : null,
    navigation: blocksByType.navigation.length > 0 ? blocksByType.navigation[0] : null,
    components: blocksByType.component,
  }
}

/**
 * Extract navigation items from navigation block
 */
export function extractNavigationItems(navigationBlock: any): Array<{
  title: string
  path: string
  icon?: string
}> {
  if (!navigationBlock || navigationBlock.blockType !== 'navigation') {
    return []
  }

  if (!navigationBlock.items || !Array.isArray(navigationBlock.items)) {
    return []
  }

  return navigationBlock.items.map((item: any) => ({
    title: item.label || item.title || '',
    path: item.path || item.href || '#',
    icon: item.icon,
  }))
}

/**
 * Extract sidebar menu items from sidebar block (supports 3 levels of nesting)
 */
export function extractSidebarMenuItems(sidebarBlock: any): Array<{
  title: string
  path?: string
  icon?: string
  caption?: string
  disabled?: boolean
  external?: boolean
  children?: any[]
}> {
  if (!sidebarBlock || sidebarBlock.blockType !== 'sidebar') {
    return []
  }

  if (!sidebarBlock.menu?.items || !Array.isArray(sidebarBlock.menu.items)) {
    return []
  }

  const transformItem = (item: any): any => {
    const result: any = {
      title: item.title || '',
      path: item.path,
      icon: item.icon,
      caption: item.caption,
      disabled: item.disabled || false,
      external: item.external || false,
    }

    // Transform level2Items to children recursively (max 3 levels)
    // Note: Payload uses 'level2Items' and 'level3Items' field names to avoid relation conflicts
    // but we transform it to 'children' for component compatibility
    if (item.level2Items && Array.isArray(item.level2Items) && item.level2Items.length > 0) {
      result.children = item.level2Items.map((level2Item: any) => {
        const level2Result: any = {
          title: level2Item.title || '',
          path: level2Item.path,
          icon: level2Item.icon,
          caption: level2Item.caption,
          disabled: level2Item.disabled || false,
          external: level2Item.external || false,
        }

        // Transform level3Items to children
        if (level2Item.level3Items && Array.isArray(level2Item.level3Items) && level2Item.level3Items.length > 0) {
          level2Result.children = level2Item.level3Items.map((level3Item: any) => ({
            title: level3Item.title || '',
            path: level3Item.path,
            icon: level3Item.icon,
            caption: level3Item.caption,
            disabled: level3Item.disabled || false,
            external: level3Item.external || false,
          }))
        }

        return level2Result
      })
    }

    return result
  }

  return sidebarBlock.menu.items.map(transformItem)
}

/**
 * Render a single layout block
 */
export function LayoutBlockRenderer({ block }: { block: any }) {
  if (!block) return null

  switch (block.blockType) {
    case 'header':
      return (
        <div className="layout-block-header" data-enabled={block.enabled}>
          {block.enabled && block.config && (
            <div className="header-config" data-config={JSON.stringify(block.config)} />
          )}
        </div>
      )

    case 'footer':
      return (
        <div className="layout-block-footer" data-enabled={block.enabled}>
          {block.enabled && block.config && (
            <div className="footer-config" data-config={JSON.stringify(block.config)} />
          )}
        </div>
      )

    case 'sidebar':
      return (
        <div className="layout-block-sidebar" data-enabled={block.enabled}>
          {block.enabled && block.config && (
            <div className="sidebar-config" data-config={JSON.stringify(block.config)} />
          )}
        </div>
      )

    case 'navigation':
      return (
        <div className="layout-block-navigation" data-enabled={block.enabled}>
          {block.enabled && block.items && (
            <nav className="navigation-items">
              {block.items.map((item: any, index: number) => (
                <a
                  key={index}
                  href={item.path || item.href || '#'}
                  className="nav-item"
                  data-icon={item.icon}
                >
                  {item.label || item.title}
                </a>
              ))}
            </nav>
          )}
        </div>
      )

    case 'component':
      if (typeof block.component === 'object' && block.component && block.enabled) {
        return <ComponentRenderer component={block.component} props={block.props || {}} />
      }
      return null

    default:
      return null
  }
}
