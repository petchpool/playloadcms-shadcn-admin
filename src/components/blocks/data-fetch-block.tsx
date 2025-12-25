'use client'

import * as React from 'react'
import { DataProvider, useData, applyTransform, type TransformType } from './data-context'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

/**
 * Source configuration for data fetching
 */
type DataSource = {
  /** Source type */
  type: 'collection' | 'global' | 'api'
  /** Collection slug (for collection type) */
  collection?: string
  /** Global slug (for global type) */
  global?: string
  /** API endpoint URL (for api type) */
  endpoint?: string
}

/**
 * Query configuration for filtering/sorting data
 */
type QueryConfig = {
  /** Where clause for filtering */
  where?: Record<string, any>
  /** Sort field (prefix with - for descending) */
  sort?: string
  /** Limit number of results */
  limit?: number
  /** Depth for relationship population */
  depth?: number
  /** Fields to select */
  select?: string[]
}

/**
 * Transform configuration for aggregating data
 */
type TransformConfig = {
  /** Transform type */
  type: TransformType
  /** Field to use for sum/average/groupBy */
  field?: string
}

/**
 * Props for DataFetchBlock component
 */
export type DataFetchBlockProps = {
  /** Unique key to identify this data in context */
  dataKey: string
  /** Data source configuration */
  source: DataSource
  /** Query configuration */
  query?: QueryConfig
  /** Transform configuration */
  transform?: TransformConfig
  /** Child blocks to render (receives data via context) */
  children?: any[]
  /** Show loading skeleton */
  showLoading?: boolean
  /** Show error message */
  showError?: boolean
  /** Custom loading component */
  loadingComponent?: React.ReactNode
  /** Custom error component */
  errorComponent?: React.ReactNode
  /** Refresh interval in milliseconds (0 = no refresh) */
  refreshInterval?: number
}

/**
 * DataFetchBlock - A block that fetches data and provides it to children via context
 *
 * @example
 * ```tsx
 * <DataFetchBlock
 *   dataKey="activeUsers"
 *   source={{ type: 'collection', collection: 'users' }}
 *   query={{ where: { status: { equals: 'active' } } }}
 *   transform={{ type: 'count' }}
 * >
 *   {children}
 * </DataFetchBlock>
 * ```
 */
export function DataFetchBlock({
  dataKey,
  source,
  query,
  transform = { type: 'none' },
  children,
  showLoading = true,
  showError = true,
  loadingComponent,
  errorComponent,
  refreshInterval = 0,
}: DataFetchBlockProps) {
  const parentData = useData() // Get parent context (for nesting)
  const [fetchedData, setFetchedData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let result: any

      if (source.type === 'collection' && source.collection) {
        const params = new URLSearchParams({
          sourceType: 'collection',
          source: source.collection,
        })

        if (query?.limit) params.append('limit', query.limit.toString())
        if (query?.depth) params.append('depth', query.depth.toString())
        if (query?.sort) params.append('sort', query.sort)
        if (query?.where) params.append('where', JSON.stringify(query.where))
        if (query?.select) params.append('select', query.select.join(','))

        const res = await fetch(`/api/data-fetch?${params}`)
        result = await res.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch data')
        }
      } else if (source.type === 'global' && source.global) {
        const params = new URLSearchParams({
          sourceType: 'global',
          source: source.global,
        })

        if (query?.depth) params.append('depth', query.depth.toString())

        const res = await fetch(`/api/data-fetch?${params}`)
        result = await res.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch global')
        }
      } else if (source.type === 'api' && source.endpoint) {
        const res = await fetch(source.endpoint)
        result = await res.json()
      } else {
        throw new Error('Invalid source configuration')
      }

      // Apply transform
      const transformedData = applyTransform(result, transform)
      setFetchedData(transformedData)
    } catch (err: any) {
      console.error('DataFetchBlock error:', err)
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [source, query, transform])

  // Initial fetch
  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh interval
  React.useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval, fetchData])

  // Merge with parent data context
  const contextValue = React.useMemo(
    () => ({
      ...parentData,
      [dataKey]: {
        data: fetchedData?.data ?? fetchedData,
        loading,
        error: error ?? undefined,
        docs: fetchedData?.docs,
        count: fetchedData?.count ?? fetchedData?.totalDocs,
        value: fetchedData?.value,
        sum: fetchedData?.sum,
        average: fetchedData?.average,
        raw: fetchedData,
      },
    }),
    [parentData, dataKey, fetchedData, loading, error],
  )

  // Loading state
  if (loading && showLoading && !fetchedData) {
    return (
      loadingComponent || (
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      )
    )
  }

  // Error state
  if (error && showError) {
    return (
      errorComponent || (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Error loading data</p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )
    )
  }

  return (
    <DataProvider value={contextValue}>
      <DataFetchChildrenRenderer blocks={children} dataKey={dataKey} />
    </DataProvider>
  )
}

