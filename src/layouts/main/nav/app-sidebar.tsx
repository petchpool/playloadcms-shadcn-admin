'use client'

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Logo } from '@/components/logo'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'

export type SidebarMenuItemData = {
  title: string
  path?: string
  icon?: string
  caption?: string
  disabled?: boolean
  external?: boolean
  children?: SidebarMenuItemData[]
}

export type AppSidebarProps = {
  data?: SidebarMenuItemData[]
  className?: string
}

/**
 * Get Lucide icon component by name
 */
function getIcon(iconName?: string) {
  if (!iconName) return null
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent ? <IconComponent className="h-4 w-4" /> : null
}

/**
 * Render a single menu item (supports nested children up to 3 levels)
 */
function SidebarMenuItemComponent({
  item,
  depth = 0,
}: {
  item: SidebarMenuItemData
  depth?: number
}) {
  const pathname = usePathname()
  const isActive = Boolean(item.path && pathname === item.path)
  const hasChildren = Boolean(item.children && item.children.length > 0)
  const [isOpen, setIsOpen] = React.useState(false)

  // Auto-open if active item is in children
  React.useEffect(() => {
    if (hasChildren && item.children) {
      const hasActiveChild = item.children.some((child) => {
        if (child.path === pathname) return true
        if (child.children) {
          return child.children.some((grandChild) => grandChild.path === pathname)
        }
        return false
      })
      if (hasActiveChild) setIsOpen(true)
    }
  }, [hasChildren, item.children, pathname])

  if (hasChildren && item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isActive} disabled={item.disabled}>
              {getIcon(item.icon)}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.children.map((child, index) => (
                  <SidebarMenuItemComponent
                    key={`${child.title}-${index}`}
                    item={child}
                    depth={depth + 1}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  if (item.path && !item.disabled) {
    if (item.external) {
      return (
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive}
            disabled={item.disabled}
            asChild
          >
            <a href={item.path} target="_blank" rel="noopener noreferrer">
              {getIcon(item.icon)}
              <span>{item.title}</span>
              {item.caption && (
                <span className="ml-auto text-xs text-sidebar-foreground/50">{item.caption}</span>
              )}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={isActive}
          disabled={item.disabled}
          asChild
        >
          <Link href={item.path}>
            {getIcon(item.icon)}
            <span>{item.title}</span>
            {item.caption && (
              <span className="ml-auto text-xs text-sidebar-foreground/50">{item.caption}</span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={item.title} isActive={isActive} disabled={item.disabled}>
        {getIcon(item.icon)}
        <span>{item.title}</span>
        {item.caption && (
          <span className="ml-auto text-xs text-sidebar-foreground/50">{item.caption}</span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ data = [], className }: AppSidebarProps) {
  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Logo className="text-sidebar-foreground" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item, index) => (
                <SidebarMenuItemComponent key={`${item.title}-${index}`} item={item} depth={0} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
