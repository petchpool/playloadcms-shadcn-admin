'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import qs from 'qs'
import { BlocksTable, type RowAction, type CustomColumn } from './blocks-table'
import { Skeleton } from '@/components/ui/skeleton'

type BlocksTableBlockProps = {
  /** Table title */
  title?: string
  /** Table description */
  description?: string
  /** Items per page (default: 10) */
  limit?: number
  /** Column keys to display or column config */
  columns?: string[] | any
  /** Collection slug to fetch from (default: 'components') */
  collection?: string
  /** Fields to search in */
  searchFields?: string[]
  /** Filter field configurations */
  filterFields?: Array<{
    field: string
    label: string
    type: 'select' | 'text' | 'date'
    options?: Array<{ label: string; value: string }>
  }>
  /** Populate configuration */
  populate?: {
    /** Depth for relationship population (default: 0) */
    depth?: number
    /** Fields to populate (e.g., ['author', 'category', 'author.avatar']) */
    fields?: string[]
  }
  /** Fields to select (comma-separated or array) */
  select?: string | string[]
  /** Default sort configuration */
  defaultSort?: {
    field?: string
    order?: 'asc' | 'desc'
  }
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
  /** Default row actions configuration */
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
   * // Table 1: urlGroup="users" -> ?users[page]=1&users[filters][status][]=active
   * // Table 2: urlGroup="orders" -> ?orders[page]=2&orders[limit]=25
   */
  urlGroup?: string
}

export function BlocksTableBlock({
  title,
  description,
  limit = 10,
  columns,
  collection = 'components',
  searchFields,
  filterFields,
  populate,
  select,
  defaultSort,
  showStatusTabs = true,
  statusTabsField,
  statusTabsConfig,
  allTabLabel,
  showActions = true,
  rowActions,
  defaultActions = true,
  customColumns,
  onView,
  onEdit,
  onDelete,
  syncUrl = false,
  urlGroup,
}: BlocksTableBlockProps) {
  const searchParams = useSearchParams()

  // Parse initial state from URL when syncUrl is enabled
  const getInitialUrlState = React.useCallback(() => {
    if (!syncUrl) return { page: 1, limit }

    const parsed = qs.parse(searchParams.toString(), {
      ignoreQueryPrefix: true,
    }) as Record<string, any>

    // If urlGroup is specified, get the nested object for this group
    const tableParams = urlGroup ? (parsed[urlGroup] as Record<string, any>) || {} : parsed

    return {
      page: tableParams.page ? Number(tableParams.page) : 1,
      limit: tableParams.limit ? Number(tableParams.limit) : limit,
    }
  }, [syncUrl, searchParams, limit, urlGroup])

  const initialUrlState = getInitialUrlState()

  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [pagination, setPagination] = React.useState({
    page: initialUrlState.page,
    limit: initialUrlState.limit,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const fetchBlocks = React.useCallback(
    async (page: number = 1, pageLimit: number = limit) => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          collection: collection,
          page: page.toString(),
          limit: pageLimit.toString(),
          depth: populate?.depth?.toString() || '0',
        })

        // Add search fields if specified
        if (searchFields && searchFields.length > 0) {
          const fieldsArray = searchFields.map((sf: any) =>
            typeof sf === 'string' ? sf : sf.field,
          )
          params.append('searchFields', fieldsArray.join(','))
        }

        // Add populate fields if specified
        if (populate?.fields && populate.fields.length > 0) {
          params.append('populate', populate.fields.join(','))
        }

        // Add select fields if specified
        if (select) {
          const selectFields = Array.isArray(select) ? select.join(',') : select
          params.append('select', selectFields)
        }

        // Add default sort
        if (defaultSort?.field) {
          params.append('sortBy', defaultSort.field)
          params.append('sortOrder', defaultSort.order || 'desc')
        }

        const response = await fetch(`/api/table-data?${params}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch blocks')
        }

        console.log('Blocks data:', result.data)
        console.log('Pagination:', result.pagination)
        console.log('Data length:', result.data?.length || 0)

        // Ensure data is an array and has correct structure
        const blocksData = Array.isArray(result.data) ? result.data : []
        console.log('Processed blocks:', blocksData.length)

        setData(blocksData)
        setPagination(
          result.pagination || {
            page: 1,
            limit: limit,
            totalPages: 1,
            totalDocs: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        )
      } catch (err: any) {
        setError(err.message || 'Failed to load blocks')
        console.error('Error fetching blocks:', err)
      } finally {
        setLoading(false)
      }
    },
    [limit, collection, searchFields, populate, select, defaultSort],
  )

  React.useEffect(() => {
    fetchBlocks(initialUrlState.page, initialUrlState.limit)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage: number) => {
    fetchBlocks(newPage, pagination.limit)
  }

  const handleLimitChange = (newLimit: number) => {
    fetchBlocks(1, newLimit)
  }

  const handleFilterChange = React.useCallback(
    (filters: Record<string, string>) => {
      // Re-fetch with new filters
      fetchBlocks(1, pagination.limit)
    },
    [fetchBlocks, pagination.limit],
  )

  const handleSearchChange = React.useCallback(
    (search: string) => {
      // Re-fetch with new search
      fetchBlocks(1, pagination.limit)
    },
    [fetchBlocks, pagination.limit],
  )

  if (loading && data.length === 0) {
    return (
      <div className="space-y-4">
        {title && (
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </div>
        )}
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <h3 className="font-semibold text-destructive">Error</h3>
        <p className="text-sm text-destructive mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
      )}
      {data.length === 0 && !loading ? (
        <div className="rounded-lg border border-muted bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground mb-2">No blocks found.</p>
          <p className="text-sm text-muted-foreground">
            Components collection is empty. Run the seed script to populate data.
          </p>
        </div>
      ) : (
        <BlocksTable
          data={data}
          columns={columns}
          collection={collection}
          searchFields={searchFields}
          filterFields={filterFields}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          showStatusTabs={showStatusTabs}
          statusTabsField={statusTabsField}
          statusTabsConfig={statusTabsConfig}
          allTabLabel={allTabLabel}
          showActions={showActions}
          rowActions={rowActions}
          defaultActions={defaultActions}
          customColumns={customColumns}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          syncUrl={syncUrl}
          urlGroup={urlGroup}
        />
      )}
    </div>
  )
}
