import { AppSidebar, type SidebarMenuItemData } from '@/layouts/main/nav/app-sidebar'

export type NavigationBlock = {
  blockType: 'navigation'
  navigationId: string
  title?: string
  items: SidebarMenuItemData[]
}

export type NavigationBlockRendererProps = {
  block: NavigationBlock
  className?: string
}

/**
 * Renders a navigation block using the AppSidebar component
 */
export function NavigationBlockRenderer({ block, className }: NavigationBlockRendererProps) {
  if (!block.items || block.items.length === 0) {
    return null
  }

  return <AppSidebar data={block.items} className={className} />
}

