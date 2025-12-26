'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export interface StatusTab {
  /** Unique identifier for the tab */
  value: string
  /** Display label */
  label: string
  /** Count to display */
  count?: number
  /** Badge color variant */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
  /** Custom badge className for colors */
  badgeClassName?: string
}

interface DataTableStatusTabsProps {
  tabs: StatusTab[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
  /** Show "All" tab with total count */
  showAllTab?: boolean
  /** Label for "All" tab */
  allTabLabel?: string
  /** Total count for "All" tab (auto-calculated if not provided) */
  totalCount?: number
}

const badgeVariantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border border-input bg-background',
  success: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-500 border-red-500/30',
}

export function DataTableStatusTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  showAllTab = true,
  allTabLabel = 'All',
  totalCount,
}: DataTableStatusTabsProps) {
  // Calculate total if not provided
  const calculatedTotal = totalCount ?? tabs.reduce((sum, tab) => sum + (tab.count || 0), 0)

  // Filter out any existing "all" tab to avoid duplicates
  const filteredTabs = showAllTab ? tabs.filter((tab) => tab.value !== 'all') : tabs

  // All tabs including "All" tab
  const allTabs: StatusTab[] = showAllTab
    ? [{ value: 'all', label: allTabLabel, count: calculatedTotal, variant: 'outline' }, ...filteredTabs]
    : filteredTabs

  return (
    <div className={cn('flex flex-wrap items-center gap-1 border-b pb-4', className)}>
      {allTabs.map((tab) => {
        const isActive = activeTab === tab.value
        const badgeClass = tab.badgeClassName || badgeVariantClasses[tab.variant || 'secondary']

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground',
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <Badge
                variant="outline"
                className={cn(
                  'ml-1 h-5 min-w-[20px] justify-center rounded px-1.5 text-xs font-semibold',
                  badgeClass,
                )}
              >
                {tab.count.toLocaleString()}
              </Badge>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Helper to generate status tabs from data
export function generateStatusTabs<T>(
  data: T[],
  statusField: keyof T,
  config: {
    statuses: Array<{
      value: string
      label: string
      variant?: StatusTab['variant']
      badgeClassName?: string
    }>
    defaultStatus?: string
  },
): StatusTab[] {
  const counts = new Map<string, number>()

  // Initialize counts
  config.statuses.forEach((s) => counts.set(s.value, 0))

  // Count items
  data.forEach((item) => {
    const status = (item[statusField] as string) || config.defaultStatus || 'unknown'
    counts.set(status, (counts.get(status) || 0) + 1)
  })

  return config.statuses.map((s) => ({
    ...s,
    count: counts.get(s.value) || 0,
  }))
}

