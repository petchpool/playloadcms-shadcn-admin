'use client'

import * as React from 'react'
import { BlocksTable, type Block } from './blocks-table'
import { Skeleton } from '@/components/ui/skeleton'

type BlocksTableBlockProps = {
  title?: string
  description?: string
  limit?: number
  columns?: string[] // Array of column keys to display
}

export function BlocksTableBlock({
  title,
  description,
  limit = 10,
  columns,
}: BlocksTableBlockProps) {
  const [data, setData] = React.useState<Block[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit,
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
          page: page.toString(),
          limit: pageLimit.toString(),
        })

        const response = await fetch(`/api/blocks?${params}`)

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
    [limit],
  )

  React.useEffect(() => {
    fetchBlocks(1, limit)
  }, [fetchBlocks])

  const handlePageChange = (newPage: number) => {
    fetchBlocks(newPage, pagination.limit)
  }

  const handleLimitChange = (newLimit: number) => {
    fetchBlocks(1, newLimit)
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
          <p className="text-muted-foreground mb-2">No blocks found.</p>
          <p className="text-sm text-muted-foreground">
            Components collection is empty. Run the seed script to populate data.
          </p>
        </div>
      ) : (
        <BlocksTable
          data={data}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  )
}
