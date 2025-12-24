'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

export type NavSidebarItemData = {
  title: string
  path?: string
  icon?: string
  caption?: string
  disabled?: boolean
  external?: boolean
  children?: NavSidebarItemData[]
}

export type NavSidebarItemProps = {
  item: NavSidebarItemData
  depth?: number
  isCollapsed?: boolean
}

export function NavSidebarItem({ item, depth = 0, isCollapsed = false }: NavSidebarItemProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  
  // Check if current path matches or is a child path
  const isActive = item.path
    ? pathname === item.path || (hasChildren && pathname.startsWith(item.path + '/'))
    : false

  // Auto-open if active and has children
  useEffect(() => {
    if (isActive && hasChildren) {
      setOpen(true)
    }
  }, [isActive, hasChildren])

  // Max depth is 3 levels (0, 1, 2)
  if (depth >= 3) {
    return null
  }

  const handleToggle = () => {
    if (hasChildren) {
      setOpen(!open)
    }
  }

  // Render icon from string name
  const renderIcon = () => {
    if (!item.icon) return null

    // If icon is a React component (already rendered)
    if (typeof item.icon === 'object') {
      return <span className="flex-shrink-0">{item.icon}</span>
    }

    // If icon is a string, try to get from lucide-react
    const iconName = item.icon.charAt(0).toUpperCase() + item.icon.slice(1).replace(/-/g, '')
    const IconComponent = (LucideIcons as any)[iconName] || (LucideIcons as any)[item.icon]

    if (IconComponent) {
      return (
        <IconComponent className="h-5 w-5 flex-shrink-0" />
      )
    }

    // Fallback: render as text/emoji
    return <span className="flex-shrink-0 text-base">{item.icon}</span>
  }

  const itemContent = (
    <>
      {renderIcon()}
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.title}</span>
          {hasChildren && (
            <ChevronDown
              className={cn(
                'h-4 w-4 flex-shrink-0 transition-transform',
                open && 'rotate-180',
              )}
            />
          )}
        </>
      )}
    </>
  )

  if (hasChildren) {
    return (
      <div className={cn('space-y-1', depth > 0 && 'ml-4')}>
        <button
          onClick={handleToggle}
          disabled={item.disabled}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            depth === 0
              ? isActive
                ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
                : 'text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]'
              : 'text-[var(--sidebar-foreground)]/60 hover:text-[var(--sidebar-foreground)]/80',
            item.disabled && 'opacity-50 cursor-not-allowed',
            isCollapsed && 'justify-center',
          )}
          title={isCollapsed ? item.title : undefined}
        >
          {itemContent}
        </button>

        {open && !isCollapsed && (
          <div className="ml-4 space-y-1 border-l border-[var(--sidebar-border)] pl-2">
            {item.children?.map((child, index) => (
              <NavSidebarItem
                key={`${child.title}-${index}`}
                item={child}
                depth={depth + 1}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!item.path) {
    return null
  }

  const linkProps = item.external
    ? {
        href: item.path,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {
        href: item.path,
      }

  return (
    <Link
      {...linkProps}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        depth === 0
          ? isActive
            ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
            : 'text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]'
          : isActive
            ? 'bg-[var(--sidebar-accent)]/50 text-[var(--sidebar-accent-foreground)]'
            : 'text-[var(--sidebar-foreground)]/60 hover:bg-[var(--sidebar-accent)]/30 hover:text-[var(--sidebar-foreground)]/80',
        item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        isCollapsed && 'justify-center',
        depth > 0 && 'ml-4',
      )}
      title={isCollapsed ? item.title : undefined}
    >
      {itemContent}
    </Link>
  )
}

