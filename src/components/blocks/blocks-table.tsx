'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  Search,
  X,
  CircleCheck,
  CircleDashed,
  Layers,
  LayoutGrid,
  Component,
  FileText,
  Image,
  FormInput,
  Navigation,
  LayoutTemplate,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  DataTableFacetedFilter,
  type FacetedFilterOption,
} from '@/components/ui/data-table-faceted-filter'
import { DataTableDateRangeFilterWithPresets } from '@/components/ui/data-table-date-range-filter'
import {
  DataTableStatusTabs,
  type StatusTab,
  generateStatusTabs,
} from '@/components/ui/data-table-status-tabs'
import { DataTableViewOptions } from '@/components/ui/data-table-view-options'
import {
  useTableUrlState,
  setToArray,
  arrayToSet,
  formatDateForUrl,
  parseDateFromUrl,
  type TableUrlState,
} from '@/hooks/use-table-url-state'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

export type Block = {
  id: string
  name: string
  slug: string
  type: 'block' | 'section' | 'widget'
  category?: 'content' | 'media' | 'form' | 'navigation' | 'layout' | 'other' | null
  description?: string | null
  status?: 'draft' | 'published' | null
  createdAt: string
  updatedAt: string
}

/** Row action configuration */
export type RowAction<T = any> = {
  /** Action label */
  label: string
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Click handler */
  onClick: (row: T) => void
  /** Variant for styling */
  variant?: 'default' | 'destructive'
  /** Show separator before this action */
  separator?: boolean
  /** Condition to show action */
  show?: (row: T) => boolean
}

/** Custom column configuration */
export type CustomColumn<T = any> = {
  /** Column ID */
  id: string
  /** Header label or render function */
  header?: string | ((props: { column: any }) => React.ReactNode)
  /** Cell render function */
  cell: (row: T) => React.ReactNode
  /** Enable sorting */
  sortable?: boolean
  /** Enable hiding */
  hideable?: boolean
  /** Column size */
  size?: number
}

