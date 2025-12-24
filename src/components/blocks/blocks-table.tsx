'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, Search, Filter, X } from 'lucide-react'
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
import { cn } from '@/lib/utils'

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

type BlocksTableProps = {
  data: Block[]
  columns?: string[] // Array of column keys to display
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
}

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

export function BlocksTable({
  data,
  columns: enabledColumns,
  pagination,
  onPageChange,
  onLimitChange,
}: BlocksTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('')
  const [statusFilter, setStatusFilter] = React.useState<string>('')

  // All available column definitions
  const allColumns: Record<string, ColumnDef<Block>> = {
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
        return (
          <Badge variant="outline" className="capitalize">
            {typeLabels[type] || type}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (!value) return true
        return row.getValue(id) === value
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
        return (
          <Badge variant="secondary" className="capitalize">
            {categoryLabels[category] || category}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (!value) return true
        const category = row.getValue(id) as string | null
        if (!category) return value === 'none'
        return category === value
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
        return (
          <Badge variant={status === 'published' ? 'default' : 'secondary'} className="capitalize">
            {status}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (!value) return true
        return row.getValue(id) === value
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
    },
  }

  // Filter columns based on enabledColumns prop
  const columns: ColumnDef<Block>[] = React.useMemo(() => {
    if (!enabledColumns || enabledColumns.length === 0) {
      // Default: show all columns
      return Object.values(allColumns)
    }
    // Return only enabled columns in the specified order
    return enabledColumns
      .map((key) => allColumns[key])
      .filter((col) => col !== undefined) as ColumnDef<Block>[]
  }, [enabledColumns])

  // Debug logging
  React.useEffect(() => {
    console.log('BlocksTable - Data:', data)
    console.log('BlocksTable - Data length:', data.length)
    console.log('BlocksTable - Columns:', columns.length)
  }, [data, columns])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  // Debug table rows
  React.useEffect(() => {
    console.log('BlocksTable - Table rows:', table.getRowModel().rows.length)
    console.log('BlocksTable - Filtered rows:', table.getFilteredRowModel().rows.length)
  }, [table, data])

  // Apply filters
  React.useEffect(() => {
    const filters: ColumnFiltersState = []
    if (typeFilter) {
      filters.push({ id: 'type', value: typeFilter })
    }
    if (categoryFilter) {
      filters.push({ id: 'category', value: categoryFilter })
    }
    if (statusFilter) {
      filters.push({ id: 'status', value: statusFilter })
    }
    setColumnFilters(filters)
  }, [typeFilter, categoryFilter, statusFilter])

  const activeFiltersCount =
    (typeFilter ? 1 : 0) +
    (categoryFilter ? 1 : 0) +
    (statusFilter ? 1 : 0) +
    (globalFilter ? 1 : 0)

  const clearFilters = () => {
    setTypeFilter('')
    setCategoryFilter('')
    setStatusFilter('')
    setGlobalFilter('')
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={typeFilter || 'all'}
            onValueChange={(value) => setTypeFilter(value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="section">Section</SelectItem>
              <SelectItem value="widget">Widget</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryFilter || 'all'}
            onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="form">Form</SelectItem>
              <SelectItem value="navigation">Navigation</SelectItem>
              <SelectItem value="layout">Layout</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="none">No Category</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter || 'all'}
            onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="w-fit">
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
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
              console.log('Rendering table body - rows:', rows?.length, 'data:', data.length)

              if (rows && rows.length > 0) {
                return rows.map((row) => {
                  console.log('Rendering row:', row.id, row.original)
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

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit + 1).toLocaleString()} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.totalDocs).toLocaleString()} of{' '}
            {pagination.totalDocs.toLocaleString()} blocks
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.page - 1)}
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
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => onLimitChange?.(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
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
        </div>
      )}
    </div>
  )
}
