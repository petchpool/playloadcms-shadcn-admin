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
  type RowSelectionState,
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
  CheckCircle2,
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
  DataTableFacetedFilter,
  type FacetedFilterOption,
} from '@/components/ui/data-table-faceted-filter'
import { DataTableDateRangeFilterWithPresets } from '@/components/ui/data-table-date-range-filter'
import {
  DataTableStatusTabs,
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

type BlocksTableSelectionProps = {
  data: any[]
  columns?: string[]
  collection?: string
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
  showStatusTabs?: boolean
  statusTabsField?: string
  statusTabsConfig?: Array<{
    value: string
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
    badgeClassName?: string
  }>
  allTabLabel?: string
  syncUrl?: boolean
  urlGroup?: string
  onUrlStateChange?: (state: TableUrlState) => void
  initialUrlState?: Partial<TableUrlState>
  
  // Selection-specific props
  /** Selection mode: 'single' or 'multiple' */
  selectionMode?: 'single' | 'multiple'
  /** Initially selected item IDs */
  defaultSelectedIds?: string[]
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[], selectedRows: any[]) => void
  /** Max number of items that can be selected (for multiple mode) */
  maxSelection?: number
  /** Show selection summary */
  showSelectionSummary?: boolean
  /** Custom selection message */
  selectionMessage?: (count: number, max?: number) => string
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

export function BlocksTableSelection({
  data,
  columns: enabledColumns,
  pagination,
  onPageChange,
  onLimitChange,
  showStatusTabs = false,
  statusTabsField = 'status',
  statusTabsConfig = defaultStatusTabsConfig,
  allTabLabel = 'All',
  syncUrl = false,
  urlGroup,
  onUrlStateChange,
  initialUrlState,
  selectionMode = 'multiple',
  defaultSelectedIds = [],
  onSelectionChange,
  maxSelection,
  showSelectionSummary = true,
  selectionMessage,
}: BlocksTableSelectionProps) {
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
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(() => {
    // Initialize row selection from defaultSelectedIds
    const initialSelection: RowSelectionState = {}
    defaultSelectedIds.forEach((id) => {
      const index = data.findIndex((item) => item.id === id)
      if (index !== -1) {
        initialSelection[index] = true
      }
    })
    return initialSelection
  })

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
      if (item.type) {
        typeCounts.set(item.type, (typeCounts.get(item.type) || 0) + 1)
      }
      if (item.category) {
        categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1)
      }
      const status = item.status || 'draft'
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1)
    })

    return { typeCounts, categoryCounts, statusCounts }
  }, [data])

  // All available column definitions
  const allColumns: Record<string, ColumnDef<Block>> = {
    select: {
      id: 'select',
      header: ({ table }) =>
        selectionMode === 'multiple' ? (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => {
              // Check if we would exceed maxSelection
              if (maxSelection && value) {
                const currentSelected = Object.keys(rowSelection).length
                const pageRows = table.getRowModel().rows.length
                if (currentSelected + pageRows > maxSelection) {
                  return // Don't allow selection
                }
              }
              table.toggleAllPageRowsSelected(!!value)
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ) : null,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (selectionMode === 'single') {
              // Single mode: clear all other selections
              setRowSelection({ [row.index]: !!value })
            } else {
              // Multiple mode: check maxSelection
              if (maxSelection && value) {
                const currentSelected = Object.keys(rowSelection).length
                if (currentSelected >= maxSelection) {
                  return // Don't allow more selections
                }
              }
              row.toggleSelected(!!value)
            }
          }}
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

  // Filter columns based on enabledColumns prop
  const columns: ColumnDef<Block>[] = React.useMemo(() => {
    // Always include select column first
    const baseColumns: ColumnDef<Block>[] = [allColumns.select]

    let dataCols: ColumnDef<Block>[]

    if (!enabledColumns || enabledColumns.length === 0) {
      // Default: show name, type, category, status
      dataCols = [allColumns.name, allColumns.type, allColumns.category, allColumns.status]
    } else {
      dataCols = enabledColumns
        .filter((key: string) => key !== 'select')
        .map((key: string) => allColumns[key])
        .filter((col) => col !== undefined) as ColumnDef<Block>[]
    }

    return [...baseColumns, ...dataCols]
  }, [enabledColumns])

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
    if (value !== 'all') {
      setStatusFilter(new Set())
    }
  }

  // Sync selection changes
  React.useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedIds = selectedRows.map((row) => row.original.id)
    const selectedData = selectedRows.map((row) => row.original)
    onSelectionChange?.(selectedIds, selectedData)
  }, [rowSelection, onSelectionChange])

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
    onPageChange?.(1)
  }

  // Handle page change with URL sync
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    onPageChange?.(newPage)
  }

  // Handle limit change with URL sync
  const handleLimitChange = (newLimit: number) => {
    setCurrentLimit(newLimit)
    setCurrentPage(1)
    onLimitChange?.(newLimit)
    onPageChange?.(1)
  }

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div className="space-y-4">
      {/* Selection Summary */}
      {showSelectionSummary && selectedCount > 0 && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {selectionMessage
                  ? selectionMessage(selectedCount, maxSelection)
                  : maxSelection
                    ? `${selectedCount} of ${maxSelection} selected`
                    : `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

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
                    <TableRow 
                      key={row.id} 
                      data-state={row.getIsSelected() && 'selected'}
                      className={cn(
                        row.getIsSelected() && 'bg-muted/50'
                      )}
                    >
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
          {selectedCount > 0 ? (
            <span className="font-medium text-primary">
              {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
            </span>
          ) : (
            <span>
              {table.getFilteredRowModel().rows.length} row(s) available.
            </span>
          )}
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

