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
  groupLabel?: string
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
const SidebarMenuItemComponent = React.memo(function SidebarMenuItemComponent({
  item,
  depth = 0,
}: {
  item: SidebarMenuItemData
  depth?: number
}) {
  const pathname = usePathname()
  const isActive = Boolean(item.path && pathname === item.path)
  const hasChildren = Boolean(item.children && item.children.length > 0)
  
  // Calculate initial open state based on active children
  const hasActiveChild = React.useMemo(() => {
    if (!hasChildren || !item.children) return false
    return item.children.some((child) => child.path === pathname)
  }, [hasChildren, item.children, pathname])
  
  const [isOpen, setIsOpen] = React.useState(hasActiveChild)

  // Auto-open if active item is in children (only when hasActiveChild changes)
  React.useEffect(() => {
    if (hasActiveChild && !isOpen) {
      setIsOpen(true)
    }
  }, [hasActiveChild])

  if (hasChildren && item.children) {
    // Item with children - unified button with clickable link area
    const handleChevronClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(!isOpen)
    }

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <SidebarMenuItem>
          {item.path && !item.disabled ? (
            // Has link - make entire area clickable but chevron toggles submenu
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className="group/menu relative"
              asChild
            >
              {item.external ? (
                <a href={item.path} target="_blank" rel="noopener noreferrer">
                  {getIcon(item.icon)}
                  <span className="flex-1">{item.title}</span>
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded hover:bg-sidebar-accent/50"
                    onClick={handleChevronClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsOpen(!isOpen)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Toggle ${item.title} submenu`}
                  >
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                  </span>
                </a>
              ) : (
                <Link href={item.path}>
                  {getIcon(item.icon)}
                  <span className="flex-1">{item.title}</span>
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded hover:bg-sidebar-accent/50"
                    onClick={handleChevronClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsOpen(!isOpen)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Toggle ${item.title} submenu`}
                  >
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                  </span>
                </Link>
              )}
            </SidebarMenuButton>
          ) : (
            // No link - entire button toggles submenu
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title} isActive={isActive} disabled={item.disabled}>
                {getIcon(item.icon)}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
          )}
          
          <CollapsibleContent className="overflow-hidden transition-[height] duration-300 ease-in-out">
            <SidebarMenu className="mt-1 ml-3 border-l border-sidebar-border pl-2.5 space-y-1">
              {item.children.map((child, index) => (
                <SidebarMenuItemComponent
                  key={`${child.title}-${index}`}
                  item={child}
                  depth={depth + 1}
                />
              ))}
            </SidebarMenu>
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
})

export function AppSidebar({ data = [], className }: AppSidebarProps) {
  // Group items by groupLabel
  const groupedItems = React.useMemo(() => {
    const groups: { label: string | null; items: SidebarMenuItemData[] }[] = []
    let currentGroup: { label: string | null; items: SidebarMenuItemData[] } = {
      label: null,
      items: [],
    }

    data.forEach((item) => {
      if (item.groupLabel && item.groupLabel !== currentGroup.label) {
        // Start a new group
        if (currentGroup.items.length > 0) {
          groups.push(currentGroup)
        }
        currentGroup = { label: item.groupLabel, items: [item] }
      } else {
        currentGroup.items.push(item)
      }
    })

    // Push the last group
    if (currentGroup.items.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }, [data])

  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Application</span>
                <span className="truncate text-xs">Powered by Payload</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groupedItems.map((group, groupIndex) => (
          <SidebarGroup key={`group-${group.label || groupIndex}`}>
            {group.label && (
              <SidebarGroupLabel className="text-xs font-semibold">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, index) => (
                  <SidebarMenuItemComponent key={`${item.title}-${index}`} item={item} depth={0} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
