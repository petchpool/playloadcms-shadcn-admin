'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SidebarToggleButtonProps = {
  isCollapsed: boolean
  onClick: () => void
  className?: string
}

export function SidebarToggleButton({
  isCollapsed,
  onClick,
  className,
}: SidebarToggleButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn(
        'fixed top-6 z-[1102] hidden h-8 w-8 -translate-x-1/2 rounded-full border bg-background shadow-md transition-[left] lg:flex',
        isCollapsed ? 'left-[88px]' : 'left-[300px]',
        className,
      )}
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