/**
 * Render children blocks within DataFetch context
 */
function DataFetchChildrenRenderer({ blocks, dataKey }: { blocks?: any[]; dataKey: string }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-muted-foreground/25 p-4 text-center text-sm text-muted-foreground">
        No children blocks. Add blocks to display data from &quot;{dataKey}&quot;.
      </div>
    )
  }

  // Import PageContentRenderer dynamically to avoid circular dependency
  // The actual rendering will be handled by PageContentRenderer
  return (
    <div className="data-fetch-children space-y-4" data-data-key={dataKey}>
      {blocks.map((block, index) => (
        <DataFetchChildBlock key={index} block={block} />
      ))}
    </div>
  )
}

/**
 * Render a single child block
 * This component handles the mapping from block config to actual components
 */
function DataFetchChildBlock({ block }: { block: any }) {
  // Import block renderers
  // We'll expand this as we add more block types
  const blockType = block?.blockType

  switch (blockType) {
    case 'statCard':
      // Will be rendered by StatCardBlock
      return <StatCardBlockRenderer {...block} />

    case 'richText':
      // Render rich text content
      return (
        <div className="prose dark:prose-invert max-w-none">
          {block.content && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
        </div>
      )

    case 'grid':
      // Render grid of items
      return (
        <div
          className={`grid gap-4 ${
            block.columns === '2'
              ? 'grid-cols-1 md:grid-cols-2'
              : block.columns === '3'
                ? 'grid-cols-1 md:grid-cols-3'
                : block.columns === '4'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {block.items?.map((item: any, index: number) => (
            <DataFetchChildBlock key={index} block={item.content?.[0] || item} />
          ))}
        </div>
      )

    case 'blocksTable':
      // Render blocks table with external data
      return <BlocksTableBlockRenderer {...block} />

    default:
      return (
        <div className="rounded-md border border-muted bg-muted/50 p-4 text-sm text-muted-foreground">
          Unknown block type: {blockType || 'undefined'}
        </div>
      )
  }
}

/**
 * StatCard renderer for DataFetch children
 */
function StatCardBlockRenderer(props: any) {
  // Lazy import StatCardBlock to avoid circular dependency
  const StatCardBlock = React.lazy(() =>
    import('./stat-card-block').then((mod) => ({ default: mod.StatCardBlock })),
  )

  return (
    <React.Suspense fallback={<Skeleton className="h-24 w-full" />}>
      <StatCardBlock {...props} />
    </React.Suspense>
  )
}

/**
 * BlocksTable renderer for DataFetch children
 */
function BlocksTableBlockRenderer(props: any) {
  // Lazy import BlocksTableBlock to avoid circular dependency
  const BlocksTableBlock = React.lazy(() =>
    import('./blocks-table-block').then((mod) => ({ default: mod.BlocksTableBlock })),
  )

  return (
    <React.Suspense
      fallback={
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      }
    >
      <BlocksTableBlock
        {...props}
        useExternalData={props.useExternalData !== false}
        dataKey={props.dataKey}
      />
    </React.Suspense>
  )
}

export default DataFetchBlock
