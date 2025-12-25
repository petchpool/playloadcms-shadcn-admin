'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDataByKey, getValueByPath } from './data-context'
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Box,
  ShoppingCart,
  FileText,
  Image,
  Settings,
  Activity,
  BarChart3,
  PieChart,
  Layers,
  Database,
  Globe,
  Mail,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Available icon options for stat cards
 */
const iconMap: Record<string, LucideIcon> = {
  users: Users,
  dollar: DollarSign,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  box: Box,
  cart: ShoppingCart,
  file: FileText,
  image: Image,
  settings: Settings,
  activity: Activity,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  layers: Layers,
  database: Database,
  globe: Globe,
  mail: Mail,
  bell: Bell,
  calendar: Calendar,
  clock: Clock,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'alert-circle': AlertCircle,
}

/**
 * Format options for displaying values
 */
type FormatConfig = {
  /** Prefix (e.g., "$", "฿") */
  prefix?: string
  /** Suffix (e.g., "%", " users") */
  suffix?: string
  /** Number of decimal places */
  decimals?: number
  /** Use locale number formatting */
  useLocale?: boolean
  /** Locale for number formatting */
  locale?: string
}

/**
 * Props for StatCardBlock component
 */
export type StatCardBlockProps = {
  /** Card title */
  title: string
  /** Card description */
  description?: string
  /** Icon to display */
  icon?: string
  /** Data key to reference (from DataFetchBlock) */
  dataKey?: string
  /** Path to value in data (dot notation) */
  valueField?: string
  /** Static value (if not using dataKey) */
  staticValue?: number | string
  /** Format configuration */
  format?: FormatConfig
  /** Trend indicator */
  trend?: {
    /** Trend value (positive or negative number) */
    value?: number
    /** Trend label (e.g., "vs last month") */
    label?: string
    /** Invert trend colors (positive = bad, negative = good) */
    invertColors?: boolean
  }
  /** Card variant */
  variant?: 'default' | 'gradient' | 'outline' | 'filled'
  /** Card size */
  size?: 'sm' | 'md' | 'lg'
  /** Custom CSS class */
  className?: string
  /** Click handler */
  onClick?: () => void
}

/**
 * Format a number value
 */
function formatValue(value: any, format?: FormatConfig): string {
  if (value === null || value === undefined) return '-'

  let numValue = typeof value === 'number' ? value : parseFloat(value)

  if (isNaN(numValue)) {
    // Return as string if not a valid number
    return `${format?.prefix || ''}${value}${format?.suffix || ''}`
  }

  // Apply decimals
  if (format?.decimals !== undefined) {
    numValue = Number(numValue.toFixed(format.decimals))
  }

  // Format with locale
  let formatted: string
  if (format?.useLocale !== false) {
    formatted = numValue.toLocaleString(format?.locale || 'en-US')
  } else {
    formatted = numValue.toString()
  }

  return `${format?.prefix || ''}${formatted}${format?.suffix || ''}`
}

/**
 * StatCardBlock - A card component that displays statistics from DataFetch context
 *
 * Can be used:
 * 1. Inside DataFetchBlock with dataKey reference
 * 2. Standalone with staticValue
 *
 * @example
 * ```tsx
 * // Inside DataFetchBlock
 * <DataFetchBlock dataKey="users" source={{ type: 'collection', collection: 'users' }} transform={{ type: 'count' }}>
 *   <StatCardBlock
 *     title="Total Users"
 *     dataKey="users"
 *     valueField="value"
 *     icon="users"
 *   />
 * </DataFetchBlock>
 *
 * // Standalone
 * <StatCardBlock
 *   title="Static Value"
 *   staticValue={1234}
 *   icon="box"
 * />
 * ```
 */
export function StatCardBlock({
  title,
  description,
  icon = 'box',
  dataKey,
  valueField = 'value',
  staticValue,
  format,
  trend,
  variant = 'default',
  size = 'md',
  className,
  onClick,
}: StatCardBlockProps) {
  // Get data from context if dataKey is provided
  const contextData = useDataByKey(dataKey || '')

  // Determine value source
  const isUsingContext = !!dataKey
  const loading = isUsingContext ? contextData.loading : false
  const error = isUsingContext ? contextData.error : undefined

  // Get the actual value
  let value: any
  if (staticValue !== undefined) {
    value = staticValue
  } else if (isUsingContext && contextData.data !== null) {
    value = getValueByPath(contextData, valueField)
  }

  // Get icon component
  const IconComponent = iconMap[icon] || Box

  // Size classes
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const valueSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  // Variant classes
  const variantClasses = {
    default: '',
    gradient: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
    outline: 'bg-transparent border-2',
    filled: 'bg-primary text-primary-foreground',
  }

  return (
    <Card
      className={cn(
        'transition-all duration-200',
        variantClasses[variant],
        onClick && 'cursor-pointer hover:shadow-md',
        className,
      )}
      onClick={onClick}
    >
      <CardHeader
        className={cn('flex flex-row items-center justify-between space-y-0 pb-2', sizeClasses[size])}
      >
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconComponent
          className={cn(
            iconSizeClasses[size],
            variant === 'filled' ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        />
      </CardHeader>
      <CardContent className={cn(sizeClasses[size], 'pt-0')}>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Error</span>
          </div>
        ) : (
          <>
            <div className={cn('font-bold', valueSizeClasses[size])}>
              {formatValue(value, format)}
            </div>

            {/* Description */}
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}

            {/* Trend indicator */}
            {trend && trend.value !== undefined && (
              <div className="mt-2 flex items-center gap-1 text-sm">
                {trend.value >= 0 ? (
                  <TrendingUp
                    className={cn(
                      'h-4 w-4',
                      trend.invertColors ? 'text-destructive' : 'text-green-500',
                    )}
                  />
                ) : (
                  <TrendingDown
                    className={cn(
                      'h-4 w-4',
                      trend.invertColors ? 'text-green-500' : 'text-destructive',
                    )}
                  />
                )}
                <span
                  className={cn(
                    'font-medium',
                    trend.value >= 0
                      ? trend.invertColors
                        ? 'text-destructive'
                        : 'text-green-500'
                      : trend.invertColors
                        ? 'text-green-500'
                        : 'text-destructive',
                  )}
                >
                  {trend.value >= 0 ? '+' : ''}
                  {trend.value}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCardBlock

