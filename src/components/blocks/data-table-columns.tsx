'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, ExternalLink, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Column configuration types
export type ColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'badge'
  | 'relationship'
  | 'image'
  | 'email'
  | 'url'
  | 'select'

export interface ColumnConfig {
  /** Field name/accessor key */
  field: string
  /** Display header label */
  label: string
  /** Column type for rendering */
  type?: ColumnType
  /** Enable sorting (default: true) */
  sortable?: boolean
  /** Enable hiding (default: true) */
  hideable?: boolean
  /** Initial visibility (default: true) */
  visible?: boolean
  /** Column width */
  width?: number | string
  /** Custom cell renderer */
  cell?: (value: any, row: any) => React.ReactNode
  /** Badge variant mapping for 'badge' type */
  badgeVariants?: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>
  /** Relationship field to display (for relationship type) */
  relationField?: string
  /** Date format string */
  dateFormat?: string
  /** Number format options */
  numberFormat?: Intl.NumberFormatOptions
}

export interface DataTableConfig {
  /** Collection slug */
  collection: string
  /** Column configurations */
  columns: ColumnConfig[]
  /** Enable row selection (default: true) */
  selectable?: boolean
  /** Enable row actions (default: true) */
  showActions?: boolean
  /** Custom row actions */
  actions?: Array<{
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: (row: any) => void
    variant?: 'default' | 'destructive'
  }>
  /** Fields to populate (relationships) */
  populate?: string[]
  /** Depth for populate (default: 1) */
  depth?: number
  /** Default sort */
  defaultSort?: {
    field: string
    order: 'asc' | 'desc'
  }
  /** Search fields */
  searchFields?: string[]
  /** Status tabs config */
  statusTabs?: {
    enabled: boolean
    field: string
    options: Array<{
      value: string
      label: string
      variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
    }>
  }
}

// Helper to format dates
const formatDate = (value: string | Date, format?: string): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (isNaN(date.getTime())) return '-'

  if (format === 'datetime') {
    return date.toLocaleString()
  }
  return date.toLocaleDateString()
}

// Helper to format numbers
const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('en-US', options).format(value)
}

