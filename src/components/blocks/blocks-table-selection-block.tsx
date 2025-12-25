'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import qs from 'qs'
import { BlocksTableSelection } from './blocks-table-selection'
import { Skeleton } from '@/components/ui/skeleton'
import { useDataByKey } from './data-context'

type BlocksTableSelectionBlockProps = {
  /** Table title */
  title?: string
  /** Table description */
  description?: string
  /** Items per page (default: 10) */
  limit?: number
  /** Column keys to display */
  columns?: string[]
  /** Collection slug to fetch from (default: 'components') */
  collection?: string
  /** Populate configuration */
  populate?: {
    depth?: number
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
  /** Enable URL sync for table state (default: false) */
  syncUrl?: boolean
  /** Group/namespace for this table's URL params */
  urlGroup?: string
  /** Use external data from DataFetch context */
  useExternalData?: boolean
  /** Data key to reference from DataFetch context */
  dataKey?: string

  // Selection-specific props
  /** Selection mode: 'single' or 'multiple' (default: 'multiple') */
  selectionMode?: 'single' | 'multiple'
  /** Initially selected item IDs */
  defaultSelectedIds?: string[]
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[], selectedRows: any[]) => void
  /** Max number of items that can be selected (for multiple mode) */
  maxSelection?: number
  /** Show selection summary (default: true) */
  showSelectionSummary?: boolean
  /** Custom selection message */
  selectionMessage?: (count: number, max?: number) => string
}

export function BlocksTableSelectionBlock({
  title,
  description,
  limit = 10,
  columns,
  collection = 'components',
  populate,
  select,
  defaultSort,
  showStatusTabs = true,
  statusTabsField,
  statusTabsConfig,
  allTabLabel,
  syncUrl = false,
  urlGroup,
  useExternalData = false,
  dataKey,
  selectionMode = 'multiple',
  defaultSelectedIds = [],
  onSelectionChange,
  maxSelection,
  showSelectionSummary = true,
  selectionMessage,
}: BlocksTableSelectionBlockProps) {
  const searchParams = useSearchParams()

  // Get external data from context if useExternalData is true
  const externalData = useDataByKey(dataKey || '')

  // Parse initial state from URL when syncUrl is enabled
  const getInitialUrlState = React.useCallback(() => {
    if (!syncUrl) return { page: 1, limit }

    const parsed = qs.parse(searchParams.toString(), {
      ignoreQueryPrefix: true,
    }) as Record<string, any>

    const tableParams = urlGroup ? (parsed[urlGroup] as Record<string, any>) || {} : parsed

    return {
      page: tableParams.page ? Number(tableParams.page) : 1,
      limit: tableParams.limit ? Number(tableParams.limit) : limit,
    }
  }, [syncUrl, searchParams, limit, urlGroup])

  const initialUrlState = getInitialUrlState()

  const [internalData, setInternalData] = React.useState<any[]>([])
  const [internalLoading, setInternalLoading] = React.useState(!useExternalData)
  const [internalError, setInternalError] = React.useState<string | null>(null)
  const [pagination, setPagination] = React.useState({
    page: initialUrlState.page,
    limit: initialUrlState.limit,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  // Determine which data source to use
  const data = useExternalData ? externalData.docs || externalData.data || [] : internalData
  const loading = useExternalData ? externalData.loading : internalLoading
  const error = useExternalData ? externalData.error : internalError

  // Update pagination when using external data
  React.useEffect(() => {
    if (useExternalData && externalData.data) {
      const docs = externalData.docs || externalData.data || []
      const totalDocs = externalData.count ?? docs.length
      setPagination((prev) => ({
        ...prev,
        totalDocs,
        totalPages: Math.ceil(totalDocs / prev.limit) || 1,
        hasNextPage: prev.page < Math.ceil(totalDocs / prev.limit),
        hasPrevPage: prev.page > 1,
      }))
    }
  }, [useExternalData, externalData])

  const fetchBlocks = React.useCallback(
    async (page: number = 1, pageLimit: number = limit) => {
      if (useExternalData) return

      try {
        setInternalLoading(true)
        setInternalError(null)

        const params = new URLSearchParams({
          collection: collection,
          page: page.toString(),
          limit: pageLimit.toString(),
          depth: populate?.depth?.toString() || '0',
        })

        if (populate?.fields && populate.fields.length > 0) {
          params.append('populate', populate.fields.join(','))
        }

        if (select) {
          const selectFields = Array.isArray(select) ? select.join(',') : select
          params.append('select', selectFields)
        }

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

        const blocksData = Array.isArray(result.data) ? result.data : []

        setInternalData(blocksData)
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
        setInternalError(err.message || 'Failed to load blocks')
        console.error('Error fetching blocks:', err)
      } finally {
        setInternalLoading(false)
      }
    },
    [limit, collection, populate, select, defaultSort, useExternalData],
  )

  React.useEffect(() => {
    if (!useExternalData) {
      fetchBlocks(initialUrlState.page, initialUrlState.limit)
    }
  }, [useExternalData]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    if (!useExternalData) {
      fetchBlocks(newPage, pagination.limit)
    }
  }

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, page: 1, limit: newLimit }))
    if (!useExternalData) {
      fetchBlocks(1, newLimit)
    }
  }

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
          <p className="text-muted-foreground mb-2">No data found.</p>
          <p className="text-sm text-muted-foreground">
            {useExternalData
              ? `No data available from "${dataKey}" context.`
              : 'Collection is empty. Run the seed script to populate data.'}
          </p>
        </div>
      ) : (
        <BlocksTableSelection
          data={data}
          columns={columns}
          collection={collection}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showStatusTabs={showStatusTabs}
          statusTabsField={statusTabsField}
          statusTabsConfig={statusTabsConfig}
          allTabLabel={allTabLabel}
          syncUrl={syncUrl}
          urlGroup={urlGroup}
          selectionMode={selectionMode}
          defaultSelectedIds={defaultSelectedIds}
          onSelectionChange={onSelectionChange}
          maxSelection={maxSelection}
          showSelectionSummary={showSelectionSummary}
          selectionMessage={selectionMessage}
        />
      )}
    </div>
  )
}