type BlocksTableProps = {
  data: any[] // Generic data array
  columns?: string[] | any // Array of column keys or JSON config
  collection?: string // Collection name for dynamic columns
  searchFields?: string[] // Fields to search in
  filterFields?: Array<{
    field: string
    label: string
    type: 'select' | 'text' | 'date'
    options?: Array<{ label: string; value: string }>
  }>
  pagination?: {
    page: number
    limit: number
    totalPages: number
    totalDocs: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
  onFilterChange?: (filters: Record<string, string>) => void
  onSearchChange?: (search: string) => void
  /** Show status tabs header with counts */
  showStatusTabs?: boolean
  /** Field to use for status tabs (default: 'status') */
  statusTabsField?: string
  /** Custom status tabs configuration */
  statusTabsConfig?: Array<{
    value: string
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
    badgeClassName?: string
  }>
  /** Label for "All" tab (default: 'All') */
  allTabLabel?: string
  /** Show actions column (default: true) */
  showActions?: boolean
  /** Custom row actions */
  rowActions?: RowAction[]
  /** Default row actions (View, Edit, Delete) - set to false to disable */
  defaultActions?:
    | boolean
    | {
        view?: boolean | ((row: any) => void)
        edit?: boolean | ((row: any) => void)
        delete?: boolean | ((row: any) => void)
        copy?: boolean
      }
  /** Custom columns to add */
  customColumns?: CustomColumn[]
  /** Callback when View action is clicked */
  onView?: (row: any) => void
  /** Callback when Edit action is clicked */
  onEdit?: (row: any) => void
  /** Callback when Delete action is clicked */
  onDelete?: (row: any) => void
  /** Enable URL sync for table state (default: false) */
  syncUrl?: boolean
  /**
   * Group/namespace for this table's URL params.
   * Use this when you have multiple tables on the same page.
   * @example
   * // Table 1: group="users" -> ?users[page]=1&users[filters][status][]=active
   * // Table 2: group="orders" -> ?orders[page]=2&orders[limit]=25
   */
  urlGroup?: string
  /** Callback when URL state changes */
  onUrlStateChange?: (state: TableUrlState) => void
  /** Initial URL state (from server-side) */
  initialUrlState?: Partial<TableUrlState>
}

// Type options with icons
const typeOptions: FacetedFilterOption[] = [
  { label: 'Block', value: 'block', icon: Component },
  { label: 'Section', value: 'section', icon: Layers },
  { label: 'Widget', value: 'widget', icon: LayoutGrid },
]

// Category options with icons
const categoryOptions: FacetedFilterOption[] = [
  { label: 'Content', value: 'content', icon: FileText },
  { label: 'Media', value: 'media', icon: Image },
  { label: 'Form', value: 'form', icon: FormInput },
  { label: 'Navigation', value: 'navigation', icon: Navigation },
  { label: 'Layout', value: 'layout', icon: LayoutTemplate },
  { label: 'Other', value: 'other', icon: MoreHorizontal },
]

// Status options with icons
const statusOptions: FacetedFilterOption[] = [
  { label: 'Draft', value: 'draft', icon: CircleDashed },
  { label: 'Published', value: 'published', icon: CircleCheck },
]

const typeLabels: Record<string, string> = {
  block: 'Block',
  section: 'Section',
  widget: 'Widget',
}

const categoryLabels: Record<string, string> = {
  content: 'Content',
  media: 'Media',
  form: 'Form',
  navigation: 'Navigation',
  layout: 'Layout',
  other: 'Other',
}

// Default status tabs configuration
const defaultStatusTabsConfig = [
  { value: 'draft', label: 'Draft', variant: 'warning' as const },
  { value: 'published', label: 'Published', variant: 'success' as const },
]

export function BlocksTable({
  data,
  columns: enabledColumns,
  pagination,
  onPageChange,
  onLimitChange,
  showStatusTabs = false,
  statusTabsField = 'status',
  statusTabsConfig = defaultStatusTabsConfig,
  allTabLabel = 'All',
  showActions = true,
  rowActions = [],
  defaultActions = true,
  customColumns = [],
  onView,
  onEdit,
  onDelete,
  syncUrl = false,
  urlGroup,
  onUrlStateChange,
  initialUrlState,
}: BlocksTableProps) {
  // URL state sync
  const { state: urlState, updateState: updateUrlState } = useTableUrlState({
    syncUrl,
    group: urlGroup,
    defaults: {
      page: 1,
      limit: pagination?.limit || 10,
      statusTab: 'all',
    },
  })

  // Initialize state from URL or props
  const getInitialState = React.useCallback(() => {
    if (syncUrl && urlState) {
      return urlState
    }
    return initialUrlState || {}
  }, [syncUrl, urlState, initialUrlState])

  const initialState = getInitialState()

  // Local state for page/limit to sync with URL immediately
  const [currentPage, setCurrentPage] = React.useState(initialState.page || pagination?.page || 1)
  const [currentLimit, setCurrentLimit] = React.useState(
    initialState.limit || pagination?.limit || 10,
  )

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialState.columnVisibility || {},
  )
  const [globalFilter, setGlobalFilter] = React.useState(initialState.search || '')
  const [rowSelection, setRowSelection] = React.useState({})

  // Status tabs state
  const [activeStatusTab, setActiveStatusTab] = React.useState(initialState.statusTab || 'all')

  // Multi-select filter states
  const [typeFilter, setTypeFilter] = React.useState<Set<string>>(
    arrayToSet(initialState.filters?.type),
  )
  const [categoryFilter, setCategoryFilter] = React.useState<Set<string>>(
    arrayToSet(initialState.filters?.category),
  )
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(
    arrayToSet(initialState.filters?.status),
  )
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    if (initialState.dateRange?.from || initialState.dateRange?.to) {
      return {
        from: parseDateFromUrl(initialState.dateRange?.from),
        to: parseDateFromUrl(initialState.dateRange?.to),
      }
    }
    return undefined
  })

  // Generate status tabs with counts
  const statusTabs = React.useMemo(() => {
    return generateStatusTabs(data, statusTabsField as keyof (typeof data)[0], {
      statuses: statusTabsConfig,
      defaultStatus: 'draft',
    })
  }, [data, statusTabsField, statusTabsConfig])

  // Calculate facet counts
  const facetCounts = React.useMemo(() => {
    const typeCounts = new Map<string, number>()
    const categoryCounts = new Map<string, number>()
    const statusCounts = new Map<string, number>()

    data.forEach((item) => {
      // Type counts
      if (item.type) {
        typeCounts.set(item.type, (typeCounts.get(item.type) || 0) + 1)
      }
      // Category counts
      if (item.category) {
        categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1)
      }
      // Status counts
      const status = item.status || 'draft'
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1)
    })

    return { typeCounts, categoryCounts, statusCounts }
  }, [data])

  // All available column definitions
  const allColumns: Record<string, ColumnDef<Block>> = {
    select: {
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
    },
    name: {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue('name')}</span>
            <span className="text-xs text-muted-foreground">{row.original.slug}</span>
          </div>
        )
      },
    },
    type: {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const type = row.getValue('type') as string
        const Icon = typeOptions.find((t) => t.value === type)?.icon || Component
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{typeLabels[type] || type}</span>
          </div>
        )
      },
      filterFn: (row, id, value: string[]) => {
        if (!value || value.length === 0) return true
        return value.includes(row.getValue(id))
      },
    },
    category: {
      accessorKey: 'category',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const category = row.getValue('category') as string | null
        if (!category) return <span className="text-muted-foreground">-</span>
        const Icon = categoryOptions.find((c) => c.value === category)?.icon || MoreHorizontal
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{categoryLabels[category] || category}</span>
          </div>
        )
      },
      filterFn: (row, id, value: string[]) => {
        if (!value || value.length === 0) return true
        const category = row.getValue(id) as string | null
        if (!category) return value.includes('none')
        return value.includes(category)
      },
    },
    status: {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = (row.getValue('status') as string) || 'draft'
        const Icon = statusOptions.find((s) => s.value === status)?.icon || CircleDashed
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{status}</span>
          </div>
        )
      },
      filterFn: (row, id, value: string[]) => {
        if (!value || value.length === 0) return true
        const status = (row.getValue(id) as string) || 'draft'
        return value.includes(status)
      },
    },
    description: {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string | null
        if (!description) return <span className="text-muted-foreground">-</span>
        return (
          <span className="max-w-[300px] truncate text-sm text-muted-foreground">
            {description}
          </span>
        )
      },
    },
    createdAt: {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return <span className="text-sm">{date.toLocaleDateString()}</span>
      },
      filterFn: (row, id, value: DateRange) => {
        if (!value || (!value.from && !value.to)) return true
        const cellDate = new Date(row.getValue(id))
        if (value.from && value.to) {
          return cellDate >= value.from && cellDate <= value.to
        }
        if (value.from) {
          return cellDate >= value.from
        }
        if (value.to) {
          return cellDate <= value.to
        }
        return true
      },
    },
  }

  // Actions column
  const actionsColumn: ColumnDef<Block> = {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original

      // Build actions list
      const actions: RowAction[] = []

      // Default actions
      if (defaultActions !== false) {
        const defaults = typeof defaultActions === 'object' ? defaultActions : {}

        // Copy ID action
        if (defaults.copy !== false) {
          actions.push({
            label: 'Copy ID',
            icon: Copy,
            onClick: () => navigator.clipboard.writeText(item.id),
          })
        }

        // View action
        if (defaults.view !== false) {
          actions.push({
            label: 'View',
            icon: Eye,
            separator: true,
            onClick: typeof defaults.view === 'function' ? defaults.view : onView || (() => {}),
          })
        }

        // Edit action
        if (defaults.edit !== false) {
          actions.push({
            label: 'Edit',
            icon: Edit,
            onClick: typeof defaults.edit === 'function' ? defaults.edit : onEdit || (() => {}),
          })
        }

        // Delete action
        if (defaults.delete !== false) {
          actions.push({
            label: 'Delete',
            icon: Trash2,
            variant: 'destructive',
            separator: true,
            onClick:
              typeof defaults.delete === 'function' ? defaults.delete : onDelete || (() => {}),
          })
        }
      }

      // Add custom row actions
      actions.push(...rowActions)

      // Filter actions based on show condition
      const visibleActions = actions.filter((action) => {
        if (action.show) return action.show(item)
        return true
      })

      if (visibleActions.length === 0) return null

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
            {visibleActions.map((action, index) => (
              <React.Fragment key={index}>
                {action.separator && index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => action.onClick(item)}
                  className={action.variant === 'destructive' ? 'text-destructive' : ''}
                >
                  {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }

  // Filter columns based on enabledColumns prop
  const columns: ColumnDef<Block>[] = React.useMemo(() => {
    // Always include select column first
    const baseColumns: ColumnDef<Block>[] = [allColumns.select]

    let dataCols: ColumnDef<Block>[]

    if (!enabledColumns || enabledColumns.length === 0) {
      // Default: show all columns except select (already added)
      dataCols = Object.entries(allColumns)
        .filter(([key]) => key !== 'select')
        .map(([, col]) => col)
    } else {
      // Return only enabled columns in the specified order
      // Support both array of strings and array of objects
      const columnKeys = enabledColumns.map((col: string | any) => {
        if (typeof col === 'string') {
          return col
        }
        // Handle object format: { key: 'name', label: 'Name', sortable: true }
        return col.key || col.id || col
      })

      console.log('🔍 BlocksTable - enabledColumns:', enabledColumns)
      console.log('🔍 BlocksTable - columnKeys:', columnKeys)
      console.log('🔍 BlocksTable - available columns:', Object.keys(allColumns))

      dataCols = columnKeys
        .filter((key: string) => key !== 'select')
        .map((key: string) => {
          const col = allColumns[key]
          if (!col) {
            console.warn(`⚠️ BlocksTable - Column "${key}" not found in allColumns`)
            return null
          }

          // If enabledColumns contains objects with custom labels, update header
          const colConfig = enabledColumns.find(
            (c: any) => typeof c === 'object' && (c.key === key || c.id === key),
          )
          if (colConfig && typeof colConfig === 'object' && colConfig.label) {
            return {
              ...col,
              header: colConfig.label,
            }
          }
          return col
        })
        .filter(
          (col: ColumnDef<Block> | null | undefined) => col !== null && col !== undefined,
        ) as ColumnDef<Block>[]

      console.log('🔍 BlocksTable - final dataCols:', dataCols.length, 'columns')
    }

    // Add custom columns
    const customCols: ColumnDef<Block>[] = customColumns.map((custom) => ({
      id: custom.id,
      header: typeof custom.header === 'function' ? custom.header : custom.header || custom.id,
      cell: ({ row }) => custom.cell(row.original),
      enableSorting: custom.sortable ?? false,
      enableHiding: custom.hideable ?? true,
      size: custom.size,
    }))

    // Combine all columns
    const result = [...baseColumns, ...dataCols, ...customCols]

    // Add actions column at the end if enabled
    if (showActions) {
      result.push(actionsColumn)
    }

    return result
  }, [enabledColumns, customColumns, showActions, actionsColumn])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
  })

  // Apply multi-select filters
  React.useEffect(() => {
    const filters: ColumnFiltersState = []
    if (typeFilter.size > 0) {
      filters.push({ id: 'type', value: Array.from(typeFilter) })
    }
    if (categoryFilter.size > 0) {
      filters.push({ id: 'category', value: Array.from(categoryFilter) })
    }
    // Apply status filter from tabs or faceted filter
    if (activeStatusTab !== 'all') {
      filters.push({ id: 'status', value: [activeStatusTab] })
    } else if (statusFilter.size > 0) {
      filters.push({ id: 'status', value: Array.from(statusFilter) })
    }
    if (dateRange?.from || dateRange?.to) {
      filters.push({ id: 'createdAt', value: dateRange })
    }
    setColumnFilters(filters)
  }, [typeFilter, categoryFilter, statusFilter, dateRange, activeStatusTab])

  // Handle status tab change
  const handleStatusTabChange = (value: string) => {
    setActiveStatusTab(value)
    // Clear faceted status filter when using tabs
    if (value !== 'all') {
      setStatusFilter(new Set())
    }
  }

  // Sync all state to URL
  React.useEffect(() => {
    if (!syncUrl) return

    const newUrlState: TableUrlState = {
      page: currentPage !== 1 ? currentPage : undefined,
      limit: currentLimit !== 10 ? currentLimit : undefined,
      search: globalFilter || undefined,
      statusTab: activeStatusTab !== 'all' ? activeStatusTab : undefined,
      filters: {
        ...(typeFilter.size > 0 && { type: setToArray(typeFilter) }),
        ...(categoryFilter.size > 0 && { category: setToArray(categoryFilter) }),
        ...(statusFilter.size > 0 && { status: setToArray(statusFilter) }),
      },
      dateRange:
        dateRange?.from || dateRange?.to
          ? {
              from: formatDateForUrl(dateRange?.from),
              to: formatDateForUrl(dateRange?.to),
            }
          : undefined,
      columnVisibility: Object.keys(columnVisibility).length > 0 ? columnVisibility : undefined,
    }

    updateUrlState(newUrlState)
    onUrlStateChange?.(newUrlState)
  }, [
    syncUrl,
    currentPage,
    currentLimit,
    globalFilter,
    activeStatusTab,
    typeFilter,
    categoryFilter,
    statusFilter,
    dateRange,
    columnVisibility,
    updateUrlState,
    onUrlStateChange,
  ])

  const isFiltered =
    typeFilter.size > 0 ||
    categoryFilter.size > 0 ||
    statusFilter.size > 0 ||
    globalFilter !== '' ||
    dateRange?.from !== undefined ||
    dateRange?.to !== undefined ||
    activeStatusTab !== 'all'

  const clearFilters = () => {
    setTypeFilter(new Set())
    setCategoryFilter(new Set())
    setStatusFilter(new Set())
    setGlobalFilter('')
    setDateRange(undefined)
    setActiveStatusTab('all')
    setColumnVisibility({})
    setCurrentPage(1)
    setCurrentLimit(10)

    // Also reset data fetch
    onPageChange?.(1)
  }

  // Handle page change with URL sync
  const handlePageChange = (newPage: number) => {
    // Update local state first (this will trigger useEffect to sync URL)
    setCurrentPage(newPage)
    // Then call the callback to fetch data
    onPageChange?.(newPage)
  }

  // Handle limit change with URL sync
  const handleLimitChange = (newLimit: number) => {
    // Update local state first (this will trigger useEffect to sync URL)
    setCurrentLimit(newLimit)
    setCurrentPage(1) // Reset to page 1
    // Then call the callbacks to fetch data
    onLimitChange?.(newLimit)
    onPageChange?.(1)
  }

  return (
    <div className="space-y-4">
      {/* Status Tabs Header */}
      {showStatusTabs && (
        <DataTableStatusTabs
          tabs={statusTabs}
          activeTab={activeStatusTab}
          onTabChange={handleStatusTabChange}
          showAllTab={true}
          allTabLabel={allTabLabel}
          totalCount={data.length}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Global Search */}
        <div className="relative w-full sm:w-[250px] lg:w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter blocks..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 pl-9"
          />
        </div>

        {/* Faceted Filters */}
        <DataTableFacetedFilter
          title="Status"
          options={statusOptions}
          selectedValues={statusFilter}
          onSelectionChange={setStatusFilter}
          facetCounts={facetCounts.statusCounts}
        />

        <DataTableFacetedFilter
          title="Type"
          options={typeOptions}
          selectedValues={typeFilter}
          onSelectionChange={setTypeFilter}
          facetCounts={facetCounts.typeCounts}
        />

        <DataTableFacetedFilter
          title="Category"
          options={categoryOptions}
          selectedValues={categoryFilter}
          onSelectionChange={setCategoryFilter}
          facetCounts={facetCounts.categoryCounts}
        />

        <DataTableDateRangeFilterWithPresets
          title="Created"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          showTime={false}
        />

        {isFiltered && (
          <Button variant="ghost" onClick={clearFilters} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}

        {/* Spacer to push View to right */}
        <div className="flex-1" />

        {/* View Options */}
        <DataTableViewOptions table={table} />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerContent = header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header({
                          column: header.column,
                          header: header,
                          table: table,
                        })
                      : header.column.columnDef.header

                  return <TableHead key={header.id}>{headerContent}</TableHead>
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {(() => {
              const rows = table.getRowModel().rows

              if (rows && rows.length > 0) {
                return rows.map((row) => {
                  return (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => {
                        const cellContent =
                          typeof cell.column.columnDef.cell === 'function'
                            ? cell.column.columnDef.cell({
                                cell: cell,
                                column: cell.column,
                                row: row,
                                table: table,
                                getValue: cell.getValue,
                                renderValue: cell.renderValue,
                              })
                            : cell.getValue()

                        return <TableCell key={cell.id}>{cellContent}</TableCell>
                      })}
                    </TableRow>
                  )
                })
              }

              return (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">No blocks found.</p>
                      {data.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Try running the seed script to populate components.
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Data loaded but no rows match current filters.
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })()}
          </TableBody>
        </Table>
      </div>

      {/* Footer with selection info and pagination */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {pagination && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => handleLimitChange(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