// Generate columns from config
export function generateColumns<T>(config: DataTableConfig): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = []

  // Add select column if enabled
  if (config.selectable !== false) {
    columns.push({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    })
  }

  // Add configured columns
  config.columns.forEach((colConfig) => {
    const column: ColumnDef<T> = {
      accessorKey: colConfig.field,
      header: colConfig.sortable !== false
        ? ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-8 px-2"
            >
              {colConfig.label}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        : colConfig.label,
      enableSorting: colConfig.sortable !== false,
      enableHiding: colConfig.hideable !== false,
      cell: ({ row }) => {
        const value = row.getValue(colConfig.field)

        // Custom cell renderer
        if (colConfig.cell) {
          return colConfig.cell(value, row.original)
        }

        // Type-based rendering
        switch (colConfig.type) {
          case 'date':
            return <span className="text-sm">{formatDate(value as string)}</span>

          case 'datetime':
            return <span className="text-sm">{formatDate(value as string, 'datetime')}</span>

          case 'number':
            return (
              <span className="text-sm tabular-nums">
                {formatNumber(value as number, colConfig.numberFormat)}
              </span>
            )

          case 'boolean':
            return (
              <Badge variant={(value as boolean) ? 'default' : 'secondary'}>
                {(value as boolean) ? 'Yes' : 'No'}
              </Badge>
            )

          case 'badge':
            const badgeValue = (value as string) || 'unknown'
            const variant = colConfig.badgeVariants?.[badgeValue] || 'secondary'
            return (
              <Badge variant={variant} className="capitalize">
                {badgeValue}
              </Badge>
            )

          case 'relationship':
            if (!value) return <span className="text-muted-foreground">-</span>
            const relValue = typeof value === 'object' 
              ? (value as any)[colConfig.relationField || 'name'] || (value as any).id
              : value
            return <span className="text-sm">{relValue}</span>

          case 'image':
            if (!value) return <span className="text-muted-foreground">-</span>
            const imgUrl = typeof value === 'object' ? (value as any).url : value
            return (
              <img 
                src={imgUrl} 
                alt="" 
                className="h-8 w-8 rounded object-cover"
              />
            )

          case 'email':
            return (
              <a href={`mailto:${value}`} className="text-sm text-primary hover:underline">
                {value as string}
              </a>
            )

          case 'url':
            return (
              <a 
                href={value as string} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {value as string}
                <ExternalLink className="h-3 w-3" />
              </a>
            )

          case 'select':
            return (
              <Badge variant="outline" className="capitalize">
                {value as string}
              </Badge>
            )

          case 'text':
          default:
            if (value === null || value === undefined) {
              return <span className="text-muted-foreground">-</span>
            }
            return <span className="text-sm">{String(value)}</span>
        }
      },
    }

    // Set initial visibility
    if (colConfig.visible === false) {
      (column as any).meta = { ...(column as any).meta, defaultHidden: true }
    }

    columns.push(column)
  })

  // Add actions column if enabled
  if (config.showActions !== false) {
    columns.push({
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original as any

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {config.actions?.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(item)}
                  className={action.variant === 'destructive' ? 'text-destructive' : ''}
                >
                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}

// Preset column configs for common collections
export const collectionColumnPresets: Record<string, ColumnConfig[]> = {
  users: [
    { field: 'email', label: 'Email', type: 'email' },
    { field: 'firstName', label: 'First Name', type: 'text' },
    { field: 'lastName', label: 'Last Name', type: 'text' },
    { field: 'status', label: 'Status', type: 'badge', badgeVariants: { active: 'default', inactive: 'secondary', suspended: 'destructive' } },
    { field: 'createdAt', label: 'Created', type: 'date' },
  ],
  pages: [
    { field: 'title', label: 'Title', type: 'text' },
    { field: 'slug', label: 'Slug', type: 'text' },
    { field: 'pageStatus', label: 'Status', type: 'badge', badgeVariants: { draft: 'secondary', published: 'default', archived: 'outline' } },
    { field: 'createdAt', label: 'Created', type: 'date' },
  ],
  components: [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'slug', label: 'Slug', type: 'text' },
    { field: 'type', label: 'Type', type: 'select' },
    { field: 'category', label: 'Category', type: 'select' },
    { field: 'status', label: 'Status', type: 'badge', badgeVariants: { draft: 'secondary', published: 'default' } },
    { field: 'createdAt', label: 'Created', type: 'date' },
  ],
  media: [
    { field: 'filename', label: 'Filename', type: 'text' },
    { field: 'alt', label: 'Alt Text', type: 'text' },
    { field: 'mimeType', label: 'Type', type: 'text' },
    { field: 'filesize', label: 'Size', type: 'number', numberFormat: { style: 'unit', unit: 'byte', notation: 'compact' } },
    { field: 'createdAt', label: 'Created', type: 'date' },
  ],
  roles: [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'slug', label: 'Slug', type: 'text' },
    { field: 'description', label: 'Description', type: 'text' },
    { field: 'status', label: 'Status', type: 'badge', badgeVariants: { active: 'default', inactive: 'secondary' } },
    { field: 'createdAt', label: 'Created', type: 'date' },
  ],
  permissions: [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'slug', label: 'Slug', type: 'text' },
    { field: 'resource', label: 'Resource', type: 'select' },
    { field: 'action', label: 'Action', type: 'select' },
    { field: 'status', label: 'Status', type: 'badge', badgeVariants: { active: 'default', inactive: 'secondary' } },
  ],
  sites: [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'domain', label: 'Domain', type: 'url' },
    { field: 'status', label: 'Status', type: 'badge' },
    { field: 'createdAt', label: 'Created', type: 'date' },
  ],
  layouts: [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'slug', label: 'Slug', type: 'text' },
    { field: 'type', label: 'Type', type: 'select' },
    { field: 'status', label: 'Status', type: 'badge' },
    { field: 'createdAt', label: 'Created', type: 'date' },
  ],
  languages: [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'code', label: 'Code', type: 'text' },
    { field: 'nativeName', label: 'Native Name', type: 'text' },
    { field: 'flag', label: 'Flag', type: 'text' },
    { field: 'status', label: 'Status', type: 'badge' },
  ],
}

// Helper to get preset columns for a collection
export function getCollectionColumns(collection: string, overrides?: Partial<ColumnConfig>[]): ColumnConfig[] {
  const preset = collectionColumnPresets[collection] || []
  
  if (!overrides) return preset
  
  return preset.map((col, index) => ({
    ...col,
    ...overrides[index],
  }))
}

