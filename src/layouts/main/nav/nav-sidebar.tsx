'use client'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NavSidebarItem, type NavSidebarItemData } from './nav-sidebar-item'

export type NavSidebarProps = {
  data?: NavSidebarItemData[]
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export function NavSidebar({
  data = [],
  isCollapsed = false,
  onToggleCollapse,
  className,
}: NavSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-[1101] hidden h-screen flex-col border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-all duration-200 lg:flex',
        isCollapsed ? 'w-[88px]' : 'w-[300px]',
        className,
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          'flex items-center border-b border-[var(--sidebar-border)] px-4 py-4',
          isCollapsed && 'justify-center',
        )}
      >
        {!isCollapsed ? (
          <Logo className="text-[var(--sidebar-foreground)]" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]">
            <span className="text-sm font-bold">L</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-4">
          {data.map((item, index) => (
            <NavSidebarItem
              key={`${item.title}-${index}`}
              item={item}
              depth={0}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Toggle Button */}
      {onToggleCollapse && (
        <div className="border-t border-[var(--sidebar-border)] p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={cn(
              'w-full text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]',
              isCollapsed && 'justify-center',
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            {!isCollapsed && <span className="ml-2 text-xs">Collapse</span>}
          </Button>
        </div>
      )}
    </aside>
  )
}

