'use client'

import * as React from 'react'
import { DataProvider, useData, applyTransform, type TransformType } from './data-context'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { useCollectionStats } from '@/hooks/use-collection-stats'

/**
 * Source configuration for data fetching
 */
type DataSource = {
  /** Source type */
  type: 'collection' | 'global' | 'endpoint'
  /** Collection slug (for collection type) */
  collection?: string
  /** Global slug (for global type) */
  global?: string
  /** API endpoint URL (for endpoint type) */
  endpoint?: string
  /** Optional key to store this source data separately */
  dataKey?: string
  /** Query configuration for this specific source */
  query?: QueryConfig
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
  /** Data source configuration (single source - deprecated, use sources instead) */
  source?: DataSource
  /** Multiple data sources configuration */
  sources?: DataSource[]
  /** Merge strategy for multiple sources */
  mergeStrategy?: 'union' | 'separate'
  /** Query configuration (applied to all sources if not specified per source) */
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
  /** Fetch count statistics for tabs */
  fetchStats?: boolean
  /** Configuration for stats fetching */
  statsConfig?: {
    groupBy?: string
    statsDataKey?: string
    includeValues?: Array<{ value: string }>
  }
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
  sources,
  mergeStrategy = 'union',
  query,
  transform = { type: 'none' },
  children,
  showLoading = true,
  showError = true,
  loadingComponent,
  errorComponent,
  refreshInterval = 0,
  fetchStats = false,
  statsConfig,
}: DataFetchBlockProps) {
  const parentData = useData() // Get parent context (for nesting)
  const [fetchedData, setFetchedData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Normalize sources: use sources array or convert single source to array
  const normalizedSources = React.useMemo(() => {
    if (sources && sources.length > 0) {
      return sources
    }
    if (source) {
      return [source]
    }
    return []
  }, [source, sources])

  // Determine stats collection (use statsCollection from config or first source collection)
  const statsCollection = React.useMemo(() => {
    if (statsConfig?.statsCollection) {
      return statsConfig.statsCollection
    }
    // Auto-detect from first collection source
    const firstCollectionSource = normalizedSources.find((s) => s.type === 'collection')
    return firstCollectionSource?.collection
  }, [statsConfig?.statsCollection, normalizedSources])

  // Memoize values array for stats
  const statsValues = React.useMemo(() => {
    if (!statsConfig?.includeValues) return undefined
    return statsConfig.includeValues.map((v) => v.value)
  }, [statsConfig?.includeValues])

  // Fetch stats if enabled
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useCollectionStats({
    collection: statsCollection || '',
    groupBy: statsConfig?.groupBy || 'status',
    values: statsValues,
    enabled: fetchStats && Boolean(statsCollection),
  })

  const fetchSingleSource = React.useCallback(
    async (sourceConfig: DataSource): Promise<any> => {
      const sourceQuery = sourceConfig.query || query
      let result: any

      if (sourceConfig.type === 'collection' && sourceConfig.collection) {
        const params = new URLSearchParams({
          sourceType: 'collection',
          source: sourceConfig.collection,
        })

        if (sourceQuery?.limit) params.append('limit', sourceQuery.limit.toString())
        if (sourceQuery?.depth) params.append('depth', sourceQuery.depth.toString())
        if (sourceQuery?.sort) params.append('sort', sourceQuery.sort)
        if (sourceQuery?.where) params.append('where', JSON.stringify(sourceQuery.where))
        if (sourceQuery?.select) params.append('select', sourceQuery.select.join(','))

        const res = await fetch(`/api/data-fetch?${params}`)
        result = await res.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch data')
        }
      } else if (sourceConfig.type === 'global' && sourceConfig.global) {
        const params = new URLSearchParams({
          sourceType: 'global',
          source: sourceConfig.global,
        })

        if (sourceQuery?.depth) params.append('depth', sourceQuery.depth.toString())

        const res = await fetch(`/api/data-fetch?${params}`)
        result = await res.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch global')
        }
      } else if (sourceConfig.type === 'endpoint' && sourceConfig.endpoint) {
        const res = await fetch(sourceConfig.endpoint)
        result = await res.json()
      } else {
        throw new Error('Invalid source configuration')
      }

      return result
    },
    [query],
  )

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (normalizedSources.length === 0) {
        throw new Error('No sources configured')
      }

      // Fetch all sources in parallel
      const fetchPromises = normalizedSources.map((sourceConfig) =>
        fetchSingleSource(sourceConfig).catch((err) => {
          console.error(`Error fetching source ${sourceConfig.dataKey || sourceConfig.type}:`, err)
          return { error: err.message, source: sourceConfig }
        }),
      )

      const results = await Promise.all(fetchPromises)

      // Check for errors
      const errors = results.filter((r) => r.error)
      if (errors.length > 0 && errors.length === results.length) {
        throw new Error(errors.map((e) => e.error).join('; '))
      }

      // Merge results based on strategy
      let mergedResult: any

      if (mergeStrategy === 'separate') {
        // Store each source separately under its dataKey
        mergedResult = {}
        results.forEach((result, index) => {
          const sourceConfig = normalizedSources[index]
          const key = sourceConfig.dataKey || `${dataKey}_${index}`
          if (result.error) {
            mergedResult[key] = { error: result.error }
          } else {
            const transformedData = applyTransform(result, transform)
            mergedResult[key] = transformedData
          }
        })
      } else {
        // Union: combine all results into a single array
        const allDocs: any[] = []
        let totalDocs = 0

        results.forEach((result) => {
          if (!result.error) {
            const docs = result.docs || result.data || []
            if (Array.isArray(docs)) {
              allDocs.push(...docs)
              totalDocs += result.totalDocs || docs.length
            } else {
              allDocs.push(result.data || result)
            }
          }
        })

        mergedResult = {
          docs: allDocs,
          data: allDocs,
          totalDocs,
          totalPages: 1,
          page: 1,
          limit: allDocs.length,
          hasNextPage: false,
          hasPrevPage: false,
        }

        // Apply transform to merged result
        mergedResult = applyTransform(mergedResult, transform)
      }

      setFetchedData(mergedResult)
    } catch (err: any) {
      console.error('DataFetchBlock error:', err)
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [normalizedSources, fetchSingleSource, mergeStrategy, transform, dataKey])

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
  const contextValue = React.useMemo(() => {
    const baseContext = { ...parentData }

    if (mergeStrategy === 'separate' && fetchedData) {
      // In separate mode, each source is stored under its own key
      Object.keys(fetchedData).forEach((key) => {
        const sourceData = fetchedData[key]
        baseContext[key] = {
          data: sourceData?.data ?? sourceData,
          loading,
          error: sourceData?.error ?? error ?? undefined,
          docs: sourceData?.docs,
          count: sourceData?.count ?? sourceData?.totalDocs,
          value: sourceData?.value,
          sum: sourceData?.sum,
          average: sourceData?.average,
          raw: sourceData,
        }
      })
      // Also store the main dataKey with all sources
      baseContext[dataKey] = fetchedData
    } else {
      // Union mode or single source: store under main dataKey
      baseContext[dataKey] = {
        data: fetchedData?.data ?? fetchedData,
        loading,
        error: error ?? undefined,
        docs: fetchedData?.docs,
        count: fetchedData?.count ?? fetchedData?.totalDocs,
        value: fetchedData?.value,
        sum: fetchedData?.sum,
        average: fetchedData?.average,
        raw: fetchedData,
      }
    }

    // Store stats data if fetched
    if (fetchStats && statsData) {
      const statsKey = statsConfig?.statsDataKey || 'stats'
      baseContext[statsKey] = {
        stats: statsData.stats,
        total: statsData.total,
        collection: statsData.collection,
        groupBy: statsData.groupBy,
        loading: statsLoading,
        error: statsError ?? undefined,
      }
    }

    return baseContext
  }, [
    parentData,
    dataKey,
    fetchedData,
    loading,
    error,
    mergeStrategy,
    fetchStats,
    statsData,
    statsConfig?.statsDataKey,
    statsLoading,
    statsError,
  ])

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
      <DataFetchChildrenRenderer
        blocks={children}
        dataKey={dataKey}
        fetchStats={fetchStats}
        statsConfig={statsConfig}
      />
    </DataProvider>
  )
}

/**
 * Render children blocks within DataFetch context
 */
function DataFetchChildrenRenderer({
  blocks,
  dataKey,
  fetchStats,
  statsConfig,
}: {
  blocks?: any[]
  dataKey: string
  fetchStats?: boolean
  statsConfig?: any
}) {
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
        <DataFetchChildBlock
          key={index}
          block={block}
          fetchStats={fetchStats}
          statsConfig={statsConfig}
        />
      ))}
    </div>
  )
}

/**
 * Render a single child block
 * This component handles the mapping from block config to actual components
 */
function DataFetchChildBlock({
  block,
  fetchStats,
  statsConfig,
}: {
  block: any
  fetchStats?: boolean
  statsConfig?: any
}) {
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
            <DataFetchChildBlock
              key={index}
              block={item.content?.[0] || item}
              fetchStats={fetchStats}
              statsConfig={statsConfig}
            />
          ))}
        </div>
      )

    case 'blocksTable':
      // Render blocks table with external data
      return (
        <BlocksTableBlockRenderer
          {...block}
          fetchStats={fetchStats}
          statsConfig={statsConfig}
        />
      )

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
        fetchStats={props.fetchStats || false}
        statsConfig={props.statsConfig}
        useParentStats={props.useExternalData !== false && props.fetchStats !== false}
      />
    </React.Suspense>
  )
}

export default DataFetchBlock
